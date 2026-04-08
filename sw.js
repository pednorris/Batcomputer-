const CACHE_NAME = 'bat-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://v.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2JxeG9qM2R0YnR0YmZ0YmZ0YmZ0YmZ0YmZ0YmZ0YmZ0YmZ0JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD12/9u1fQYQG2I5z2/giphy.mp4',
  'https://i.imgur.com/B70pGfK.png',
  'https://i.imgur.com/2Xy5s6a.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
