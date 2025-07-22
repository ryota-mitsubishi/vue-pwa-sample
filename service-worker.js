self.addEventListener('install', event => {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  console.log('📨 Push event received:', event);
  
  let data = { title: 'デフォルト通知', body: 'プッシュ通知のテストです' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.log('Push data parsing error:', e);
    }
  }

  const options = {
    body: data.body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    image: data.image || undefined,
    tag: 'push-demo',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
