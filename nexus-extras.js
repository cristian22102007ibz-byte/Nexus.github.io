/* ============================================================
   NEXUS EXTRAS — Global UI enhancements
   Loaded on every page via <script src="nexus-extras.js">
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initAnnouncementBar();
  initCookieBanner();
  initChatWidget();
  initCompare();
  initBackToTop();
  initScrollReveal();
  initMobileMenu();
  initProductRating();
  initStockAlerts();
});

/* ─────────────────────────────────────────
   1. ANNOUNCEMENT BAR
   ───────────────────────────────────────── */
function initAnnouncementBar() {
  if (localStorage.getItem('nexusAnnouncementClosed') === '1') return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #announcementBar {
      background: linear-gradient(90deg, var(--accent2), var(--accent));
      color: var(--black); text-align: center; padding: 10px 48px;
      font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
      text-transform: uppercase; position: relative; z-index: 200;
      font-family: 'JetBrains Mono', monospace;
      animation: fadeDown 0.5s ease;
    }
    @keyframes fadeDown { from { opacity:0; transform:translateY(-100%); } to { opacity:1; transform:translateY(0); } }
    #announcementBar a { color: var(--black); text-decoration: underline; }
    #announcementBar .ann-close {
      position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 16px;
      color: rgba(0,0,0,0.6); line-height: 1; padding: 4px;
    }
    body { padding-top: 0; }
    nav { top: var(--ann-height, 0px); transition: top 0.3s; }
    .hero, .auth-wrapper, .profile-layout, .page-header {
      margin-top: var(--ann-height, 0px);
    }
    #announcementBar .ann-countdown { display: inline; font-weight: 700; }
  `;
  document.head.appendChild(style);

  const messages = [
    '🚀 Envío GRATIS en pedidos +99€ · Entrega en 24–48h',
    '⚡ Flash Sale activa — hasta −30% en GPUs seleccionadas',
    '🎁 Nuevo cliente: usa el código <strong>NEXUS10</strong> y ahorra un 10%',
  ];
  let msgIdx = Math.floor(Math.random() * messages.length);

  const bar = document.createElement('div');
  bar.id = 'announcementBar';
  bar.innerHTML = `
    <span>${messages[msgIdx]}</span>
    <button class="ann-close" onclick="closeAnnouncement()" title="Cerrar">✕</button>
  `;
  document.body.prepend(bar);

  // Adjust nav top
  const h = bar.offsetHeight;
  document.documentElement.style.setProperty('--ann-height', h + 'px');
  document.querySelectorAll('nav').forEach(n => n.style.top = h + 'px');

  // Rotate messages
  setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    bar.querySelector('span').innerHTML = messages[msgIdx];
  }, 5000);

  window.closeAnnouncement = function () {
    bar.style.opacity = '0';
    bar.style.transform = 'translateY(-100%)';
    bar.style.transition = 'all 0.3s';
    setTimeout(() => {
      bar.remove();
      document.documentElement.style.setProperty('--ann-height', '0px');
      document.querySelectorAll('nav').forEach(n => n.style.top = '0');
    }, 300);
    localStorage.setItem('nexusAnnouncementClosed', '1');
  };
}

/* ─────────────────────────────────────────
   2. COOKIE BANNER (GDPR)
   ───────────────────────────────────────── */
function initCookieBanner() {
  if (localStorage.getItem('nexusCookies')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cookieBanner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
      background: var(--dark); border-top: 1px solid var(--border);
      padding: 20px 40px; display: flex; align-items: center;
      justify-content: space-between; gap: 24px; flex-wrap: wrap;
      animation: slideUp 0.4s ease;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.5);
    }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    #cookieBanner .cookie-text { font-size: 13px; color: var(--muted); flex: 1; min-width: 260px; line-height: 1.6; }
    #cookieBanner .cookie-text a { color: var(--accent); }
    #cookieBanner .cookie-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    #cookieBanner .cookie-accept {
      background: var(--accent); color: var(--black); border: none;
      padding: 10px 24px; font-size: 12px; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
      border-radius: 4px; font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s; white-space: nowrap;
    }
    #cookieBanner .cookie-accept:hover { opacity: 0.85; }
    #cookieBanner .cookie-reject {
      background: none; color: var(--muted); border: 1px solid var(--border);
      padding: 10px 20px; font-size: 12px; letter-spacing: 1px;
      text-transform: uppercase; cursor: pointer; border-radius: 4px;
      font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap;
    }
    #cookieBanner .cookie-reject:hover { border-color: var(--accent); color: var(--accent); }
    #cookieBanner .cookie-settings {
      background: none; color: var(--muted); border: none;
      font-size: 12px; cursor: pointer; letter-spacing: 1px;
      text-transform: uppercase; font-family: 'DM Sans', sans-serif;
      transition: color 0.2s; white-space: nowrap; padding: 10px 0;
    }
    #cookieBanner .cookie-settings:hover { color: var(--white); }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = `
    <div class="cookie-text">
      🍪 Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico
      y mostrarte publicidad personalizada. Puedes aceptar todas o gestionar tus preferencias.
      <a href="#">Más información →</a>
    </div>
    <div class="cookie-actions">
      <button class="cookie-settings" onclick="cookieSettings()">Configurar</button>
      <button class="cookie-reject" onclick="cookieDismiss('rejected')">Solo esenciales</button>
      <button class="cookie-accept" onclick="cookieDismiss('accepted')">Aceptar todas</button>
    </div>
  `;
  document.body.appendChild(banner);

  window.cookieDismiss = function (choice) {
    localStorage.setItem('nexusCookies', choice);
    banner.style.transform = 'translateY(100%)';
    banner.style.transition = 'transform 0.4s ease';
    setTimeout(() => banner.remove(), 400);
    if (typeof showToast === 'function') {
      showToast(choice === 'accepted' ? '🍪 Preferencias de cookies guardadas' : '✓ Solo cookies esenciales activadas');
    }
  };

  window.cookieSettings = function () {
    // Simple inline settings expand
    cookieDismiss('custom');
  };
}

/* ─────────────────────────────────────────
   3. CHAT WIDGET
   ───────────────────────────────────────── */
function initChatWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #chatWidget { position: fixed; bottom: 88px; right: 32px; z-index: 9000; }
    #chatToggle {
      width: 52px; height: 52px; border-radius: 50%;
      background: var(--accent2); border: none; cursor: pointer;
      font-size: 22px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 24px rgba(123,47,255,0.5);
      transition: transform 0.3s, box-shadow 0.3s; position: relative;
    }
    #chatToggle:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(123,47,255,0.7); }
    #chatToggle .chat-badge {
      position: absolute; top: -2px; right: -2px; width: 16px; height: 16px;
      background: #ff5e5e; border-radius: 50%; border: 2px solid var(--black);
      font-size: 9px; color: #fff; display: flex; align-items: center;
      justify-content: center; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    }
    #chatWindow {
      position: absolute; bottom: 64px; right: 0; width: 340px;
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 8px; box-shadow: 0 16px 64px rgba(0,0,0,0.7);
      overflow: hidden; display: none; flex-direction: column;
      animation: chatOpen 0.25s ease;
      max-height: 520px;
    }
    @keyframes chatOpen { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:none; } }
    #chatWindow.open { display: flex; }
    .chat-header {
      background: linear-gradient(135deg, var(--accent2), var(--accent));
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    }
    .chat-header-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .chat-header-info .chat-header-name { font-size: 14px; font-weight: 500; color: #fff; }
    .chat-header-info .chat-header-status { font-size: 11px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 5px; }
    .chat-online-dot { width: 6px; height: 6px; background: #00ff94; border-radius: 50%; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
    .chat-close { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 18px; padding: 4px; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 280px; max-height: 320px; }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-track { background: transparent; }
    .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
    .chat-msg { display: flex; flex-direction: column; gap: 3px; max-width: 85%; }
    .chat-msg.bot { align-self: flex-start; }
    .chat-msg.user { align-self: flex-end; }
    .chat-bubble {
      padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
    }
    .chat-msg.bot .chat-bubble { background: var(--card); color: var(--text); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; }
    .chat-msg.user .chat-bubble { background: var(--accent); color: var(--black); font-weight: 400; border-radius: 12px 4px 12px 12px; }
    .chat-msg-time { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    .chat-msg.user .chat-msg-time { text-align: right; }
    .chat-quick { padding: 8px 16px 0; display: flex; gap: 6px; flex-wrap: wrap; }
    .chat-quick-btn {
      background: none; border: 1px solid var(--border); color: var(--accent);
      padding: 5px 10px; font-size: 11px; cursor: pointer; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px;
      transition: all 0.2s; white-space: nowrap;
    }
    .chat-quick-btn:hover { background: rgba(0,180,255,0.1); border-color: var(--accent); }
    .chat-input-row {
      display: flex; gap: 0; border-top: 1px solid var(--border);
      padding: 12px 16px; background: var(--card);
    }
    .chat-input {
      flex: 1; background: var(--dark); border: 1px solid var(--border);
      color: var(--white); padding: 10px 14px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; outline: none; border-radius: 4px 0 0 4px;
      transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: var(--accent); }
    .chat-input::placeholder { color: var(--muted); }
    .chat-send {
      background: var(--accent); border: 1px solid var(--accent); color: var(--black);
      padding: 10px 16px; cursor: pointer; font-size: 16px; border-radius: 0 4px 4px 0;
      transition: opacity 0.2s;
    }
    .chat-send:hover { opacity: 0.85; }
    .chat-typing { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
    .chat-typing span { width: 6px; height: 6px; background: var(--muted); border-radius: 50%; animation: typing 1.2s infinite; }
    .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%,60%,100%{transform:translateY(0);opacity:0.4;} 30%{transform:translateY(-4px);opacity:1;} }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'chatWidget';
  widget.innerHTML = `
    <div id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-avatar">🤖</div>
        <div class="chat-header-info">
          <div class="chat-header-name">NEXUS Asistente</div>
          <div class="chat-header-status"><span class="chat-online-dot"></span> En línea ahora</div>
        </div>
        <button class="chat-close" onclick="toggleChat()">✕</button>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-quick" id="chatQuick">
        <button class="chat-quick-btn" onclick="sendQuick('¿Cuánto tarda el envío?')">🚚 Envíos</button>
        <button class="chat-quick-btn" onclick="sendQuick('¿Cómo hago una devolución?')">↩ Devoluciones</button>
        <button class="chat-quick-btn" onclick="sendQuick('Quiero hablar con una persona')">👤 Humano</button>
        <button class="chat-quick-btn" onclick="sendQuick('¿Tenéis garantía?')">🛡 Garantía</button>
      </div>
      <div class="chat-input-row">
        <input class="chat-input" id="chatInput" placeholder="Escribe tu mensaje..." onkeydown="if(event.key==='Enter')sendChat()">
        <button class="chat-send" onclick="sendChat()">➤</button>
      </div>
    </div>
    <button id="chatToggle" onclick="toggleChat()">
      💬
      <span class="chat-badge" id="chatBadge">1</span>
    </button>
  `;
  document.body.appendChild(widget);

  const responses = {
    'envío': 'Ofrecemos envío estándar en 3–5 días laborables (gratis en pedidos +99€) y envío express 24–48h por 5.99€. 🚚',
    'envio': 'Ofrecemos envío estándar en 3–5 días laborables (gratis en pedidos +99€) y envío express 24–48h por 5.99€. 🚚',
    'devolución': 'Tienes 30 días para devolver cualquier producto sin preguntas. Inicia el proceso desde tu perfil o contacta con soporte. ↩',
    'devolucion': 'Tienes 30 días para devolver cualquier producto sin preguntas. Inicia el proceso desde tu perfil o contacta con soporte. ↩',
    'garantía': 'Todos nuestros productos incluyen garantía oficial del fabricante. En NEXUS además ofrecemos soporte prioritario durante 2 años. 🛡',
    'garantia': 'Todos nuestros productos incluyen garantía oficial del fabricante. En NEXUS además ofrecemos soporte prioritario durante 2 años. 🛡',
    'precio': 'Nuestros precios incluyen IVA (21%). Actualizamos precios diariamente para ofrecerte las mejores ofertas del mercado. 💰',
    'humano': 'Conectándote con un agente... El tiempo de espera estimado es de 3 minutos. Mientras tanto, puedes ver nuestro <a href="soporte.html" style="color:var(--accent)">centro de ayuda</a>. 👤',
    'persona': 'Conectándote con un agente... El tiempo de espera estimado es de 3 minutos. Mientras tanto, puedes ver nuestro <a href="soporte.html" style="color:var(--accent)">centro de ayuda</a>. 👤',
    'pago': 'Aceptamos tarjeta de crédito/débito (Visa, Mastercard, Amex), PayPal, Bizum, transferencia bancaria y financiación en 12 meses sin intereses. 💳',
    'factura': 'Tus facturas están disponibles en la sección "Mis pedidos" de tu perfil. Se emiten automáticamente al confirmar el pago. 📄',
    'stock': 'Para consultar disponibilidad de un producto específico visita su página. También puedes activar alertas de restock. 📦',
    'rtx': 'Tenemos RTX 5090, 5080, 4090 y más disponibles. Visita nuestra <a href="productos.html?cat=gpu" style="color:var(--accent)">sección de GPUs</a> para ver stock actual. 🎮',
    'descuento': 'Código de bienvenida: <strong>NEXUS10</strong> (−10%). Síguenos y activa alertas de precio para no perderte ninguna oferta. 🏷',
  };

  let chatOpen = false;
  const msgs = document.getElementById('chatMessages');

  function addMsg(text, from, delay = 0) {
    setTimeout(() => {
      // Remove typing indicator if exists
      const typing = document.getElementById('chatTyping');
      if (typing) typing.remove();

      const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const div = document.createElement('div');
      div.className = 'chat-msg ' + from;
      div.innerHTML = `<div class="chat-bubble">${text}</div><div class="chat-msg-time">${time}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }, delay);
  }

  function showTyping() {
    const div = document.createElement('div');
    div.id = 'chatTyping';
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  window.toggleChat = function () {
    chatOpen = !chatOpen;
    const win = document.getElementById('chatWindow');
    const badge = document.getElementById('chatBadge');
    const toggle = document.getElementById('chatToggle');
    if (chatOpen) {
      win.classList.add('open');
      badge.style.display = 'none';
      toggle.textContent = '✕';
      toggle.style.background = 'var(--muted)';
      if (msgs.children.length === 0) {
        setTimeout(() => addMsg('¡Hola! 👋 Soy el asistente de NEXUS. ¿En qué puedo ayudarte hoy?', 'bot'), 400);
        setTimeout(() => addMsg('Puedes preguntarme sobre envíos, devoluciones, garantías, métodos de pago...', 'bot'), 1200);
      }
    } else {
      win.classList.remove('open');
      toggle.innerHTML = '💬<span class="chat-badge" id="chatBadge" style="display:none">1</span>';
      toggle.style.background = '';
    }
  };

  window.sendChat = function () {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    showTyping();

    // Find best response
    const lower = text.toLowerCase();
    let reply = '¡Gracias por tu mensaje! Para ayudarte mejor, visita nuestro <a href="soporte.html" style="color:var(--accent)">centro de soporte</a> o escribe al email hola@nexustech.es. 😊';
    for (const [key, val] of Object.entries(responses)) {
      if (lower.includes(key)) { reply = val; break; }
    }
    addMsg(reply, 'bot', 900);
  };

  window.sendQuick = function (text) {
    document.getElementById('chatInput').value = text;
    sendChat();
  };

  // Auto-open hint after 8 sec (only first visit)
  if (!localStorage.getItem('nexusChatHinted')) {
    setTimeout(() => {
      if (!chatOpen) {
        const badge = document.getElementById('chatBadge');
        if (badge) { badge.style.display = 'flex'; badge.style.animation = 'pulse 1s infinite'; }
        localStorage.setItem('nexusChatHinted', '1');
      }
    }, 8000);
  }
}

