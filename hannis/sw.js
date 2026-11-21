// Hannis – offlinestöd. Network-first: nya versioner hämtas när du är online, annars används det sparade.
// Höj versionen i CACHE när spelet ändras.
const CACHE='hannis-1.2.1';
const FILES=['./','index.html','game.js','fredoka.woff2','manifest.webmanifest','img/icon-192.png','img/icon-512.png','img/apple-touch-icon.png','img/favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('hannis-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
