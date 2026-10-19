const { chromium } = require("@playwright/test");
const {spawn} = require("node:child_process");
const fs=require("node:fs");const path=require("node:path");const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../..");
const packagePath=process.argv[2]; if(!packagePath)throw new Error("Package path is required");
const output=path.join(root,".artifacts/portable-qa");fs.mkdirSync(output,{recursive:true});
(async()=>{
 const child=spawn(path.join(process.env.SystemRoot,"System32/cmd.exe"),["/d","/c",path.join(packagePath,"START.cmd")],{cwd:packagePath,env:{...process.env,PATH:path.join(process.env.SystemRoot,"System32"),AUTODOR_NO_OPEN:"1"},windowsHide:true});
 let log="";child.stderr.on("data",d=>process.stderr.write(d));
 let timer;const url=await new Promise((resolve,reject)=>{timer=setTimeout(()=>reject(new Error("Launcher did not start: "+log)),30000);child.stdout.on("data",d=>{log+=d;const m=log.match(/http:\/\/127\.0\.0\.1:\d+\//);if(m){clearTimeout(timer);resolve(m[0]);}});child.on("exit",code=>reject(new Error("Launcher exited "+code+" "+log)));});
 console.log("Launcher OK, system Node absent from PATH, "+url);
 const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
 const external=[],errors=[],failed=[],checks=[];
 await context.route("**/*",route=>{const requestUrl=route.request().url();if(requestUrl.startsWith(url)||requestUrl.startsWith('data:')||requestUrl.startsWith('blob:'))return route.continue();external.push(requestUrl);return route.abort();});
 const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)failed.push([r.status(),r.url()]);});
 try{
  for(const route of ["/","/about/","/account/","/road-users/"]){await page.goto(new URL(route,url).href,{waitUntil:"networkidle"});await page.locator("main").waitFor();
    const height=await page.locator('body').evaluate(el=>el.scrollHeight);
    for(let y=0;y<height;y+=750){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(70);}
    await page.evaluate(()=>window.scrollTo(0,0));await page.waitForLoadState('networkidle');
    checks.push("page and lazy media "+route);}
  const signal=page.locator("button[data-traffic-demo]");assert.equal(await signal.locator("strong").innerText(),"Свободно");assert.equal(await signal.getByText("Демо",{exact:true}).count(),0);await signal.click();assert.equal(await signal.locator("strong").innerText(),"Замедление");checks.push("traffic signal defaults free and clicks");
  const planner=page.getByRole("region",{name:"Построение маршрута"});
  const start=Date.now();await planner.getByRole("button",{name:"Рассчитать стоимость",exact:true}).click();await page.getByRole("complementary",{name:"Помощник в поездке"}).waitFor();
  const elapsed=Date.now()-start;assert(elapsed<1800,"Instant route took "+elapsed);
  assert.equal(await planner.getByPlaceholder("Откуда",{exact:true}).inputValue(),"Ростов-на-Дону");assert.equal(await planner.getByPlaceholder("Куда",{exact:true}).inputValue(),"Москва");
  await planner.locator(".leaflet-image-layer").waitFor();await planner.locator(".leaflet-overlay-pane svg path.leaflet-interactive").waitFor();checks.push("instant Rostov to Moscow route "+elapsed+"ms");
  await planner.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(output,"route-1440.png"),fullPage:false});
  await planner.getByRole('button',{name:'Приблизить карту',exact:true}).click();
  await planner.getByRole('button',{name:'Отдалить карту',exact:true}).click();
  await planner.getByRole('button',{name:'Фильтры',exact:true}).click();
  const filterDialog=page.getByRole('dialog',{name:'Фильтрация точек маршрута'});
  await filterDialog.getByRole('checkbox',{name:'Заправки'}).uncheck();
  await filterDialog.getByRole('checkbox',{name:'Заправки'}).check();
  await planner.getByRole('button',{name:'Фильтры',exact:true}).click();
  await planner.getByRole('button',{name:'Развернуть карту',exact:true}).click();
  await planner.locator('.leaflet-image-layer').waitFor();
  await planner.getByRole('button',{name:'Свернуть карту',exact:true}).click();
  const poi=planner.locator('.leaflet-marker-icon[title="Точка по пути"]').first();
  if(await poi.count()){await poi.hover();await planner.getByText('Место, где можно сделать остановку и посмотреть окрестности.',{exact:true}).waitFor();checks.push('offline POI tooltip');}
  checks.push('map zoom, filters and expansion');
  await page.getByRole('link',{name:'О компании',exact:true}).first().click();
  await page.waitForURL('**/about/');
  await page.locator('main').waitFor();
  await page.getByRole('link',{name:'Личный кабинет',exact:true}).first().click();
  await page.waitForURL('**/account/');
  checks.push('client navigation about and account');
  await page.goto(url,{waitUntil:"networkidle"});
  const calculator=page.getByRole('link',{name:/Калькулятор маршрута/}).first();await calculator.click();await page.waitForURL('**/road-users/?demoRoute=rostov-moscow#calculator-title');await page.getByRole('complementary',{name:'Помощник в поездке'}).waitFor();checks.push('home calculator opens prepared route');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'route-390.png'),fullPage:false});checks.push('mobile screenshot');
  assert.deepEqual(external,[],"External requests: "+JSON.stringify(external));assert.deepEqual(errors,[],"Browser errors: "+JSON.stringify(errors));assert.deepEqual(failed,[],"Missing local resources: "+JSON.stringify(failed));
  fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({checks,external,errors,failed,url},null,2));console.log(JSON.stringify({checks,external,errors,failed},null,2));
 }finally{await browser.close();await new Promise(resolve=>{const kill=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});kill.on('exit',resolve);});}
})().catch(e=>{console.error(e);process.exitCode=1;});
