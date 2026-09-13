const CACHE="deutsch-woerter-v8";
const ASSETS=[
  "./index.html",
  "./app.webmanifest",
  "./icon.svg",
  "./cards.json?v=1",
  "./learn.css?v=1",
  "./learn.js?v=2",
  "./zh-a1-1-6.json?v=1",
  "./zh-a1-7-12.json?v=1",
  "./zh-a2-1-6.json?v=1",
  "./zh-a2-7-12.json?v=1"
];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put("./index.html",copy));
      return r;
    }).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
    if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  })));
});