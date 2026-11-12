/* Работа без интернета: сайт, фото и последние данные сохраняются в телефоне. */
const CACHE = 'arhiv-vko-v24';
// картинки и шрифты больше не вшиты в index.html (ТЗ 7.2) — сохраняем их сразу, чтобы сайт работал без сети
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon-48.png', 'icons/favicon-64.png', 'img/logo.webp', 'img/building.jpg', 'img/hero-archive.jpg',
  'img/arc-map.jpg', 'img/arc-pier.jpg', 'img/arc-sport.jpg', 'img/arc-yurt.jpg', 'img/ust-kamenogorsk-arms.png', 'img/symbols/rk-flag.jpg', 'img/symbols/rk-emblem.webp',
  'fonts/Inter-Regular.woff', 'fonts/Inter-SemiBold.woff', 'fonts/Lora.woff', 'fonts/PTSerif-Bold-cyrillic.woff2', 'fonts/PTSerif-Bold-cyrillic-ext.woff2', 'fonts/PTSerif-Bold-latin.woff2'];

self.addEventListener('install', e => {
  // данные сайта лежат в site-data.<хеш>.js (ТЗ 7.2): имя берём из свежей index.html и тоже сохраняем
  const data = c => fetch('index.html', {cache:'no-cache'}).then(r => r.text()).then(h => { const ms = [...new Set([...h.matchAll(/\/((?:site-data|app|qr)\.[a-f0-9]{10}\.js)/g)].map(x => x[1]))]; return ms.length ? c.addAll(ms) : null; }).catch(() => {});
  e.waitUntil(caches.open(CACHE).then(c => Promise.all([c.addAll(CORE).catch(() => {}), data(c)])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const networkFirst = (req, key) => fetch(req).then(r => {
  if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key || req, copy)); }
  return r;
}).catch(() => caches.match(key || req));

self.addEventListener('fetch', e => {
  const req = e.request; const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname === '/api/health' || url.pathname === '/api/public') { e.respondWith(networkFirst(req)); return; }
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/docs/')) return;   // большие PDF (до 13 МБ) не кэшируем: открываются из сети
  if (url.pathname === '/pages/catalog.json' || url.pathname === '/pages/calendar.json') { e.respondWith(networkFirst(req)); return; }   // каталог меняется правками сотрудников; без сети берём последнюю копию
  if (req.mode === 'navigate') {   // понятные адреса (/catalog/…) кэшируются отдельно, без сети открывается обычная главная
    const root = url.pathname === '/' || url.pathname === '/index.html';
    e.respondWith(root ? networkFirst(req, 'index.html') : fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
