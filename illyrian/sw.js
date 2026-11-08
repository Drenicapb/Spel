/* Illyrian Domination – offlinestöd. Version 7.5 */
const C = 'illyrian-7.5';
const FILES = ["./","index.html","terrain.jpg","clouds.webp","cover.jpg","manifest.webmanifest","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('illyrian-') && k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || /\.mp4$|version\.json$/.test(new URL(r.url).pathname)) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => { const net = fetch(r).then(res => { if (res.ok) caches.open(C).then(c => c.put(r, res.clone())); return res; }).catch(() => hit); return hit || net; }));
});
