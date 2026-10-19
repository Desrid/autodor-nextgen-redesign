document.addEventListener("click",function(event){
  const anchor=event.target.closest && event.target.closest("a[href]");
  if(!anchor)return;
  const href=anchor.getAttribute("href");
  if(href.includes("for_drivers/calculation") || href==="#calculator-title"){
    event.preventDefault();event.stopImmediatePropagation();
    if(location.pathname.replace(/\/$/,"")==="/road-users"){
      document.querySelector('section[aria-label="Построение маршрута"] form')?.requestSubmit();
      document.getElementById("calculator-title")?.scrollIntoView({behavior:"smooth"});
    }else location.assign("/road-users/?demoRoute=rostov-moscow#calculator-title");
    return;
  }
  if(!/^https?:/i.test(href))return;
  const url=new URL(href,location.href);
  if(url.origin===location.origin)return;
  event.preventDefault();event.stopImmediatePropagation();
  const old=document.getElementById("offline-link-dialog");if(old)old.remove();
  const dialog=document.createElement("dialog");dialog.id="offline-link-dialog";
  dialog.style.cssText="max-width:440px;padding:28px;border:1px solid #dedbd5;border-radius:16px;font:16px/1.5 Montserrat,Arial,sans-serif;color:#2d2a26";
  const title=document.createElement("strong");title.textContent="Внешний сервис";title.style.fontSize="22px";
  const text=document.createElement("p");text.textContent="Эта ссылка ведёт на «"+url.hostname+"». Для перехода потребуется интернет. Основные страницы и сохранённый маршрут доступны в этой версии автономно.";
  const close=document.createElement("button");close.textContent="Вернуться к демонстрации";close.style.cssText="padding:12px 18px;border:0;border-radius:8px;background:#ff5100;color:white;font:inherit;cursor:pointer";
  close.onclick=()=>{dialog.close();dialog.remove();};dialog.append(title,text,close);document.body.append(dialog);dialog.showModal();
},true);
