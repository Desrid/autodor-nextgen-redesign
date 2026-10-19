const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const root = path.join(__dirname, "site");
const aliases = fs.existsSync(path.join(__dirname,"asset-aliases.json")) ? JSON.parse(fs.readFileSync(path.join(__dirname,"asset-aliases.json"),"utf8")) : {};
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json", ".txt":"text/plain; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp", ".avif":"image/avif", ".gif":"image/gif", ".mp4":"video/mp4", ".webm":"video/webm", ".woff2":"font/woff2", ".woff":"font/woff", ".ttf":"font/ttf", ".ico":"image/x-icon" };
let browserConfirmed = false;
const server = http.createServer((req,res) => {
  if (!browserConfirmed && req.url === "/" && /Chrome|Firefox|Edg\//.test(req.headers["user-agent"] || "")) {
    browserConfirmed = true;
    console.log("Browser connected to the demo.");
  }
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname); }
  catch { res.writeHead(400).end(); return; }
  pathname=aliases[pathname] || pathname;
  let file=path.resolve(root,"."+pathname);
  if (file!==root && !file.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file=path.join(file,"index.html");
    const stat=fs.statSync(file);
    const headers={"Content-Type":mime[path.extname(file)]||"application/octet-stream", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff", "Referrer-Policy":"no-referrer", "Content-Security-Policy":"default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; media-src 'self' blob:; object-src 'none'; frame-src 'none'"};
    const range=req.headers.range;
    if(range && /^bytes=\d*-\d*$/.test(range)) {
      const [a,b]=range.slice(6).split('-');
      const start=a?Number(a):Math.max(0,stat.size-Number(b));
      const end=a?(b?Math.min(Number(b),stat.size-1):stat.size-1):stat.size-1;
      if(start>end||start>=stat.size){res.writeHead(416,{"Content-Range":`bytes */${stat.size}`}).end();return;}
      res.writeHead(206,{...headers,"Content-Range":`bytes ${start}-${end}/${stat.size}`,"Accept-Ranges":"bytes","Content-Length":end-start+1});
      if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
    } else {
      res.writeHead(200,{...headers,"Content-Length":stat.size,"Accept-Ranges":"bytes"});
      if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
    }
  } catch { res.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"}).end("Page not included in offline demo"); }
});
function openBrowser(url) {
  const systemRoot = process.env.SystemRoot || "C:\\Windows";
  const powershell = path.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  const command = "$ErrorActionPreference='Stop'; Start-Process -FilePath '" + url + "'";
  const opener = spawn(powershell, ["-NoProfile", "-NonInteractive", "-Command", command], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
  let fallbackStarted = false;
  const fallback = () => {
    if (fallbackStarted) return;
    fallbackStarted = true;
    const candidates = [
      path.join(process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(process.env.ProgramFiles || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(process.env.ProgramFiles || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
      path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
      path.join(process.env.ProgramFiles || "C:\\Program Files", "Mozilla Firefox", "firefox.exe"),
    ];
    const browser = candidates.find(candidate => fs.existsSync(candidate));
    if (!browser) { console.log("Open OPEN-SITE.url or copy the address above into your browser."); return; }
    const child = spawn(browser, [url], { detached: true, stdio: "ignore" });
    child.on("error", () => console.log("Open OPEN-SITE.url or copy the address above into your browser."));
    child.unref();
  };
  opener.on("error", fallback);
  opener.on("exit", code => { if (code !== 0) fallback(); });
  opener.stderr.on("data", () => {});
  const timer = setTimeout(() => { opener.kill(); fallback(); }, 12000);
  timer.unref();
  opener.once("exit", () => clearTimeout(timer));
}
server.listen(0,"127.0.0.1",()=>{
  const url=`http://127.0.0.1:${server.address().port}/`;
  try { fs.writeFileSync(path.join(__dirname,"..","OPEN-SITE.url"), "[InternetShortcut]\r\nURL=" + url + "\r\n", "utf8"); }
  catch { console.log("Could not write the optional OPEN-SITE.url shortcut."); }
  console.log("\nAUTODOR OFFLINE DEMO\n\n"+url+"\n\nKeep this window open during the demo. Close it to stop.\nIf the browser does not open, double-click OPEN-SITE.url.\nInternet access and software installation are not required.\n");
  if(!process.env.AUTODOR_NO_OPEN)openBrowser(url);
});
server.on("error",error=>{console.error(error.message);process.exitCode=1;});
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>server.close(()=>process.exit(0)));
