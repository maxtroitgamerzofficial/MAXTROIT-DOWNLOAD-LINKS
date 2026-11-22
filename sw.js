const CACHE="maxtroit-pwa-icons-v1";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("message",e=>{
 const d=e.data||{};if(d.type!=="UPDATE_PWA_ICON"||![192,512].includes(Number(d.size))||typeof d.dataUrl!=="string"||!d.dataUrl.startsWith("data:image/png;base64,"))return;
 e.waitUntil((async()=>{const response=await fetch(d.dataUrl);const cache=await caches.open(CACHE);await cache.put("/pwa-icon-"+d.size+".png",response)})());
});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);const m=u.pathname.match(/^\/pwa-icon-(192|512)\.png$/);
 if(m){e.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(e.request)||fetch("/pwa-icon.svg")})());}
});
