import sys,shutil,json,hashlib,zipfile,datetime
from pathlib import Path
root=Path(__file__).resolve().parents[2]
info=json.loads((root/'.artifacts/portable-latest.json').read_bytes())
package=Path(info['package']);app=package/'app';site=app/'site'
shutil.copy2(root/'.tools/portable/server.cjs',app/'server.cjs')
shutil.copy2(root/'.tools/portable/START.cmd',package/'START.cmd')
# Next 16 on Windows writes some static segment payloads in subdirectories,
# while the browser requests the encoded dotted filenames.
for file in list(site.rglob('*.txt')):
 relative=file.relative_to(site).as_posix()
 if '/__next.' in relative:
  prefix,suffix=relative.split('/__next.',1)
  flat=site/(prefix+'/__next.'+suffix.replace('/','.'))
  if flat!=file:shutil.copy2(file,flat)
seen={};aliases=json.loads((app/'asset-aliases.json').read_bytes()) if (app/'asset-aliases.json').exists() else {};saved=info.get('deduplicatedBytes',0)
for directory in [site/'media',site/'brand']:
 for file in directory.rglob('*'):
  if not file.is_file():continue
  digest=hashlib.sha256(file.read_bytes()).hexdigest()
  url='/'+file.relative_to(site).as_posix()
  if digest in seen:
   aliases[url]=seen[digest];saved+=file.stat().st_size;file.unlink()
  else:seen[digest]=url
(app/'asset-aliases.json').write_text(json.dumps(aliases,ensure_ascii=False,indent=2),encoding='utf-8')
manifestPath=app/'MANIFEST.json';manifest=json.loads(manifestPath.read_bytes());manifest['files']={}
manifest['deduplicatedBytes']=saved
for file in package.rglob('*'):
 if file.is_file() and file!=manifestPath:manifest['files'][file.relative_to(package).as_posix()]=hashlib.sha256(file.read_bytes()).hexdigest()
manifestPath.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
archive=Path(info['archive'])
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for file in package.rglob('*'):
  if file.is_file():z.write(file,Path('Autodor-Offline')/file.relative_to(package))
info.update(bytes=archive.stat().st_size,sha256=hashlib.sha256(archive.read_bytes()).hexdigest(),files=len(manifest['files']),deduplicatedBytes=saved)
(root/'.artifacts/portable-latest.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False,indent=2),flush=True)
