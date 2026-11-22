const CACHE="maxtroit-pwa-icons-v3";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("message",e=>{
 const icons=e.data?.icons;
 if(!icons||typeof icons[192]!=="string"||typeof icons[512]!=="string")return;
 e.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(const size of [192,512]){
   const raw=icons[size].split(",");
   if(raw.length!==2||!raw[0].includes("image/png"))continue;
   const binary=atob(raw[1]),bytes=new Uint8Array(binary.length);
   for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
   await cache.put("/pwa-icon-"+size+".png",new Response(bytes,{headers:{"Content-Type":"image/png","Cache-Control":"no-cache"}}));
  }
 })());
});
self.addEventListener("fetch",e=>{
 const u=new URL(e.request.url);
 if(u.origin===self.location.origin&&/^\/pwa-icon-(192|512)\.png$/.test(u.pathname)){
  e.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(u.pathname)||fetch(e.request)})());
 }
});
