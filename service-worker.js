self.addEventListener('install', event => {
  console.log('✅ Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('🔄 Service Worker activated');
});

self.addEventListener('push', event => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: 'icon-192.png',     // 小アイコン（色変更するなら差し替え）
    badge: 'icon-192.png',    // 通知ドット
    image: data.image || undefined, // 任意の画像通知
    tag: 'push-demo'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