/* ─────────────────────────────────────────
   4. PRODUCT COMPARE TOOL
   ───────────────────────────────────────── */
function initCompare() {
  const style = document.createElement('style');
  style.textContent = `
    #compareBar {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 8000;
      background: var(--dark); border-top: 2px solid var(--accent);
      padding: 14px 40px; display: flex; align-items: center; gap: 20px;
      transform: translateY(100%); transition: transform 0.3s ease;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.6);
    }
    #compareBar.show { transform: translateY(0); }
    .compare-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
    .compare-slots { display: flex; gap: 10px; flex: 1; }
    .compare-slot {
      background: var(--card); border: 1px solid var(--border); border-radius: 4px;
      padding: 8px 14px; min-width: 160px; font-size: 12px; color: var(--text);
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      position: relative;
    }
    .compare-slot.empty { color: var(--muted); border-style: dashed; }
    .compare-slot-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; }
    .compare-slot-remove { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 12px; padding: 2px; transition: color 0.2s; flex-shrink: 0; }
    .compare-slot-remove:hover { color: #ff5e5e; }
    .compare-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .compare-go { background: var(--accent); color: var(--black); border: none; padding: 10px 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 4px; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }
    .compare-go:hover { opacity: 0.85; }
    .compare-clear { background: none; border: 1px solid var(--border); color: var(--muted); padding: 10px 16px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; border-radius: 4px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
    .compare-clear:hover { border-color: var(--accent); color: var(--accent); }
    .compare-count { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--accent); }
    /* Compare button on cards */
    .compare-add-btn {
      position: absolute; bottom: 12px; left: 12px;
      background: var(--black); border: 1px solid var(--border);
      color: var(--muted); width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 13px; border-radius: 4px;
      transition: all 0.2s; z-index: 3;
      font-family: 'JetBrains Mono', monospace;
    }
    .compare-add-btn:hover, .compare-add-btn.added {
      background: rgba(0,180,255,0.15); border-color: var(--accent); color: var(--accent);
    }
    .compare-add-btn title { display: none; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'compareBar';
  bar.innerHTML = `
    <span class="compare-label">⚖ Comparar</span>
    <span class="compare-count" id="compareCnt">0/3</span>
    <div class="compare-slots" id="compareSlots">
      <div class="compare-slot empty" id="cslot0">Slot 1 vacío</div>
      <div class="compare-slot empty" id="cslot1">Slot 2 vacío</div>
      <div class="compare-slot empty" id="cslot2">Slot 3 vacío</div>
    </div>
    <div class="compare-actions">
      <button class="compare-clear" onclick="clearCompare()">Limpiar</button>
      <button class="compare-go" onclick="goCompare()">Comparar →</button>
    </div>
  `;
  document.body.appendChild(bar);

  window._compareList = JSON.parse(sessionStorage.getItem('nexusCompare') || '[]');
  renderCompareBar();

  // Wire up compare buttons on product cards (for dynamically rendered pages too)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.compare-add-btn');
    if (!btn) return;
    e.stopPropagation();
    const name  = btn.dataset.name;
    const price = btn.dataset.price;
    const idx = window._compareList.findIndex(p => p.name === name);
    if (idx > -1) {
      window._compareList.splice(idx, 1);
      btn.classList.remove('added');
      btn.textContent = '⚖';
      btn.title = 'Añadir al comparador';
    } else {
      if (window._compareList.length >= 3) {
        if (typeof showToast === 'function') showToast('⚠ Máximo 3 productos en el comparador');
        return;
      }
      window._compareList.push({ name, price });
      btn.classList.add('added');
      btn.textContent = '✓';
      btn.title = 'En comparador';
    }
    sessionStorage.setItem('nexusCompare', JSON.stringify(window._compareList));
    renderCompareBar();
  });

  function renderCompareBar() {
    const list = window._compareList;
    document.getElementById('compareCnt').textContent = list.length + '/3';
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById('cslot' + i);
      if (list[i]) {
        slot.classList.remove('empty');
        slot.innerHTML = `<span class="compare-slot-name">${list[i].name}</span><button class="compare-slot-remove" onclick="removeCompare(${i})">✕</button>`;
      } else {
        slot.classList.add('empty');
        slot.textContent = 'Slot ' + (i+1) + ' vacío';
      }
    }
    const bar = document.getElementById('compareBar');
    if (list.length > 0) bar.classList.add('show');
    else bar.classList.remove('show');
  }

  window.removeCompare = function (i) {
    window._compareList.splice(i, 1);
    sessionStorage.setItem('nexusCompare', JSON.stringify(window._compareList));
    renderCompareBar();
  };

  window.clearCompare = function () {
    window._compareList = [];
    sessionStorage.removeItem('nexusCompare');
    renderCompareBar();
    document.querySelectorAll('.compare-add-btn.added').forEach(b => {
      b.classList.remove('added');
      b.textContent = '⚖';
    });
  };

  window.goCompare = function () {
    if (window._compareList.length < 2) {
      if (typeof showToast === 'function') showToast('⚠ Añade al menos 2 productos para comparar');
      return;
    }
    window.location.href = 'comparar.html';
  };

  window.renderCompareBar = renderCompareBar;
}

/* ─────────────────────────────────────────
   5. BACK TO TOP
   ───────────────────────────────────────── */
function initBackToTop() {
  const style = document.createElement('style');
  style.textContent = `
    #backToTop {
      position: fixed; bottom: 88px; left: 32px; z-index: 8000;
      width: 44px; height: 44px; border-radius: 4px;
      background: var(--card); border: 1px solid var(--border);
      color: var(--muted); font-size: 18px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(8px); pointer-events: none;
      transition: all 0.3s;
    }
    #backToTop.show { opacity: 1; transform: translateY(0); pointer-events: all; }
    #backToTop:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,180,255,0.08); }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '↑';
  btn.title = 'Volver arriba';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
}

