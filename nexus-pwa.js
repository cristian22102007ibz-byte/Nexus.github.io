/* ============================================================
   NEXUS PWA — Install prompt + offline banner + push notifs
   ============================================================ */

(function() {
  // ── Register Service Worker ─────────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('[NEXUS PWA] SW registrado:', reg.scope);
      }).catch(err => console.warn('[NEXUS PWA] SW error:', err));
    });
  }

  // ── PWA Install Prompt ──────────────────────────────────────
  let deferredPrompt = null;

  const style = document.createElement('style');
  style.textContent = `
    #pwaInstallBanner {
      position: fixed; bottom: 24px; right: 24px; left: auto;
      z-index: 19500; background: var(--dark); border: 1px solid var(--accent);
      border-radius: 8px; padding: 16px 20px; width: 340px; max-width: calc(100vw - 48px);
      box-shadow: 0 16px 48px rgba(0,200,255,0.2);
      transform: translateY(calc(100% + 40px));
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.4s;
      display: flex; gap: 14px; align-items: flex-start;
      opacity: 0; pointer-events: none;
    }
    #pwaInstallBanner.show {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    @media(max-width: 480px) {
      #pwaInstallBanner { right: 12px; left: 12px; width: auto; max-width: none; bottom: 16px; }
    }
    .pwa-icon { font-size: 36px; flex-shrink: 0; }
    .pwa-text { flex: 1; }
    .pwa-title { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: var(--white); letter-spacing: 1px; }
    .pwa-sub { font-size: 11px; color: var(--muted); margin-top: 2px; line-height: 1.4; }
    .pwa-actions { display: flex; gap: 8px; margin-top: 10px; }
    .pwa-install-btn { background: var(--accent); color: var(--black); border: none; padding: 7px 16px; font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 1px; cursor: pointer; border-radius: 4px; }
    .pwa-dismiss-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 7px 12px; font-size: 11px; cursor: pointer; border-radius: 4px; }

    #offlineBanner {
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: #dc2626; color: white; text-align: center;
      padding: 10px; font-size: 13px; font-family: 'JetBrains Mono', monospace;
      letter-spacing: 1px; display: none;
    }

    #pwaUpdateBanner {
      position: fixed; top: 72px; left: 50%; transform: translateX(-50%);
      z-index: 19000; background: rgba(139,92,246,0.12); border: 1px solid var(--accent2);
      border-radius: 4px; padding: 12px 20px; display: none;
      align-items: center; gap: 12px; font-size: 13px; color: var(--text);
      box-shadow: 0 8px 24px rgba(139,92,246,0.2);
    }

    /* iOS standalone splash indicator */
    @media (display-mode: standalone) {
      nav { padding-top: env(safe-area-inset-top); }
      body { padding-bottom: env(safe-area-inset-bottom); }
      #nexusAIBtn { bottom: calc(24px + env(safe-area-inset-bottom)); }
      #wishlistFloating { bottom: calc(84px + env(safe-area-inset-bottom)); }
    }
  `;
  document.head.appendChild(style);

  // Offline banner
  const offlineBanner = document.createElement('div');
  offlineBanner.id = 'offlineBanner';
  offlineBanner.textContent = '⚠ Sin conexión — Mostrando contenido en caché';
  document.body.prepend(offlineBanner);

  window.addEventListener('offline', () => { offlineBanner.style.display = 'block'; });
  window.addEventListener('online',  () => { offlineBanner.style.display = 'none'; });
  if (!navigator.onLine) offlineBanner.style.display = 'block';

  // Install banner
  const installBanner = document.createElement('div');
  installBanner.id = 'pwaInstallBanner';
  installBanner.innerHTML = `
    <div class="pwa-icon">📱</div>
    <div class="pwa-text" style="flex:1">
      <div class="pwa-title">INSTALAR NEXUS APP</div>
      <div class="pwa-sub">Acceso rápido, notificaciones de ofertas y funciona sin conexión.</div>
      <div class="pwa-actions">
        <button class="pwa-install-btn" id="pwaInstallBtn">INSTALAR GRATIS</button>
        <button class="pwa-dismiss-btn" id="pwaDismissBtn">Ahora no</button>
      </div>
    </div>
    <button id="pwaCloseBtn" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;line-height:1;flex-shrink:0;padding:0;margin-top:-2px" title="Cerrar">×</button>
  `;
  document.body.appendChild(installBanner);

  // Show natively when browser supports install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (localStorage.getItem('nexusPWADismissed') !== '1') {
      setTimeout(() => installBanner.classList.add('show'), 3000);
    }
  });

  // Fallback: always show after 4s if not dismissed and not already installed
  if (localStorage.getItem('nexusPWADismissed') !== '1' &&
      !window.matchMedia('(display-mode: standalone)').matches &&
      !navigator.standalone) {
    setTimeout(() => {
      if (!installBanner.classList.contains('show')) {
        installBanner.classList.add('show');
      }
    }, 4000);
  }

  document.getElementById('pwaInstallBtn')?.addEventListener('click', async () => {
    installBanner.classList.remove('show');
    localStorage.setItem('nexusPWADismissed', '1');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (typeof showToast === 'function') showToast('✅ NEXUS App instalada correctamente');
      }
      deferredPrompt = null;
    }
  });

  function dismissBanner() {
    installBanner.classList.remove('show');
    localStorage.setItem('nexusPWADismissed', '1');
  }

  document.getElementById('pwaDismissBtn')?.addEventListener('click', dismissBanner);
  document.getElementById('pwaCloseBtn')?.addEventListener('click', dismissBanner);

  window.addEventListener('appinstalled', () => {
    installBanner.classList.remove('show');
    if (typeof showToast === 'function') showToast('🎉 ¡NEXUS instalada! Ya puedes usarla desde tu pantalla de inicio.');
  });

  // ── Push Notifications opt-in ────────────────────────────────
  window.requestNexusPushNotifs = async function() {
    if (!('Notification' in window)) {
      if (typeof showToast === 'function') showToast('Tu navegador no soporta notificaciones push');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification('✅ NEXUS Tech', {
        body: 'Notificaciones activadas. Te avisaremos de ofertas flash y novedades.',
        icon: '/favicon.ico',
      });
      localStorage.setItem('nexusPushEnabled', '1');
      if (typeof showToast === 'function') showToast('🔔 Notificaciones activadas');
    } else {
      if (typeof showToast === 'function') showToast('❌ Notificaciones denegadas');
    }
  };

  // ── Simulate push notification after 30s (demo) ──────────────
  if (localStorage.getItem('nexusPushEnabled') === '1' && 'Notification' in window && Notification.permission === 'granted') {
    setTimeout(() => {
      new Notification('⚡ Flash Sale NEXUS', {
        body: 'RTX 5080 16GB por solo 1.099€ — ¡Solo 2h!',
        icon: '/favicon.ico',
        tag: 'flash-sale',
      });
    }, 30000);
  }

})();
