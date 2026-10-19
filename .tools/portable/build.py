"""Build a Windows x64 offline demo from the current integration source, without changing its normal build."""
import os,sys,shutil,subprocess,json,hashlib,zipfile,re,datetime
from pathlib import Path
root=Path(__file__).resolve().parents[2]
stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
work=root/'.artifacts'/('portable-build-'+stamp)
src=work/'source'; src.mkdir(parents=True)
for name in ['app','public']:
 shutil.copytree(root/name,src/name,ignore=shutil.ignore_patterns('*.test.*','*.stories.*','*.spec.*'))
for name in ['package.json','tsconfig.json','postcss.config.mjs','next-env.d.ts']:
 shutil.copy2(root/name,src/name)
subprocess.run(['cmd','/c','mklink','/J',str(src/'node_modules'),str(root/'node_modules')],check=True,capture_output=True)
(src/'next.config.ts').write_text('import type { NextConfig } from "next";\nconst config: NextConfig = { output:"export", trailingSlash:true, images:{unoptimized:true}, poweredByHeader:false, experimental:{cpus:2}, turbopack:{root:'+json.dumps(str(root))+'} };\nexport default config;\n',encoding='utf-8')
css=src/'app/globals.css'
css.write_text(re.sub(r'@import url\("https://fonts.googleapis.com/[^\n]+\n','@import url("/offline/montserrat.css");\n',css.read_text(encoding='utf-8'),count=1),encoding='utf-8')
env=os.environ.copy();env['NEXT_PUBLIC_PORTABLE_DEMO']='true';env['NEXT_TELEMETRY_DISABLED']='1'
node=Path(shutil.which('node'))
subprocess.run([str(node),str(root/'node_modules/next/dist/bin/next'),'build','--webpack'],cwd=src,env=env,check=True)
package=work/'Autodor-Offline';app=package/'app';app.mkdir(parents=True)
shutil.copytree(src/'out',app/'site')
shutil.copy2(root/'.tools/portable/server.cjs',app/'server.cjs')
shutil.copy2(root/'.tools/portable/START.cmd',package/'START.cmd')
(app/'runtime').mkdir();shutil.copy2(node,app/'runtime/node.exe')
shutil.copy2(root/'public/offline/node-LICENSE.txt',app/'runtime/LICENSE.txt')
shutil.copy2(root/'.tools/portable/offline-guard.js',app/'site/offline/offline-guard.js')
for html in (app/'site').rglob('*.html'):
 text=html.read_text(encoding='utf-8').replace('</head>','<script src="/offline/offline-guard.js" defer></script></head>')
 html.write_text(text,encoding='utf-8')
for suffix in ['*.geojson','rostov-moscow-osrm.json']:
 for data in (app/'site/offline').glob(suffix):data.unlink()
(app/'ИНСТРУКЦИЯ.txt').write_text('АВТОДОР — АВТОНОМНАЯ ДЕМОНСТРАЦИЯ\n\n1. Полностью распакуйте архив в любую папку.\n2. Дважды нажмите START.cmd.\n3. Сайт откроется в браузере автоматически. Оставьте окно запуска открытым.\n4. Для завершения закройте окно запуска.\n\nWindows 10/11, 64 бита. Достаточно установленного браузера. Node.js и интернет устанавливать/подключать не нужно. Путь к папке может содержать пробелы и кириллицу.\n\nВ комплект включены главная страница, О компании, Пользователям дорог и Личный кабинет, изображения, видео, шрифты, локальная карта.\nКнопка «Рассчитать стоимость» сразу показывает сохранённый маршрут Ростов-на-Дону — Москва (1082 км) независимо от заполнения полей. Карта, масштабирование, фильтры и подсказки работают без сети. Стоимость и дорожные прогнозы — демонстрационные данные, не действующие тарифы. Внешние сервисы в автономную версию не входят.\n\nЗапуск использует только этот ноутбук и свободный локальный порт. Доступ к серверам разработчиков не нужен. Ничего не устанавливается, права администратора не требуются. На других устройствах сайт не доступен.\n',encoding='utf-8-sig')
manifest={"built":stamp,"sourceHead":subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),"platform":"windows-x64","entry":"START.cmd","route":"Ростов-на-Дону — Москва","files":{}}
for file in package.rglob('*'):
 if file.is_file():manifest['files'][file.relative_to(package).as_posix()]=hashlib.sha256(file.read_bytes()).hexdigest()
(app/'MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
# Keep the final user deliverable inside the explicitly shared workspace.
dest=Path(r'C:\Users\Даниил\Documents\Агенты\autodor-nextgen-redesign\artifacts\portable')
dest.mkdir(parents=True,exist_ok=True)
archive=dest/('Autodor-Offline-Windows-'+stamp+'.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for file in package.rglob('*'):
  if file.is_file():z.write(file,Path('Autodor-Offline')/file.relative_to(package))
result={"archive":str(archive),"package":str(package),"bytes":archive.stat().st_size,"sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"files":len(manifest['files'])}
(root/'.artifacts/portable-latest.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
subprocess.run([sys.executable,str(root/'.tools/portable/package.py')],cwd=root,check=True)