/* ─────────────────────────────────────────
   6. SCROLL REVEAL
   ───────────────────────────────────────── */
function initScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.revealed { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal-left.revealed { opacity: 1; transform: translateX(0); }
    .reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.5s ease, transform 0.5s ease; }
    .reveal-scale.revealed { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);

  // Auto-tag sections, cards, banners
  document.querySelectorAll('.section-header, .banner, .brands-row, .newsletter, .pack-card, .deal-hero').forEach(el => {
    el.classList.add('reveal');
  });
  document.querySelectorAll('.cat-card, .stat-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 60) + 'ms';
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────
   7. MOBILE MENU
   ───────────────────────────────────────── */
function initMobileMenu() {
  const style = document.createElement('style');
  style.textContent = `
    #mobileMenuBtn {
      display: none; background: none; border: 1px solid var(--border);
      color: var(--text); width: 40px; height: 40px;
      cursor: pointer; font-size: 18px; border-radius: 4px;
      align-items: center; justify-content: center; flex-shrink: 0;
      transition: all 0.2s;
    }
    #mobileMenuBtn:hover { border-color: var(--accent); color: var(--accent); }
    #mobileMenu {
      display: none; position: fixed; inset: 0; z-index: 99;
      background: rgba(2,4,8,0.97); backdrop-filter: blur(20px);
      flex-direction: column; padding: 80px 40px 40px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    #mobileMenu.open { display: flex; }
    .mobile-close { position: absolute; top: 20px; right: 20px; background: none; border: 1px solid var(--border); color: var(--text); width: 44px; height: 44px; cursor: pointer; font-size: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
    #mobileMenu a { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 3px; color: var(--white); padding: 8px 0; border-bottom: 1px solid var(--border); transition: color 0.2s; }
    #mobileMenu a:hover { color: var(--accent); }
    #mobileMenu a:last-of-type { border-bottom: none; }
    .mobile-footer { margin-top: auto; font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    @media (max-width: 900px) { #mobileMenuBtn { display: flex; } }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'mobileMenuBtn';
  btn.innerHTML = '☰';
  btn.onclick = openMobileMenu;

  const menu = document.createElement('div');
  menu.id = 'mobileMenu';
  menu.innerHTML = `
    <button class="mobile-close" onclick="closeMobileMenu()">✕</button>
    <a href="index.html">Inicio</a>
    <a href="productos.html">Productos</a>
    <a href="gaming.html">Gaming</a>
    <a href="ofertas.html">Ofertas</a>
    <a href="soporte.html">Soporte</a>
    <a href="carrito.html">Carrito 🛒</a>
    <a href="login.html">Iniciar sesión</a>
    <a href="registro.html">Crear cuenta →</a>
    <div class="mobile-footer">© 2025 NEXUS TECH · hola@nexustech.es</div>
  `;

  const nav = document.querySelector('nav');
  if (nav) nav.appendChild(btn);
  document.body.appendChild(menu);

  window.openMobileMenu  = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  window.closeMobileMenu = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };
  // Close on outside click
  menu.addEventListener('click', e => { if (e.target === menu) closeMobileMenu(); });
}

/* ─────────────────────────────────────────
   8. STAR RATING ON CARDS (cosmetic only)
   ───────────────────────────────────────── */
function initProductRating() {
  const style = document.createElement('style');
  style.textContent = `
    .star { color: var(--border); font-size: 13px; transition: color 0.15s; }
    .star:not(.empty) { color: #ffb347; }
    .product-rating { margin-top: 8px; display: flex; gap: 1px; }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   9. LOW-STOCK ALERTS
   ───────────────────────────────────────── */
function initStockAlerts() {
  const style = document.createElement('style');
  style.textContent = `
    .stock-alert {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 10px; font-family: 'JetBrains Mono', monospace;
      letter-spacing: 1px; text-transform: uppercase;
      padding: 3px 8px; border-radius: 2px; margin-top: 6px;
      animation: stockPulse 2s ease infinite;
    }
    .stock-alert.low { background: rgba(255,179,71,0.12); color: #ffb347; border: 1px solid rgba(255,179,71,0.25); }
    .stock-alert.critical { background: rgba(255,94,94,0.12); color: #ff5e5e; border: 1px solid rgba(255,94,94,0.25); }
    @keyframes stockPulse { 0%,100%{opacity:1;} 50%{opacity:0.65;} }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   10. EXIT INTENT POPUP
   ───────────────────────────────────────── */
function initExitIntent() {
  if (localStorage.getItem('nexusExitShown')) return;
  const style = document.createElement('style');
  style.textContent = `
    #exitOverlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;
      display:flex;align-items:center;justify-content:center;
      backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity 0.3s;
    }
    #exitOverlay.show{opacity:1;pointer-events:all;}
    #exitModal {
      background:var(--dark);border:1px solid var(--border);max-width:520px;width:90%;
      position:relative;overflow:hidden;animation:exitPop 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both;
    }
    @keyframes exitPop{from{transform:scale(0.88) translateY(20px);opacity:0}to{transform:none;opacity:1}}
    #exitModal .exit-glow{position:absolute;top:-60px;right:-60px;width:240px;height:240px;
      background:radial-gradient(circle,rgba(123,47,255,0.2),transparent 70%);border-radius:50%;pointer-events:none;}
    #exitModal .exit-close{position:absolute;top:16px;right:16px;background:none;border:1px solid var(--border);
      color:var(--muted);width:32px;height:32px;cursor:pointer;border-radius:4px;font-size:16px;
      display:flex;align-items:center;justify-content:center;transition:all 0.2s;z-index:1;}
    #exitModal .exit-close:hover{border-color:#ff5e5e;color:#ff5e5e;}
    .exit-body{padding:48px 48px 40px;position:relative;z-index:1;}
    .exit-tag{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent2);
      font-family:'JetBrains Mono',monospace;margin-bottom:12px;}
    .exit-title{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:2px;color:var(--white);line-height:1;margin-bottom:12px;}
    .exit-title span{color:var(--accent);}
    .exit-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:28px;}
    .exit-code{background:rgba(0,180,255,0.08);border:1px dashed var(--accent);padding:14px 20px;
      display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
    .exit-code-val{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:4px;color:var(--accent);}
    .exit-copy-btn{background:var(--accent);color:var(--black);border:none;padding:8px 16px;
      font-size:11px;font-weight:600;cursor:pointer;letter-spacing:1px;text-transform:uppercase;
      font-family:'DM Sans',sans-serif;border-radius:2px;transition:opacity 0.2s;}
    .exit-copy-btn:hover{opacity:0.85;}
    .exit-actions{display:flex;gap:10px;}
    .exit-accept{flex:1;background:var(--accent);color:var(--black);border:none;padding:14px;
      font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;
      border-radius:4px;font-family:'DM Sans',sans-serif;transition:opacity 0.2s;}
    .exit-accept:hover{opacity:0.85;}
    .exit-dismiss{background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;
      font-family:'DM Sans',sans-serif;letter-spacing:1px;padding:14px 20px;transition:color 0.2s;}
    .exit-dismiss:hover{color:var(--white);}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'exitOverlay';
  overlay.innerHTML = `
    <div id="exitModal">
      <div class="exit-glow"></div>
      <button class="exit-close" onclick="closeExit()">✕</button>
      <div class="exit-body">
        <div class="exit-tag">✦ Oferta exclusiva de salida</div>
        <div class="exit-title">¡ESPERA!<br>ANTES DE <span>IRTE</span></div>
        <div class="exit-sub">Te regalamos un <strong style="color:var(--white)">10% de descuento</strong> en tu primer pedido. Solo disponible por tiempo limitado.</div>
        <div class="exit-code">
          <div><div style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;margin-bottom:4px">TU CÓDIGO</div><div class="exit-code-val">NEXUS10</div></div>
          <button class="exit-copy-btn" onclick="copyExitCode()">Copiar</button>
        </div>
        <div class="exit-actions">
          <button class="exit-accept" onclick="window.location.href='productos.html'">🛒 Quiero mi descuento</button>
          <button class="exit-dismiss" onclick="closeExit()">No, gracias</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  let shown = false;
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 20 && !shown) {
      shown = true;
      overlay.classList.add('show');
      localStorage.setItem('nexusExitShown','1');
    }
  });

  window.closeExit = () => { overlay.classList.remove('show'); setTimeout(()=>overlay.remove(),300); };
  window.copyExitCode = () => {
    navigator.clipboard.writeText('NEXUS10').catch(()=>{});
    document.querySelector('.exit-copy-btn').textContent = '✓ Copiado';
    setTimeout(()=>{ const b=document.querySelector('.exit-copy-btn'); if(b) b.textContent='Copiar'; },2000);
  };
  overlay.addEventListener('click', e => { if(e.target===overlay) closeExit(); });
}

/* ─────────────────────────────────────────
   11. FREE SHIPPING PROGRESS BAR
   ───────────────────────────────────────── */
function initShippingBar() {
  const threshold = 99;
  const style = document.createElement('style');
  style.textContent = `
    #shippingProgressBar {
      background:var(--dark);border-bottom:1px solid var(--border);
      padding:10px 40px;display:flex;align-items:center;gap:16px;
      font-size:12px;font-family:'JetBrains Mono',monospace;
    }
    .spb-label{color:var(--muted);white-space:nowrap;letter-spacing:1px;}
    .spb-track{flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;}
    .spb-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));
      border-radius:2px;transition:width 0.6s ease;}
    .spb-status{white-space:nowrap;font-size:11px;}
    .spb-status.done{color:#00ff94;}
    .spb-status.progress{color:var(--accent);}
    @media(max-width:600px){#shippingProgressBar{padding:10px 16px;}}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'shippingProgressBar';
  document.querySelector('nav').after(bar);

  function updateBar() {
    const cartData = JSON.parse(localStorage.getItem('nexusCart')||'[]');
    const total = cartData.reduce((s,i)=>s+(i.price||0),0);
    const pct = Math.min(100, Math.round(total/threshold*100));
    const remaining = Math.max(0, threshold - total);
    bar.innerHTML = `
      <span class="spb-label">🚚 ENVÍO GRATIS</span>
      <div class="spb-track"><div class="spb-fill" style="width:${pct}%"></div></div>
      <span class="spb-status ${pct>=100?'done':'progress'}">
        ${pct>=100 ? '✓ ¡Envío gratuito activado!' : `Faltan ${remaining.toLocaleString('es-ES')}€`}
      </span>`;
  }
  updateBar();
  window.addEventListener('storage', updateBar);
  // Re-check after cart events
  const orig = window.addToCart;
  if (orig) window.addToCart = function(...args){ orig(...args); setTimeout(updateBar,100); };
}

/* ─────────────────────────────────────────
   12. RECENTLY VIEWED PRODUCTS
   ───────────────────────────────────────── */
function initRecentlyViewed() {
  // Track current product page
  const isProductPage = window.location.pathname.includes('producto');
  if (isProductPage) {
    const title = document.querySelector('h1')?.textContent?.trim() || document.title.split('—')[0].trim();
    const price = document.querySelector('.price-main')?.textContent?.trim() || '';
    const icon  = document.querySelector('.gallery-main span')?.textContent?.trim() || '📦';
    const recent = JSON.parse(localStorage.getItem('nexusRecent')||'[]');
    const entry = { name: title, price, icon, url: window.location.pathname };
    const filtered = recent.filter(r => r.name !== entry.name).slice(0,7);
    filtered.unshift(entry);
    localStorage.setItem('nexusRecent', JSON.stringify(filtered.slice(0,8)));
  }

  // Render recently viewed section on index/productos pages
  const isHome = window.location.pathname.includes('index') || window.location.pathname.endsWith('/');
  if (!isHome) return;

  const recent = JSON.parse(localStorage.getItem('nexusRecent')||'[]');
  if (recent.length < 2) return;

  const style = document.createElement('style');
  style.textContent = `
    #recentSection{padding:60px 40px;border-top:1px solid var(--border);}
    .recent-grid{display:flex;gap:1px;background:var(--border);border:1px solid var(--border);overflow-x:auto;}
    .recent-card{background:var(--dark);padding:20px;min-width:180px;flex:1;cursor:pointer;
      transition:background 0.2s;display:flex;flex-direction:column;align-items:center;text-align:center;}
    .recent-card:hover{background:var(--card);}
    .recent-card-icon{font-size:44px;margin-bottom:12px;}
    .recent-card-name{font-size:12px;color:var(--text);line-height:1.4;margin-bottom:8px;
      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .recent-card-price{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--accent);}
    @media(max-width:600px){#recentSection{padding:40px 20px;}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('div');
  section.id = 'recentSection';
  section.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;flex-wrap:wrap;gap:12px">
      <div><div class="section-tag">// Vistos recientemente</div>
      <div class="section-title" style="font-size:clamp(28px,4vw,40px)">ÚLTIMOS VISTOS</div></div>
      <button onclick="localStorage.removeItem('nexusRecent');document.getElementById('recentSection').remove()" 
        style="font-size:11px;color:var(--muted);background:none;border:none;cursor:pointer;font-family:'JetBrains Mono',monospace;letter-spacing:1px">
        Limpiar historial ✕</button>
    </div>
    <div class="recent-grid">
      ${recent.slice(0,6).map(p=>`
        <div class="recent-card" onclick="window.location.href='producto.html'">
          <div class="recent-card-icon">${p.icon||'📦'}</div>
          <div class="recent-card-name">${p.name}</div>
          <div class="recent-card-price">${p.price}</div>
        </div>`).join('')}
    </div>`;

  // Inject before newsletter or footer
  const newsletter = document.querySelector('.newsletter');
  if (newsletter) newsletter.before(section);
  else document.querySelector('footer')?.before(section);
}

/* ─────────────────────────────────────────
   13. NOTIFICATION CENTER
   ───────────────────────────────────────── */
function initNotificationCenter() {
  const style = document.createElement('style');
  style.textContent = `
    #notifBtn{
      position:relative;background:none;border:1px solid var(--border);
      color:var(--muted);width:40px;height:40px;cursor:pointer;border-radius:4px;
      font-size:18px;display:flex;align-items:center;justify-content:center;
      transition:all 0.2s;flex-shrink:0;
    }
    #notifBtn:hover{border-color:var(--accent);color:var(--accent);}
    #notifDot{
      position:absolute;top:-3px;right:-3px;width:10px;height:10px;
      background:#ff5e5e;border-radius:50%;border:2px solid var(--black);
      animation:notifPulse 2s infinite;
    }
    @keyframes notifPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
    #notifPanel{
      position:absolute;top:52px;right:0;width:340px;
      background:var(--dark);border:1px solid var(--border);
      box-shadow:0 16px 48px rgba(0,0,0,0.7);z-index:500;
      display:none;border-radius:4px;overflow:hidden;
    }
    #notifPanel.open{display:block;animation:fadeDown 0.2s ease;}
    @keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
    .notif-header{padding:16px 20px;border-bottom:1px solid var(--border);
      display:flex;justify-content:space-between;align-items:center;}
    .notif-header-title{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;color:var(--white);}
    .notif-mark-all{font-size:10px;color:var(--accent);cursor:pointer;font-family:'JetBrains Mono',monospace;
      letter-spacing:1px;background:none;border:none;}
    .notif-list{max-height:380px;overflow-y:auto;}
    .notif-item{padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;
      transition:background 0.2s;display:flex;gap:14px;align-items:flex-start;}
    .notif-item:hover{background:var(--card);}
    .notif-item.unread{background:rgba(0,180,255,0.04);}
    .notif-item.unread::before{content:'';width:6px;height:6px;background:var(--accent);
      border-radius:50%;flex-shrink:0;margin-top:6px;}
    .notif-item:not(.unread)::before{content:'';width:6px;flex-shrink:0;}
    .notif-icon{font-size:20px;flex-shrink:0;}
    .notif-text{font-size:12px;color:var(--text);line-height:1.5;}
    .notif-time{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:3px;}
    .notif-footer{padding:12px 20px;text-align:center;border-top:1px solid var(--border);}
    .notif-footer a{font-size:11px;color:var(--accent);font-family:'JetBrains Mono',monospace;letter-spacing:1px;}
  `;
  document.head.appendChild(style);

  const notifications = [
    { icon:'📦', text:'Tu pedido <strong>#NEX-2025-00312</strong> está en camino. Entrega estimada mañana.', time:'hace 2h', unread:true },
    { icon:'🏷', text:'¡Precio bajado! <strong>RTX 5080 16GB</strong> ahora desde 1.199€ (antes 1.399€).', time:'hace 5h', unread:true },
    { icon:'⭐', text:'Llevas <strong>500 puntos</strong> acumulados. ¡Canjéalos por descuentos!', time:'hace 1d', unread:true },
    { icon:'🚀', text:'Nuevo lanzamiento: <strong>AMD Ryzen 9 9950X3D</strong> disponible en preventa.', time:'hace 2d', unread:false },
    { icon:'💬', text:'Tu valoración del producto ha sido publicada. ¡Gracias!', time:'hace 3d', unread:false },
  ];

  // Add button to nav
  const navActions = document.getElementById('navActions');
  if (!navActions) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;';
  wrap.innerHTML = `
    <button id="notifBtn" onclick="toggleNotif()" title="Notificaciones">
      🔔
      <span id="notifDot"></span>
    </button>
    <div id="notifPanel">
      <div class="notif-header">
        <span class="notif-header-title">NOTIFICACIONES</span>
        <button class="notif-mark-all" onclick="markAllRead()">Marcar todo leído ✓</button>
      </div>
      <div class="notif-list">
        ${notifications.map(n=>`
          <div class="notif-item ${n.unread?'unread':''}" onclick="this.classList.remove('unread');updateNotifDot()">
            <span class="notif-icon">${n.icon}</span>
            <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
          </div>`).join('')}
      </div>
      <div class="notif-footer"><a href="perfil.html">Ver todo en mi perfil →</a></div>
    </div>`;

  const cartBtn = navActions.querySelector('.cart-btn');
  navActions.insertBefore(wrap, cartBtn);

  window.toggleNotif = function() {
    const panel = document.getElementById('notifPanel');
    panel.classList.toggle('open');
    document.addEventListener('click', function close(e){
      if(!wrap.contains(e.target)){panel.classList.remove('open'); document.removeEventListener('click',close);}
    });
  };
  window.markAllRead = function() {
    document.querySelectorAll('.notif-item.unread').forEach(i=>i.classList.remove('unread'));
    updateNotifDot();
  };
  window.updateNotifDot = function() {
    const dot = document.getElementById('notifDot');
    if(dot) dot.style.display = document.querySelector('.notif-item.unread') ? '' : 'none';
  };
}

/* ─────────────────────────────────────────
   14. MEGA MENU ON PRODUCTOS
   ───────────────────────────────────────── */
function initMegaMenu() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-mega-wrap{position:relative;}
    .nav-mega-wrap:hover .mega-menu{display:grid;}
    .mega-menu{
      display:none;position:absolute;top:100%;left:50%;transform:translateX(-50%);
      width:640px;background:var(--dark);border:1px solid var(--border);
      grid-template-columns:repeat(3,1fr);gap:0;z-index:300;
      box-shadow:0 24px 64px rgba(0,0,0,0.7);animation:fadeDown 0.2s ease;
    }
    .mega-col{padding:28px 24px;border-right:1px solid var(--border);}
    .mega-col:last-child{border-right:none;}
    .mega-col-title{font-size:10px;letter-spacing:3px;text-transform:uppercase;
      color:var(--accent);font-family:'JetBrains Mono',monospace;margin-bottom:16px;}
    .mega-link{display:flex;align-items:center;gap:10px;padding:8px 0;
      font-size:13px;color:var(--muted);border-bottom:1px solid rgba(14,42,69,0.5);
      transition:color 0.2s;cursor:pointer;}
    .mega-link:last-child{border-bottom:none;}
    .mega-link:hover{color:var(--accent);}
    .mega-link-icon{font-size:16px;flex-shrink:0;}
    .mega-link-name{flex:1;}
    .mega-link-count{font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;}
    .mega-promo{background:linear-gradient(135deg,rgba(0,180,255,0.1),rgba(123,47,255,0.1));
      border:1px solid rgba(0,180,255,0.2);padding:16px;margin-top:16px;}
    .mega-promo-title{font-size:12px;color:var(--accent);font-family:'JetBrains Mono',monospace;letter-spacing:1px;margin-bottom:4px;}
    .mega-promo-text{font-size:12px;color:var(--muted);}
  `;
  document.head.appendChild(style);

  const productosLink = [...document.querySelectorAll('.nav-links a')].find(a=>a.href.includes('productos'));
  if (!productosLink) return;
  const wrap = document.createElement('div');
  wrap.className = 'nav-mega-wrap';
  productosLink.parentNode.insertBefore(wrap, productosLink);
  wrap.appendChild(productosLink);
  wrap.insertAdjacentHTML('beforeend',`
    <div class="mega-menu">
      <div class="mega-col">
        <div class="mega-col-title">Componentes</div>
        <a href="productos.html?cat=cpu" class="mega-link"><span class="mega-link-icon">⚡</span><span class="mega-link-name">Procesadores</span><span class="mega-link-count">8</span></a>
        <a href="productos.html?cat=gpu" class="mega-link"><span class="mega-link-icon">🎮</span><span class="mega-link-name">Tarjetas Gráficas</span><span class="mega-link-count">8</span></a>
        <a href="productos.html?cat=ram" class="mega-link"><span class="mega-link-icon">🧠</span><span class="mega-link-name">Memoria RAM</span><span class="mega-link-count">7</span></a>
        <a href="productos.html?cat=storage" class="mega-link"><span class="mega-link-icon">💾</span><span class="mega-link-name">Almacenamiento</span><span class="mega-link-count">7</span></a>
      </div>
      <div class="mega-col">
        <div class="mega-col-title">Periféricos</div>
        <a href="productos.html?cat=monitor" class="mega-link"><span class="mega-link-icon">🖥️</span><span class="mega-link-name">Monitores</span><span class="mega-link-count">6</span></a>
        <a href="productos.html?cat=peripherals" class="mega-link"><span class="mega-link-icon">🖱️</span><span class="mega-link-name">Ratones & Teclados</span><span class="mega-link-count">12</span></a>
        <a href="gaming.html" class="mega-link"><span class="mega-link-icon">🕹</span><span class="mega-link-name">Gaming Setups</span><span class="mega-link-count">3</span></a>
        <a href="comparar.html" class="mega-link"><span class="mega-link-icon">⚖</span><span class="mega-link-name">Comparador</span><span class="mega-link-count">—</span></a>
      </div>
      <div class="mega-col">
        <div class="mega-col-title">Destacado</div>
        <a href="ofertas.html" class="mega-link"><span class="mega-link-icon">🏷</span><span class="mega-link-name">Ofertas del día</span><span class="mega-link-count" style="color:#ff5e5e">−30%</span></a>
        <a href="producto.html" class="mega-link"><span class="mega-link-icon">⭐</span><span class="mega-link-name">Más vendidos</span><span class="mega-link-count"></span></a>
        <a href="gaming.html" class="mega-link"><span class="mega-link-icon">🔥</span><span class="mega-link-name">Nuevos lanzamientos</span><span class="mega-link-count">5</span></a>
        <div class="mega-promo"><div class="mega-promo-title">CÓDIGO: NEXUS10</div><div class="mega-promo-text">10% en tu primer pedido</div></div>
      </div>
    </div>`);
}

/* ─────────────────────────────────────────
   15. FAVICON BADGE (unread cart)
   ───────────────────────────────────────── */
function initFaviconBadge() {
  function updateFavicon(count) {
    if (!count) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 32; canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🔧', 16, 16);
      if (count > 0) {
        ctx.fillStyle = '#00b4ff';
        ctx.beginPath(); ctx.arc(26,6,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(Math.min(count,99).toString(), 26, 6);
      }
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = canvas.toDataURL();
    } catch(e) {}
  }
  const cart = JSON.parse(localStorage.getItem('nexusCart')||'[]');
  updateFavicon(cart.length);
}

/* ─────────────────────────────────────────
   16. THEME TOGGLE (dark intensity)
   ───────────────────────────────────────── */
function initThemeToggle() {
  const saved = localStorage.getItem('nexusTheme') || 'dark';
  applyTheme(saved);

  const btn = document.createElement('button');
  btn.id = 'themeToggle';
  btn.title = 'Cambiar tema';
  btn.textContent = saved === 'darker' ? '☀' : '🌙';
  btn.style.cssText = `
    position:fixed;bottom:148px;left:32px;z-index:8000;
    width:44px;height:44px;border-radius:4px;
    background:var(--card);border:1px solid var(--border);
    color:var(--muted);font-size:18px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all 0.3s;`;
  btn.onmouseover = () => { btn.style.borderColor='var(--accent)'; btn.style.color='var(--accent)'; };
  btn.onmouseout  = () => { btn.style.borderColor='var(--border)'; btn.style.color='var(--muted)'; };
  btn.onclick = () => {
    const current = localStorage.getItem('nexusTheme')||'dark';
    const next = current === 'dark' ? 'darker' : 'dark';
    applyTheme(next);
    localStorage.setItem('nexusTheme', next);
    btn.textContent = next === 'darker' ? '☀' : '🌙';
    if(typeof showToast==='function') showToast(next==='darker'?'🌑 Modo oscuro intenso':'🌙 Modo oscuro estándar');
  };
  document.body.appendChild(btn);

  function applyTheme(t) {
    const root = document.documentElement;
    if (t === 'darker') {
      root.style.setProperty('--black','#000000');
      root.style.setProperty('--dark','#030608');
      root.style.setProperty('--card','#060c12');
      root.style.setProperty('--border','#0a1f33');
    } else {
      root.style.setProperty('--black','#020408');
      root.style.setProperty('--dark','#070d14');
      root.style.setProperty('--card','#0c1520');
      root.style.setProperty('--border','#0e2a45');
    }
  }
}

// Bootstrap new features
document.addEventListener('DOMContentLoaded', function () {
  initExitIntent();
  initShippingBar();
  initRecentlyViewed();
  initNotificationCenter();
  initMegaMenu();
  initFaviconBadge();
  initThemeToggle();
});
