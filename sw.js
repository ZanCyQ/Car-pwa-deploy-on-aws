const CACHE_NAME = 'carzone-cache-v1';
'/style.css',
'/main.js',
'/manifest.json',
'/images/icon-192x192.png',
'/images/icon-512x512.png'
];


self.addEventListener('install', event => {
self.skipWaiting();
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(PRECACHE_ASSETS))
);
});


self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys => Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) return caches.delete(key);
})
))
);
self.clients.claim();
});


self.addEventListener('fetch', event => {
const req = event.request;
const url = new URL(req.url);


// For navigation requests, serve index.html (app shell)
if (req.mode === 'navigate') {
event.respondWith(
fetch(req).catch(() => caches.match(OFFLINE_URL))
);
return;
}


// Try cache first, fallback to network, then to cache
event.respondWith(
caches.match(req).then(cached => cached || fetch(req).then(networkRes => {
// Optionally put fetched resource into cache
return caches.open(CACHE_NAME).then(cache => {
// Only cache GET requests and same-origin
if (req.method === 'GET' && url.origin === location.origin) {
cache.put(req, networkRes.clone());
}
return networkRes;
});
}).catch(() => {
// final fallback for images: placeholder
if (req.destination === 'image') return caches.match('/images/icon-192x192.png');
}))
);
});
