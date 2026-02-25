const CACHE_NAME = 'memesoundboard-v2';
const urlsToCache = [
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache static assets only (never cache HTML)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - network-first for HTML, cache-first only for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation/document requests: always prefer network (fixes stale HTML → broken CSS)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (manifest, favicon, etc.): cache-first is fine
  if (url.pathname === '/manifest.json' || url.pathname === '/favicon.ico') {
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request))
    );
    return;
  }

  // Everything else (CSS, JS, images): bypass SW, go straight to network
  // This prevents stale chunks from breaking the site after deploys
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
