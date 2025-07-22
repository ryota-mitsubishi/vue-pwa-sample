async function subscribe() {
    try {
        updateStatus('🔄 Service Workerを登録中...', 'info');
        
        // Service Workerの登録（GitHub Pages用のパス）
        if (!serviceWorkerRegistration) {
            // GitHub Pagesでは絶対パスで指定
            serviceWorkerRegistration = await navigator.serviceWorker.register('/vue-pwa-sample/service-worker.js', {
                scope: '/vue-pwa-sample/'
            });
            console.log('✅ Service Worker registered:', serviceWorkerRegistration);
        }
        
        // Service Workerがアクティブになるまで待つ
        await navigator.serviceWorker.ready;
        
        updateStatus('🔔 通知許可を確認中...', 'info');
        
        // 通知許可の取得
        const permission = await Notification.requestPermission();
        console.log('通知許可状態:', permission);
        
        if (permission !== 'granted') {
            updateStatus('❌ 通知が許可されていません', 'error');
            alert('通知が許可されていません。ブラウザの設定で通知を許可してください。');
            return;
        }
        
        updateStatus('📝 プッシュ通知を購読中...', 'info');
        
        // プッシュ通知の購読
        subscription = await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
        
        console.log('✅ Push subscription:', subscription);
        document.getElementById('output').textContent = JSON.stringify(subscription, null, 2);
        updateStatus('✅ プッシュ通知の購読に成功しました！', 'success');
        
        // ボタンの状態を更新
        document.getElementById('subscribeBtn').textContent = '✅ 購読済み';
        document.getElementById('subscribeBtn').disabled = true;
        
    } catch (error) {
        console.error('❌ 購読エラー:', error);
        updateStatus(`❌ エラー: ${error.message}`, 'error');
        alert(`エラーが発生しました: ${error.message}`);
    }
}
