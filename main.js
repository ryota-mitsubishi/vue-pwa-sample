const vapidPublicKey = 'BHMLj0JRh9dR1W8fR5GrlPyTHbHt7vohRhArEqGfXfDANtFZCIusKt27lgtTVt2ryj0IFc3rlNMt8UatZEEvnEg';
let subscription = null;
let deferredPrompt = null;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  return new Uint8Array([...window.atob(base64)].map(c => c.charCodeAt(0)));
}

async function subscribe() {
  const reg = await navigator.serviceWorker.register('/service-worker.js'); // ✔️ 絶対パスに修正
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('通知が許可されていません');
    return;
  }

  subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });

  document.getElementById('output').textContent = JSON.stringify(subscription, null, 2);
}

function sendDelayedNotification() {
  if (!subscription) {
    alert("📩 まず通知を購読してください！");
    return;
  }

  const delay = parseInt(document.getElementById('delaySeconds').value) || 5;

  setTimeout(() => {
    fetch('/sendNotification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription,
        title: `${delay}秒後の通知`,
        body: `これは${delay}秒後に送られた通知です📲`,
        image: 'banner.png'
      })
    });
  }, delay * 1000);
}

// PWA インストール用ロジック
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'inline-block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`ユーザーの選択: ${outcome}`);
    deferredPrompt = null;
    document.getElementById('installBtn').style.display = 'none';
  }
});
