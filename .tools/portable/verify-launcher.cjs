const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const packagePath=process.argv[2];
(async()=>{
 const env={...process.env,PATH:path.join(process.env.SystemRoot,'System32')};delete env.AUTODOR_NO_OPEN;
 const child=spawn(path.join(process.env.SystemRoot,'System32/cmd.exe'),['/d','/c',path.join(packagePath,'START.cmd')],{cwd:packagePath,env,windowsHide:true});
 let log='';let errors='';let watchdog;
 try{
  await new Promise((resolve,reject)=>{
   watchdog=setTimeout(()=>reject(new Error('Browser did not connect. '+log+' '+errors)),25000);
   child.stdout.on('data',data=>{log+=data;if(log.includes('Browser connected to the demo.')){clearTimeout(watchdog);resolve();}});
   child.stderr.on('data',data=>{errors+=data;});
   child.on('exit',code=>reject(new Error('Launcher exited '+code+' '+log+' '+errors)));
  });
  const url=log.match(/http:\/\/127\.0\.0\.1:\d+\//)[0];
  const shortcut=fs.readFileSync(path.join(packagePath,'OPEN-SITE.url'),'utf8');assert(shortcut.includes('URL='+url));
  const response=await fetch(url);assert.equal(response.status,200);assert((await response.text()).includes('Автодор'));
  console.log(JSON.stringify({realAutomaticBrowserOpen:true,browserRequestConfirmed:true,shortcutValid:true,httpStatus:response.status,url,systemNodeInPath:false,stderr:errors},null,2));
 }finally{
  clearTimeout(watchdog);
  await new Promise(resolve=>{const stop=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});stop.on('exit',resolve);});
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
