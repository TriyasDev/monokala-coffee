const CACHE_NAME = 'monokala-static-v15';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/product.html',
  '/moments.html',
  '/event.html',
  '/login.html',
  '/css/style.css?v=15',
  '/js/theme-init.js?v=15',
  '/js/main.js?v=15',
  '/js/logic.js',
  '/js/auth.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/firebase-applet-config.json') return;

  // Network-first so style/HTML updates apply immediately, falling back to cache offline
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
