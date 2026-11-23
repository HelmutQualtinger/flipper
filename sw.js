// Service worker: precache the whole game for offline play, update in the background.
const CACHE = 'pinball-v10';
const ASSETS = [
  './', 'index.html', 'pwa.js', 'manifest.webmanifest',
  'main.js?v=10', 'sound.js?v=10', 'layout.js', 'art.js',
  'themes/index.js', 'themes/red.js', 'themes/hawaii.js', 'themes/synthwave.js', 'themes/space.js', 'themes/pirate.js',
  'lib/three.module.js', 'lib/RoomEnvironment.js',
  'lib/postprocessing/EffectComposer.js', 'lib/postprocessing/Pass.js', 'lib/postprocessing/RenderPass.js',
  'lib/postprocessing/ShaderPass.js', 'lib/postprocessing/MaskPass.js', 'lib/postprocessing/UnrealBloomPass.js',
  'lib/postprocessing/OutputPass.js', 'lib/shaders/CopyShader.js', 'lib/shaders/LuminosityHighPassShader.js',
  'lib/shaders/OutputShader.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// stale-while-revalidate for same-origin GET requests
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
