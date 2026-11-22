const CACHE="maxtroit-pwa-brand-v2";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("message",e=>{
 const d=e.data||{};
 if(d.type!=="UPDATE_PWA_LOGO"||typeof d.logo!=="string"||!/^data:image\/(png|jpeg|webp);base64,/i.test(d.logo))return;
 e.waitUntil((async()=>{
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><image href="'+d.logo+'" width="512" height="512" preserveAspectRatio="xMidYMid meet"/></svg>';
  const cache=await caches.open(CACHE);
  await cache.put("/pwa-icon.svg",new Response(svg,{headers:{"Content-Type":"image/svg+xml","Cache-Control":"no-cache"}}));
 })());
});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin&&u.pathname==="/pwa-icon.svg"){
  e.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match("/pwa-icon.svg")||fetch(e.request)})());
 }
});
