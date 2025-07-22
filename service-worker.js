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
  
  let data = { 
    title: '🔔 重要な通知！', 
    body: 'プッシュ通知のテストです',
    urgency: 'high'
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.log('Push data parsing error:', e);
    }
  }

  const options = {
    body: data.body,
    icon: '/vue-pwa-sample/icon-192.png',
    badge: '/vue-pwa-sample/icon-192.png',
    image: data.image || undefined,
    tag: 'push-demo-' + Date.now(), // 複数通知を表示するため
    
    // 視認性を高めるオプション
    requireInteraction: true,        // ユーザーが操作するまで消えない
    silent: false,                   // 音を鳴らす
    vibrate: [200, 100, 200, 100, 200], // バイブレーション（200ms振動、100ms停止を繰り返し）
    
    // 通知の重要度設定
    urgency: data.urgency || 'high', // 'very-low', 'low', 'normal', 'high'
    
    // 通知にボタンを追加
    actions: [
      {
        action: 'open',
        title: '📱 開く',
        icon: '/vue-pwa-sample/icon-192.png'
      },
      {
        action: 'close',
        title: '❌ 閉じる',
        icon: '/vue-pwa-sample/icon-192.png'
      }
    ],
    
    // データの付与
    data: {
      url: data.url || '/vue-pwa-sample/',
      timestamp: Date.now(),
      ...data
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知クリック時の処理
self.addEventListener('notificationclick', event => {
  console.log('🖱️ 通知がクリックされました:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    // 閉じるアクションの場合は何もしない
    return;
  }
  
  // 通知またはアクションボタンがクリックされた場合
  const urlToOpen = event.notification.data?.url || '/vue-pwa-sample/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // 既に開いているタブがあるかチェック
      for (const client of clientList) {
        if (client.url.includes('/vue-pwa-sample/') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 新しいタブまたはウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 通知を閉じた時の処理
self.addEventListener('notificationclose', event => {
  console.log('❌ 通知が閉じられました:', event);
  
  // 分析用のイベント送信などをここで行える
  // event.waitUntil(
  //   fetch('/api/notification-closed', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       tag: event.notification.tag,
  //       timestamp: Date.now()
  //     })
  //   })
  // );
});
