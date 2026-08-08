// Minimal service worker — its main job is just to exist and respond to
// fetch, which is what makes Chrome/Android treat the app as installable.
// Deliberately no offline caching: this app is Supabase-backed, stale
// cached data would be worse than no cache at all.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})
