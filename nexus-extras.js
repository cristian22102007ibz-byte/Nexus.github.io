/* ============================================================
   NEXUS EXTRAS — Global UI enhancements
   Loaded on every page via <script src="nexus-extras.js">
   ============================================================ */

// ── SIDEBAR TOGGLE (productos) ────────────────────────────────
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const inner = sidebar.querySelector('.sidebar-inner') || sidebar;

  if (!sidebar.querySelector('.sidebar-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'sidebar-toggle';
    btn.innerHTML = '🔧 Filtros <span id="sidebarArrow">▼</span>';
    btn.onclick = function() {
      const isOpen = inner.classList.contains('open');
      inner.classList.toggle('open', !isOpen);
      document.getElementById('sidebarArrow').textContent = isOpen ? '▼' : '▲';
    };
    sidebar.prepend(btn);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initAnnouncementBar();
  initSidebarToggle();
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
  // Always show until accepted

  const style = document.createElement('style');
  style.textContent = `
    #cookieBanner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
      background: var(--dark); border-top: 2px solid var(--accent);
      padding: 16px 40px; display: flex; align-items: center;
      justify-content: space-between; gap: 20px; flex-wrap: wrap;
      transform: translateY(100%);
      animation: cookieSlideUp 0.5s 0.3s cubic-bezier(.22,1,.36,1) forwards;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
    }
    @keyframes cookieSlideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    #cookieBanner .cookie-text {
      font-size: 13px; color: var(--muted); flex: 1;
      min-width: 220px; line-height: 1.6;
    }
    #cookieBanner .cookie-text strong { color: var(--text); }
    #cookieBanner .cookie-text a { color: var(--accent); text-decoration: none; }
    #cookieBanner .cookie-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
    #cookieBanner .cookie-reject {
      background: none; color: var(--muted); border: none;
      font-size: 12px; cursor: pointer; padding: 8px 4px;
      font-family: 'DM Sans', sans-serif; transition: color 0.2s;
      text-decoration: underline; white-space: nowrap;
    }
    #cookieBanner .cookie-reject:hover { color: var(--text); }
    #cookieBanner .cookie-accept {
      background: var(--accent); color: var(--black); border: none;
      padding: 10px 28px; font-size: 13px; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
      border-radius: 4px; font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s, transform 0.15s; white-space: nowrap;
    }
    #cookieBanner .cookie-accept:hover { opacity: 0.88; transform: scale(1.02); }
    #cookieBanner .cookie-accept:active { transform: scale(0.97); }
    @media(max-width:600px) {
      #cookieBanner { padding: 14px 16px; }
      #cookieBanner .cookie-actions { width: 100%; justify-content: flex-end; }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  var inner = document.createElement('div');
  inner.className = 'cookie-text';
  inner.innerHTML = '<strong>🍪 Usamos cookies</strong> para mejorar tu experiencia y analizar el tráfico. Al continuar aceptas su uso. <a href="#">Más info</a>';
  var actions = document.createElement('div');
  actions.className = 'cookie-actions';
  var btnReject = document.createElement('button');
  btnReject.className = 'cookie-reject';
  btnReject.textContent = 'Solo esenciales';
  btnReject.onclick = function() { cookieDismiss('rejected'); };
  var btnAccept = document.createElement('button');
  btnAccept.className = 'cookie-accept';
  btnAccept.textContent = '✓ Aceptar cookies';
  btnAccept.onclick = function() { cookieDismiss('accepted'); };
  actions.appendChild(btnReject);
  actions.appendChild(btnAccept);
  banner.appendChild(inner);
  banner.appendChild(actions);
  document.body.appendChild(banner);

  window.cookieDismiss = function(choice) {
    localStorage.setItem('nexusCookies', choice);
    banner.style.transition = 'transform 0.35s ease';
    banner.style.transform = 'translateY(100%)';
    setTimeout(function() { if (banner.parentNode) banner.remove(); }, 380);
  };
}

/* ─────────────────────────────────────────
   3. CHAT WIDGET
   ───────────────────────────────────────── */
function initChatWidget() {
  const style = document.createElement('style');
  style.textContent = `
    #chatWidget { position: fixed; bottom: 32px; right: 20px; z-index: 9000; }
    @media (max-width: 480px) {
      #chatWidget { bottom: 20px; right: 16px; }
      #chatWindow { width: calc(100vw - 32px); right: -8px; bottom: 68px; max-height: 75vh; }
    }
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
      background: var(--black); border: 1px solid var(--border);
      color: var(--muted); width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 14px; border-radius: 4px;
      transition: all 0.2s;
      font-family: 'JetBrains Mono', monospace;
      flex-shrink: 0;
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
      const icon = btn.dataset.icon || btn.closest('.product-card')?.querySelector('.product-img')?.textContent?.trim() || '📦';
      window._compareList.push({ name, price: parseFloat(price), icon });
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
      position: fixed; bottom: 32px; left: 32px; z-index: 8000;
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
   7. MOBILE MENU — Simple dropdown nav
   ───────────────────────────────────────── */
function initMobileMenu() {

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Hamburger */
    #mobileMenuBtn {
      display: none;
      background: none;
      border: 1px solid var(--border);
      color: var(--text);
      width: 40px; height: 40px;
      cursor: pointer;
      font-size: 20px;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color .2s, color .2s, background .2s;
      padding: 0;
      z-index: 10001;
      position: relative;
    }
    #mobileMenuBtn.open {
      border-color: var(--accent);
      color: var(--accent);
      background: rgba(0,200,255,.08);
    }

    /* Dropdown panel */
    #mobDropdown {
      display: none;
      position: fixed;
      top: 56px; left: 0; right: 0;
      background: var(--dark);
      border-bottom: 2px solid var(--accent);
      z-index: 9999;
      box-shadow: 0 16px 40px rgba(0,0,0,.6);
      transform: translateY(-8px);
      opacity: 0;
      transition: transform .22s ease, opacity .22s ease;
    }
    #mobDropdown.open {
      display: block;
      transform: translateY(0);
      opacity: 1;
    }

    /* Links */
    .mob-nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 15px 20px;
      font-size: 15px;
      color: var(--text);
      border-bottom: 1px solid rgba(42,64,96,.5);
      text-decoration: none;
      transition: background .15s, color .15s;
      -webkit-tap-highlight-color: transparent;
    }
    .mob-nav-item:last-child { border-bottom: none; }
    .mob-nav-item:active,
    .mob-nav-item:hover { background: var(--card); color: var(--accent); }
    .mob-nav-item.active { color: var(--accent); }
    .mob-nav-icon { font-size: 17px; width: 24px; text-align: center; flex-shrink: 0; }

    /* Auth row at bottom */
    .mob-nav-auth {
      display: flex;
      gap: 10px;
      padding: 14px 20px;
      border-top: 1px solid var(--border);
      background: var(--black);
    }
    .mob-nav-auth a {
      flex: 1; text-align: center;
      padding: 11px; font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      border-radius: 4px;
      text-decoration: none;
      transition: opacity .2s;
    }
    .mob-nav-login    { background: var(--card); border: 1px solid var(--border); color: var(--text); }
    .mob-nav-register { background: var(--accent); color: var(--black); font-weight: 600; }
    .mob-nav-auth a:hover { opacity: .85; }

    @media(max-width: 900px) { #mobileMenuBtn { display: flex !important; } }
  `;
  document.head.appendChild(style);

  /* ── Hamburger button ── */
  const btn = document.createElement('button');
  btn.id = 'mobileMenuBtn';
  btn.setAttribute('aria-label', 'Menú');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';
  btn.onclick = toggleMobileMenu;

  /* ── Dropdown panel ── */
  const dropdown = document.createElement('div');
  dropdown.id = 'mobDropdown';

  function buildDropdown() {
    const user = JSON.parse(localStorage.getItem('nexusUser') || 'null');
    const page = location.pathname.split('/').pop() || 'index.html';

    const links = [
      { href: 'index.html',    icon: '🏠', label: 'Inicio' },
      { href: 'productos.html',icon: '🖥️', label: 'Productos' },
      { href: 'gaming.html',   icon: '🎮', label: 'Gaming' },
      { href: 'ofertas.html',  icon: '🏷️', label: 'Ofertas' },
      { href: 'soporte.html',  icon: '💬', label: 'Soporte' },
      { href: 'comparar.html', icon: '⚖️', label: 'Comparar' },
      { href: 'blog.html',     icon: '📰', label: 'Blog' },
    ];

    const linksHTML = links.map(l => `
      <a href="${l.href}" class="mob-nav-item${page === l.href ? ' active' : ''}">
        <span class="mob-nav-icon">${l.icon}</span>${l.label}
      </a>`).join('');

    const authHTML = user
      ? `<div class="mob-nav-auth">
           <a href="perfil.html" class="mob-nav-login">👤 ${user.name || 'Mi perfil'}</a>
           <a href="#" class="mob-nav-register" onclick="logoutUser();closeMobileMenu()">Salir</a>
         </div>`
      : `<div class="mob-nav-auth">
           <a href="login.html"    class="mob-nav-login">Entrar</a>
           <a href="registro.html" class="mob-nav-register">Registro →</a>
         </div>`;

    dropdown.innerHTML = linksHTML + authHTML;
  }

  /* ── Inject into nav ── */
  const nav = document.querySelector('nav');
  if (nav) nav.appendChild(btn);
  document.body.appendChild(dropdown);

  /* ── Toggle ── */
  window.toggleMobileMenu = function () {
    const isOpen = dropdown.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  };

  window.openMobileMenu = function () {
    buildDropdown();
    dropdown.style.display = 'block';
    requestAnimationFrame(() => dropdown.classList.add('open'));
    btn.classList.add('open');
    btn.textContent = '✕';
    btn.setAttribute('aria-expanded', 'true');
  };

  window.closeMobileMenu = function () {
    dropdown.classList.remove('open');
    btn.classList.remove('open');
    btn.textContent = '☰';
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!dropdown.classList.contains('open')) dropdown.style.display = 'none'; }, 220);
  };

  /* ── Close on outside click ── */
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ── Close on ESC ── */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

  /* ── Close on nav link tap ── */
  dropdown.addEventListener('click', e => {
    if (e.target.closest('.mob-nav-item')) closeMobileMenu();
  });
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

/* ─────────────────────────────────────────
   WELCOME POPUP — shown once per session
   ───────────────────────────────────────── */
function initWelcomePopup() {
  if (sessionStorage.getItem('nexusWelcomeSeen')) return;

  const style = document.createElement('style');
  style.textContent = `
    #welcomeOverlay {
      position: fixed; inset: 0; z-index: 99998;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.4s ease;
    }
    #welcomeOverlay.show { opacity: 1; pointer-events: all; }

    #welcomeModal {
      background: var(--dark);
      border: 1px solid var(--border);
      width: 90%; max-width: 560px;
      position: relative; overflow: hidden;
      animation: wPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) both;
      border-radius: 4px;
    }
    @keyframes wPop {
      from { transform: scale(0.85) translateY(24px); opacity: 0; }
      to   { transform: none; opacity: 1; }
    }

    /* Decorative top banner */
    .w-banner {
      background: linear-gradient(135deg, rgba(0,200,255,0.12), rgba(139,92,246,0.14));
      border-bottom: 1px solid var(--border);
      padding: 36px 48px 28px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .w-banner::before {
      content: '';
      position: absolute; inset: 0;
      background: repeating-linear-gradient(
        45deg, transparent, transparent 20px,
        rgba(0,200,255,0.03) 20px, rgba(0,200,255,0.03) 21px
      );
    }
    .w-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 44px; letter-spacing: 6px;
      color: var(--accent);
      position: relative; z-index: 1;
      text-shadow: 0 0 40px rgba(0,200,255,0.4);
    }
    .w-tagline {
      font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
      color: var(--muted); font-family: 'JetBrains Mono', monospace;
      margin-top: 8px; position: relative; z-index: 1;
    }
    .w-badge {
      display: inline-block;
      background: var(--accent2); color: #fff;
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
      padding: 4px 12px; border-radius: 20px;
      margin-top: 16px; position: relative; z-index: 1;
    }

    /* Body */
    .w-body { padding: 36px 48px 40px; position: relative; }
    .w-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px; letter-spacing: 2px;
      color: var(--white); line-height: 1.1;
      margin-bottom: 10px;
    }
    .w-title span { color: var(--accent); }
    .w-sub {
      font-size: 14px; color: var(--muted);
      line-height: 1.65; margin-bottom: 28px;
    }

    /* Perks row */
    .w-perks {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 10px; margin-bottom: 28px;
    }
    .w-perk {
      background: rgba(0,200,255,0.04);
      border: 1px solid rgba(0,200,255,0.12);
      border-radius: 4px; padding: 12px 14px;
      display: flex; align-items: center; gap: 10px;
    }
    .w-perk-icon { font-size: 20px; flex-shrink: 0; }
    .w-perk-text { font-size: 12px; color: var(--text); line-height: 1.35; }
    .w-perk-text strong { display: block; font-size: 13px; color: var(--white); }

    /* Promo code */
    .w-code-row {
      background: rgba(0,180,255,0.06);
      border: 1px dashed rgba(0,200,255,0.35);
      border-radius: 4px; padding: 14px 18px;
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; gap: 12px;
    }
    .w-code-left { display: flex; flex-direction: column; gap: 3px; }
    .w-code-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    .w-code-val { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 4px; color: var(--accent); }
    .w-copy-btn {
      background: var(--accent); color: var(--black);
      border: none; padding: 9px 18px;
      font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
      font-family: 'DM Sans', sans-serif; cursor: pointer;
      border-radius: 4px; transition: opacity 0.2s; flex-shrink: 0;
    }
    .w-copy-btn:hover { opacity: 0.85; }

    /* CTAs */
    .w-actions { display: flex; gap: 10px; }
    .w-cta-main {
      flex: 1; background: var(--accent); color: var(--black);
      border: none; padding: 15px;
      font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
      font-family: 'DM Sans', sans-serif; cursor: pointer;
      border-radius: 4px; transition: opacity 0.2s;
    }
    .w-cta-main:hover { opacity: 0.85; }
    .w-cta-skip {
      background: none; border: none; color: var(--muted);
      font-size: 12px; cursor: pointer; letter-spacing: 1px;
      font-family: 'DM Sans', sans-serif; padding: 15px 16px;
      transition: color 0.2s;
    }
    .w-cta-skip:hover { color: var(--white); }

    /* Close X */
    .w-close {
      position: fixed; top: 14px; right: 14px;
      background: var(--dark); border: 1px solid var(--border);
      color: var(--muted); width: 36px; height: 36px;
      cursor: pointer; border-radius: 4px; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 100000;
    }
    .w-close:hover { border-color: #ff5e5e; color: #ff5e5e; }

    #welcomeModal {
      max-height: 90vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    @media(max-width:600px){
      #welcomeOverlay { align-items: flex-end; }
      #welcomeModal {
        width: 100%; max-width: 100%;
        border-radius: 12px 12px 0 0;
        max-height: 88vh;
        border-left: none; border-right: none; border-bottom: none;
        animation: wSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both;
      }
      @keyframes wSlideUp {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: none; opacity: 1; }
      }
      .w-banner { padding: 24px 20px 16px; }
      .w-logo { font-size: 32px; }
      .w-tagline { display: none; }
      .w-badge { font-size: 9px; margin-top: 10px; }
      .w-body { padding: 20px 20px 24px; }
      .w-title { font-size: 24px; }
      .w-sub { font-size: 13px; margin-bottom: 16px; }
      .w-perks { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
      .w-perk { padding: 10px 12px; }
      .w-perk-icon { font-size: 16px; }
      .w-perk-text { font-size: 11px; }
      .w-perk-text strong { font-size: 12px; }
      .w-code-row { padding: 12px 14px; margin-bottom: 16px; }
      .w-code-val { font-size: 22px; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'welcomeOverlay';
  overlay.innerHTML = `
    <div id="welcomeModal">
      <button class="w-close" onclick="closeWelcome()">✕</button>

      <div class="w-banner">
        <div class="w-logo">NEXUS</div>
        <div class="w-tagline">Tu tienda de hardware de confianza</div>
        <div class="w-badge">✦ Bienvenido — Oferta exclusiva dentro</div>
      </div>

      <div class="w-body">
        <div class="w-title">TODO LO QUE<br>NECESITAS PARA TU <span>SETUP</span></div>
        <div class="w-sub">Procesadores, GPUs, placas base, cajas, fuentes y periféricos de las mejores marcas. Envío gratis a partir de 99€.</div>

        <div class="w-perks">
          <div class="w-perk">
            <span class="w-perk-icon">🚀</span>
            <div class="w-perk-text"><strong>Envío en 24h</strong>Stock disponible inmediato</div>
          </div>
          <div class="w-perk">
            <span class="w-perk-icon">🛡️</span>
            <div class="w-perk-text"><strong>Garantía oficial</strong>2 años en todos los productos</div>
          </div>
          <div class="w-perk">
            <span class="w-perk-icon">💳</span>
            <div class="w-perk-text"><strong>Financiación 0%</strong>Hasta 12 meses sin intereses</div>
          </div>
          <div class="w-perk">
            <span class="w-perk-icon">⭐</span>
            <div class="w-perk-text"><strong>500 puntos gratis</strong>Al crear tu cuenta hoy</div>
          </div>
        </div>

        <div class="w-code-row">
          <div class="w-code-left">
            <span class="w-code-label">Descuento bienvenida</span>
            <span class="w-code-val">NEXUS10</span>
          </div>
          <button class="w-copy-btn" id="wCopyBtn" onclick="copyWelcomeCode()">−10% · Copiar</button>
        </div>

        <div class="w-actions">
          <button class="w-cta-main" onclick="closeWelcome(); window.location.href='productos.html'">🛒 Ver el catálogo</button>
          <button class="w-cta-skip" onclick="closeWelcome()">Entrar sin descuento</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  window.closeWelcome = function () {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 400);
    sessionStorage.setItem('nexusWelcomeSeen', '1');
  };

  window.copyWelcomeCode = function () {
    navigator.clipboard?.writeText('NEXUS10').catch(() => {});
    const btn = document.getElementById('wCopyBtn');
    btn.textContent = '✓ Copiado';
    btn.style.background = '#00c87a';
    setTimeout(() => { btn.textContent = '−10% · Copiar'; btn.style.background = ''; }, 2000);
  };

  // Show after short delay
  setTimeout(() => overlay.classList.add('show'), 800);
}

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
    { icon:'📦', text:'Tu pedido <strong>#NEX-2026-00312</strong> está en camino. Entrega estimada mañana.', time:'hace 2h', unread:true },
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


// Bootstrap new features
document.addEventListener('DOMContentLoaded', function () {
  initWelcomePopup();
  initExitIntent();
  initShippingBar();
  initRecentlyViewed();
  initNotificationCenter();
  initMegaMenu();
  initFaviconBadge();
});

/* ============================================================
   NEXUS EXTRAS v2 — Nuevas funcionalidades
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 17. LISTA DE DESEOS (Wishlist)
// ─────────────────────────────────────────────────────────────
function initWishlist() {
  let wishlist = JSON.parse(localStorage.getItem('nexusWishlist') || '[]');

  const style = document.createElement('style');
  style.textContent = `
    .wishlist-btn {
      background: none; border: 1px solid var(--border);
      color: var(--muted); width: 32px; height: 32px;
      border-radius: 4px; cursor: pointer; font-size: 15px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    .wishlist-btn:hover { border-color: #ff6b9d; color: #ff6b9d; }
    .wishlist-btn.active { border-color: #ff6b9d; color: #ff6b9d; background: rgba(255,107,157,0.1); }
    .wishlist-btn.active::after { content: ''; }
    #wishlistFloating {
      position: fixed; bottom: 100px; right: 24px; z-index: 9999;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 50%; width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: transform 0.2s;
    }
    #wishlistFloating:hover { transform: scale(1.1); }
    #wishlistBadge {
      position: absolute; top: -4px; right: -4px;
      background: #ff6b9d; color: white; border-radius: 50%;
      width: 18px; height: 18px; font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      display: none;
    }
    #wishlistPanel {
      position: fixed; right: 0; top: 0; bottom: 0; width: 380px; max-width: 95vw;
      background: var(--dark); border-left: 1px solid var(--border);
      z-index: 19999; transform: translateX(100%); transition: transform 0.35s cubic-bezier(.22,1,.36,1);
      display: flex; flex-direction: column;
    }
    #wishlistPanel.open { transform: translateX(0); }
    #wishlistOverlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 19998;
      display: none; backdrop-filter: blur(2px);
    }
    .wishlist-header {
      padding: 24px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .wishlist-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; color: var(--white); }
    .wishlist-close { background: none; border: 1px solid var(--border); color: var(--muted); width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 18px; }
    .wishlist-items { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .wishlist-item {
      background: var(--card); border: 1px solid var(--border); border-radius: 4px;
      padding: 14px; display: flex; gap: 12px; align-items: center;
    }
    .wishlist-item-icon { font-size: 28px; flex-shrink: 0; }
    .wishlist-item-info { flex: 1; min-width: 0; }
    .wishlist-item-name { font-size: 13px; color: var(--white); font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wishlist-item-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--accent); margin-top: 2px; }
    .wishlist-item-actions { display: flex; gap: 6px; flex-shrink: 0; }
    .wishlist-item-cart { background: var(--accent); color: var(--black); border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 700; }
    .wishlist-item-remove { background: none; border: 1px solid var(--border); color: var(--muted); padding: 6px 8px; border-radius: 4px; cursor: pointer; font-size: 13px; }
    .wishlist-empty { text-align: center; padding: 60px 20px; color: var(--muted); }
    .wishlist-empty-icon { font-size: 48px; margin-bottom: 16px; }
    .wishlist-footer { padding: 16px; border-top: 1px solid var(--border); }
  `;
  document.head.appendChild(style);

  // Floating button
  const floatBtn = document.createElement('div');
  floatBtn.id = 'wishlistFloating';
  floatBtn.innerHTML = '❤️<span id="wishlistBadge">0</span>';
  document.body.appendChild(floatBtn);

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'wishlistOverlay';
  document.body.appendChild(overlay);

  // Panel
  const panel = document.createElement('div');
  panel.id = 'wishlistPanel';
  panel.innerHTML = `
    <div class="wishlist-header">
      <div class="wishlist-title">❤ DESEADOS</div>
      <button class="wishlist-close" id="wishlistClose">×</button>
    </div>
    <div class="wishlist-items" id="wishlistItems"></div>
    <div class="wishlist-footer">
      <button onclick="addAllWishlistToCart()" style="width:100%;background:var(--accent);color:var(--black);border:none;padding:12px;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:2px;cursor:pointer;border-radius:4px">AÑADIR TODO AL CARRITO</button>
    </div>
  `;
  document.body.appendChild(panel);

  function updateBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (!badge) return;
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }

  function renderPanel() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    if (!wishlist.length) {
      container.innerHTML = `<div class="wishlist-empty"><div class="wishlist-empty-icon">💔</div><p>Tu lista de deseos está vacía.</p><p style="font-size:12px;margin-top:8px">Pulsa ❤ en cualquier producto para guardarlo.</p></div>`;
      return;
    }
    container.innerHTML = wishlist.map((item, i) => `
      <div class="wishlist-item">
        <div class="wishlist-item-icon">${item.icon || '📦'}</div>
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${item.name}</div>
          <div class="wishlist-item-price">${item.price}€</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="wishlist-item-cart" onclick="wishlistToCart(${i})">+ Carrito</button>
          <button class="wishlist-item-remove" onclick="removeFromWishlist(${i})">×</button>
        </div>
      </div>
    `).join('');
  }

  function openPanel() {
    renderPanel();
    panel.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  floatBtn.addEventListener('click', openPanel);
  document.getElementById('wishlistClose').addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Global functions
  window.toggleWishlist = function(name, price, icon, btn) {
    wishlist = JSON.parse(localStorage.getItem('nexusWishlist') || '[]');
    const idx = wishlist.findIndex(w => w.name === name);
    if (idx > -1) {
      wishlist.splice(idx, 1);
      if (btn) btn.classList.remove('active');
      if (typeof showToast === 'function') showToast('❌ Eliminado de deseados');
    } else {
      wishlist.push({ name, price, icon: icon || '📦' });
      if (btn) btn.classList.add('active');
      if (typeof showToast === 'function') showToast('❤️ Añadido a deseados');
    }
    localStorage.setItem('nexusWishlist', JSON.stringify(wishlist));
    updateBadge();
    // Sync all wishlist buttons on page
    document.querySelectorAll('.wishlist-btn').forEach(b => {
      const n = b.dataset.name;
      const inList = wishlist.some(w => w.name === n);
      b.classList.toggle('active', inList);
    });
  };
  window.removeFromWishlist = function(i) {
    wishlist.splice(i, 1);
    localStorage.setItem('nexusWishlist', JSON.stringify(wishlist));
    updateBadge();
    renderPanel();
  };
  window.wishlistToCart = function(i) {
    if (typeof addToCart === 'function') addToCart(wishlist[i].name, wishlist[i].price);
    if (typeof showToast === 'function') showToast('🛒 ' + wishlist[i].name + ' añadido al carrito');
  };
  window.addAllWishlistToCart = function() {
    wishlist.forEach(item => { if (typeof addToCart === 'function') addToCart(item.name, item.price); });
    if (typeof showToast === 'function') showToast('🛒 ' + wishlist.length + ' productos añadidos al carrito');
  };
  window.isInWishlist = function(name) { return wishlist.some(w => w.name === name); };

  // Mark existing buttons on load
  document.querySelectorAll('.wishlist-btn').forEach(b => {
    if (wishlist.some(w => w.name === b.dataset.name)) b.classList.add('active');
  });

  updateBadge();
}

// ─────────────────────────────────────────────────────────────
// 18. RESEÑAS DE USUARIOS
// ─────────────────────────────────────────────────────────────
function initReviews() {
  // Only run on product pages
  const reviewSection = document.getElementById('reviewSection');
  if (!reviewSection) return;

  const style = document.createElement('style');
  style.textContent = `
    .reviews-container { max-width: 800px; }
    .reviews-summary {
      display: flex; gap: 32px; align-items: center;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 4px; padding: 24px; margin-bottom: 24px;
    }
    .reviews-big-score { text-align: center; }
    .reviews-big-num { font-family: 'Bebas Neue', sans-serif; font-size: 64px; color: var(--accent); line-height: 1; }
    .reviews-big-stars { font-size: 20px; color: #f59e0b; }
    .reviews-big-count { font-size: 12px; color: var(--muted); margin-top: 4px; }
    .reviews-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .reviews-bar-row { display: flex; align-items: center; gap: 10px; }
    .reviews-bar-label { font-size: 12px; color: var(--muted); width: 16px; text-align: right; }
    .reviews-bar-track { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
    .reviews-bar-fill { height: 100%; background: #f59e0b; border-radius: 3px; transition: width 0.6s ease; }
    .reviews-bar-count { font-size: 11px; color: var(--muted); width: 20px; }
    .review-form {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 4px; padding: 24px; margin-bottom: 24px;
    }
    .review-form-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px; color: var(--white); margin-bottom: 16px; }
    .star-picker { display: flex; gap: 6px; margin-bottom: 16px; cursor: pointer; }
    .star-picker span { font-size: 28px; color: var(--border); transition: color 0.15s; }
    .star-picker span.lit { color: #f59e0b; }
    .review-input {
      width: 100%; background: var(--dark); border: 1px solid var(--border);
      color: var(--text); padding: 10px 14px; border-radius: 4px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; resize: vertical;
      outline: none; margin-bottom: 12px; transition: border-color 0.2s;
    }
    .review-input:focus { border-color: var(--accent); }
    .review-name-row { display: flex; gap: 10px; margin-bottom: 12px; }
    .review-submit {
      background: var(--accent); color: var(--black); border: none;
      padding: 10px 24px; font-family: 'Bebas Neue', sans-serif;
      font-size: 15px; letter-spacing: 1px; cursor: pointer; border-radius: 4px;
    }
    .review-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 4px; padding: 20px; margin-bottom: 12px;
    }
    .review-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .review-card-author { font-size: 14px; color: var(--white); font-weight: 500; }
    .review-card-date { font-size: 11px; color: var(--muted); }
    .review-card-stars { color: #f59e0b; font-size: 14px; margin-bottom: 8px; }
    .review-card-text { font-size: 13px; color: var(--text); line-height: 1.6; }
    .review-helpful { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 12px; color: var(--muted); }
    .review-helpful button { background: none; border: 1px solid var(--border); color: var(--muted); padding: 3px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; transition: all 0.2s; }
    .review-helpful button:hover { border-color: var(--accent); color: var(--accent); }
    .reviews-sort { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
    .reviews-sort button { background: none; border: 1px solid var(--border); color: var(--muted); padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 11px; letter-spacing: 1px; transition: all 0.2s; }
    .reviews-sort button.active, .reviews-sort button:hover { border-color: var(--accent); color: var(--accent); }
    .verified-badge { display: inline-block; background: rgba(0,200,255,0.1); color: var(--accent); font-size: 10px; padding: 2px 6px; border-radius: 3px; margin-left: 6px; font-family: 'JetBrains Mono', monospace; }
  `;
  document.head.appendChild(style);

  const productName = document.querySelector('h1, .product-title, [data-product-name]')?.textContent?.trim() || 'producto';
  const storageKey = 'nexusReviews_' + productName.replace(/\s+/g, '_').toLowerCase().slice(0, 40);

  // Seed reviews if none exist
  const seedReviews = [
    { author: 'Carlos M.', rating: 5, text: 'Increíble rendimiento. Lo tengo montado con una RTX 5080 y la diferencia respecto a mi setup anterior es brutal. Sin dudarlo la mejor compra del año.', date: '2026-11-14', helpful: 23, verified: true },
    { author: 'Ana G.', rating: 4, text: 'Muy buen producto, llegó bien embalado y en el plazo indicado. La instalación fue sencilla siguiendo la guía. Le quito una estrella porque el precio es algo elevado pero la calidad lo justifica.', date: '2026-10-29', helpful: 11, verified: true },
    { author: 'Javier R.', rating: 5, text: 'Top. Lo uso para edición de vídeo 4K y renderizado 3D. Temperaturas excelentes con un buen sistema de refrigeración. 100% recomendado.', date: '2026-10-08', helpful: 18, verified: false },
    { author: 'María L.', rating: 3, text: 'Correcto pero no espectacular. Para gaming puro el precio es algo alto comparado con alternativas del mercado. Para workstation sí tiene sentido.', date: '2026-09-21', helpful: 5, verified: true },
    { author: 'Pablo S.', rating: 5, text: 'Bestia absoluta. Nada más añadir. Si tienes dudas entre esto y la versión inferior, ve a por esta sin pensarlo dos veces.', date: '2026-09-03', helpful: 34, verified: true },
  ];

  let reviews = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (!reviews) {
    reviews = seedReviews;
    localStorage.setItem(storageKey, JSON.stringify(reviews));
  }

  let selectedRating = 0;
  let sortMode = 'recent';

  function avgRating() {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }
  function barData() {
    const counts = [0,0,0,0,0];
    reviews.forEach(r => counts[r.rating - 1]++);
    return counts.reverse(); // 5 first
  }

  function render() {
    const avg = avgRating();
    const bars = barData();
    const sorted = [...reviews].sort((a, b) => {
      if (sortMode === 'helpful') return b.helpful - a.helpful;
      if (sortMode === 'highest') return b.rating - a.rating;
      if (sortMode === 'lowest') return a.rating - b.rating;
      return new Date(b.date) - new Date(a.date);
    });

    reviewSection.innerHTML = `
      <div class="section-tag" style="margin-bottom:8px">// Opiniones</div>
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:2px;color:var(--white);margin-bottom:24px">RESEÑAS <span style="color:var(--accent)">(${reviews.length})</span></h2>
      <div class="reviews-container">
        <div class="reviews-summary">
          <div class="reviews-big-score">
            <div class="reviews-big-num">${avg}</div>
            <div class="reviews-big-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</div>
            <div class="reviews-big-count">${reviews.length} valoraciones</div>
          </div>
          <div class="reviews-bars">
            ${bars.map((count, i) => `
              <div class="reviews-bar-row">
                <div class="reviews-bar-label">${5-i}★</div>
                <div class="reviews-bar-track"><div class="reviews-bar-fill" style="width:${reviews.length ? Math.round(count/reviews.length*100) : 0}%"></div></div>
                <div class="reviews-bar-count">${count}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="review-form">
          <div class="review-form-title">✍ ESCRIBE TU RESEÑA</div>
          <div class="star-picker" id="starPicker">
            ${[1,2,3,4,5].map(n => `<span data-val="${n}">★</span>`).join('')}
          </div>
          <div class="review-name-row">
            <input class="review-input" id="reviewName" placeholder="Tu nombre" style="margin:0;height:40px;resize:none" />
          </div>
          <textarea class="review-input" id="reviewText" rows="3" placeholder="Cuéntanos tu experiencia con este producto..."></textarea>
          <button class="review-submit" onclick="submitReview()">PUBLICAR RESEÑA</button>
        </div>

        <div class="reviews-sort">
          <button class="${sortMode==='recent'?'active':''}" onclick="setReviewSort('recent')">MÁS RECIENTES</button>
          <button class="${sortMode==='helpful'?'active':''}" onclick="setReviewSort('helpful')">MÁS ÚTILES</button>
          <button class="${sortMode==='highest'?'active':''}" onclick="setReviewSort('highest')">MAYOR PUNTUACIÓN</button>
          <button class="${sortMode==='lowest'?'active':''}" onclick="setReviewSort('lowest')">MENOR PUNTUACIÓN</button>
        </div>

        ${sorted.map((r, i) => `
          <div class="review-card">
            <div class="review-card-header">
              <div>
                <span class="review-card-author">${r.author}</span>
                ${r.verified ? '<span class="verified-badge">✓ Compra verificada</span>' : ''}
              </div>
              <div class="review-card-date">${new Date(r.date).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</div>
            </div>
            <div class="review-card-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
            <div class="review-card-text">${r.text}</div>
            <div class="review-helpful">
              ¿Útil?
              <button onclick="markHelpful(${i})">👍 Sí (${r.helpful})</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Star picker interaction
    const picker = document.getElementById('starPicker');
    if (picker) {
      picker.querySelectorAll('span').forEach(star => {
        star.addEventListener('mouseenter', () => {
          const val = +star.dataset.val;
          picker.querySelectorAll('span').forEach(s => s.classList.toggle('lit', +s.dataset.val <= val));
        });
        star.addEventListener('click', () => {
          selectedRating = +star.dataset.val;
          picker.querySelectorAll('span').forEach(s => s.classList.toggle('lit', +s.dataset.val <= selectedRating));
        });
      });
      picker.addEventListener('mouseleave', () => {
        picker.querySelectorAll('span').forEach(s => s.classList.toggle('lit', +s.dataset.val <= selectedRating));
      });
    }
  }

  window.submitReview = function() {
    const name = document.getElementById('reviewName')?.value?.trim();
    const text = document.getElementById('reviewText')?.value?.trim();
    if (!name) { if (typeof showToast === 'function') showToast('⚠ Escribe tu nombre'); return; }
    if (!selectedRating) { if (typeof showToast === 'function') showToast('⚠ Selecciona una puntuación'); return; }
    if (!text || text.length < 10) { if (typeof showToast === 'function') showToast('⚠ Escribe al menos 10 caracteres'); return; }
    reviews.unshift({ author: name, rating: selectedRating, text, date: new Date().toISOString().split('T')[0], helpful: 0, verified: false });
    localStorage.setItem(storageKey, JSON.stringify(reviews));
    selectedRating = 0;
    sortMode = 'recent';
    render();
    if (typeof showToast === 'function') showToast('✅ Reseña publicada. ¡Gracias!');
  };

  window.markHelpful = function(i) {
    reviews[i].helpful++;
    localStorage.setItem(storageKey, JSON.stringify(reviews));
    render();
  };

  window.setReviewSort = function(mode) {
    sortMode = mode;
    render();
  };

  render();
}

// ─────────────────────────────────────────────────────────────
// 19. HISTORIAL DE PRECIOS (sparkline)
// ─────────────────────────────────────────────────────────────
function initPriceHistory() {
  const container = document.getElementById('priceHistoryChart');
  if (!container) return;

  const currentPrice = parseFloat(container.dataset.price) || 100;
  const productName = container.dataset.name || '';

  // Generate 90 days of fake-but-realistic price history
  function generateHistory(basePrice) {
    const days = 90;
    const history = [];
    let price = basePrice * (1 + (Math.random() * 0.3));
    for (let i = days; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      // Random walk with drift towards current price
      const change = (Math.random() - 0.48) * basePrice * 0.03;
      price = Math.max(basePrice * 0.8, Math.min(basePrice * 1.5, price + change));
      if (i === 0) price = basePrice;
      history.push({ date: d.toISOString().split('T')[0], price: Math.round(price * 100) / 100 });
    }
    return history;
  }

  const key = 'nexusPriceHistory_' + productName.replace(/\s+/g,'_').slice(0,30);
  let history = JSON.parse(localStorage.getItem(key) || 'null');
  if (!history) {
    history = generateHistory(currentPrice);
    localStorage.setItem(key, JSON.stringify(history));
  }

  const prices = history.map(h => h.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const W = 600, H = 120, PAD = 8;
  const points = prices.map((p, i) => {
    const x = PAD + (i / (prices.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (p - minP) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });

  const avgP = (prices.reduce((s,p) => s+p, 0) / prices.length).toFixed(2);
  const minDate = history[prices.indexOf(minP)]?.date;
  const maxDate = history[prices.indexOf(maxP)]?.date;

  const style = document.createElement('style');
  style.textContent = `
    .price-chart-wrap { background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 20px; }
    .price-chart-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; color: var(--white); margin-bottom: 4px; }
    .price-chart-sub { font-size: 12px; color: var(--muted); margin-bottom: 16px; }
    .price-chart-stats { display: flex; gap: 24px; margin-top: 14px; flex-wrap: wrap; }
    .price-chart-stat { text-align: center; }
    .price-chart-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 22px; }
    .price-chart-stat-label { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    .price-chart-stat.low .price-chart-stat-val { color: #4ade80; }
    .price-chart-stat.high .price-chart-stat-val { color: #f87171; }
    .price-chart-stat.avg .price-chart-stat-val { color: var(--accent); }
    .price-chart-stat.now .price-chart-stat-val { color: var(--white); }
    .chart-tooltip {
      position: absolute; background: var(--dark); border: 1px solid var(--accent);
      padding: 6px 10px; border-radius: 4px; font-size: 12px; color: var(--white);
      pointer-events: none; display: none; z-index: 10; white-space: nowrap;
    }
  `;
  document.head.appendChild(style);

  const svgWrap = document.createElement('div');
  svgWrap.style.position = 'relative';
  svgWrap.innerHTML = `
    <div class="price-chart-wrap">
      <div class="price-chart-title">📈 HISTORIAL DE PRECIOS — 90 DÍAS</div>
      <div class="price-chart-sub">Precio más bajo: <strong style="color:#4ade80">${minP.toFixed(2)}€</strong> · Precio más alto: <strong style="color:#f87171">${maxP.toFixed(2)}€</strong></div>
      <div style="position:relative;overflow:hidden">
        <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" id="priceChartSVG">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <polygon points="${points.join(' ')} ${W-PAD},${H-PAD} ${PAD},${H-PAD}" fill="url(#chartGrad)"/>
          <polyline points="${points.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          <circle cx="${points[points.length-1].split(',')[0]}" cy="${points[points.length-1].split(',')[1]}" r="4" fill="var(--accent)" stroke="var(--dark)" stroke-width="2"/>
        </svg>
        <div class="chart-tooltip" id="chartTooltip"></div>
      </div>
      <div class="price-chart-stats">
        <div class="price-chart-stat low"><div class="price-chart-stat-val">${minP.toFixed(2)}€</div><div class="price-chart-stat-label">MÍNIMO</div></div>
        <div class="price-chart-stat high"><div class="price-chart-stat-val">${maxP.toFixed(2)}€</div><div class="price-chart-stat-label">MÁXIMO</div></div>
        <div class="price-chart-stat avg"><div class="price-chart-stat-val">${avgP}€</div><div class="price-chart-stat-label">MEDIA 90D</div></div>
        <div class="price-chart-stat now"><div class="price-chart-stat-val">${currentPrice.toFixed(2)}€</div><div class="price-chart-stat-label">HOY</div></div>
      </div>
    </div>
  `;
  container.appendChild(svgWrap);

  // Hover tooltip
  const svg = document.getElementById('priceChartSVG');
  const tooltip = document.getElementById('chartTooltip');
  if (svg && tooltip) {
    svg.addEventListener('mousemove', function(e) {
      const rect = svg.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width;
      const idx = Math.round(xRel * (history.length - 1));
      const item = history[Math.max(0, Math.min(history.length-1, idx))];
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
      tooltip.style.top = '10px';
      tooltip.textContent = `${item.date}: ${item.price.toFixed(2)}€`;
    });
    svg.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
  }
}

// ─────────────────────────────────────────────────────────────
// 20. COMPARTIR PRODUCTO
// ─────────────────────────────────────────────────────────────
function initShareProduct() {
  const container = document.getElementById('shareProduct');
  if (!container) return;

  const name = container.dataset.name || document.title;
  const price = container.dataset.price || '';
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`🖥 ${name} — ${price}€ en NEXUS Tech`);

  const style = document.createElement('style');
  style.textContent = `
    .share-buttons { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .share-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 14px; border-radius: 4px; cursor: pointer;
      font-size: 12px; font-weight: 500; border: 1px solid var(--border);
      transition: all 0.2s; text-decoration: none; color: var(--text);
      background: var(--card);
    }
    .share-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .share-btn.whatsapp:hover { border-color: #25d366; color: #25d366; }
    .share-btn.twitter:hover { border-color: #1da1f2; color: #1da1f2; }
    .share-btn.copy:hover { border-color: var(--accent); color: var(--accent); }
    .share-label { font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 1px; margin-bottom: 10px; }
  `;
  document.head.appendChild(style);

  container.innerHTML = `
    <div class="share-label">// COMPARTIR</div>
    <div class="share-buttons">
      <a class="share-btn whatsapp" href="https://wa.me/?text=${text}%20${url}" target="_blank" rel="noopener">
        <span>💬</span> WhatsApp
      </a>
      <a class="share-btn twitter" href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener">
        <span>𝕏</span> Twitter/X
      </a>
      <button class="share-btn copy" onclick="copyProductLink(this)">
        <span>🔗</span> Copiar enlace
      </button>
    </div>
  `;

  window.copyProductLink = function(btn) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      btn.innerHTML = '<span>✓</span> Copiado';
      setTimeout(() => { btn.innerHTML = '<span>🔗</span> Copiar enlace'; }, 2000);
    });
  };
}

// ─────────────────────────────────────────────────────────────
// 21. MODO CLARO / OSCURO
// ─────────────────────────────────────────────────────────────
function initDarkModeToggle() {
  const style = document.createElement('style');
  style.textContent = `
    body.light-mode {
      --black: #f0f4f8; --dark: #e2e8f0; --card: #ffffff;
      --border: #cbd5e1; --muted: #64748b; --text: #1e293b; --white: #0f172a;
    }
    body.light-mode nav { background: rgba(240,244,248,0.97); }
    body.light-mode .product-card { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    #darkToggle {
      background: none; border: 1px solid var(--border); color: var(--muted);
      width: 36px; height: 36px; border-radius: 4px; cursor: pointer;
      font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0;
    }
    #darkToggle:hover { border-color: var(--accent); color: var(--accent); }
    body { transition: background 0.3s, color 0.3s; }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'darkToggle';
  btn.title = 'Cambiar tema';
  const isDark = localStorage.getItem('nexusTheme') !== 'light';
  btn.textContent = isDark ? '☀️' : '🌙';
  if (!isDark) document.body.classList.add('light-mode');

  // Insert into nav actions
  const navActions = document.getElementById('navActions');
  if (navActions) navActions.insertBefore(btn, navActions.firstChild);

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    btn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('nexusTheme', isLight ? 'light' : 'dark');
  });
}

// ─────────────────────────────────────────────────────────────
// 22. BREADCRUMBS
// ─────────────────────────────────────────────────────────────
function initBreadcrumbs() {
  const container = document.getElementById('breadcrumbs');
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    .breadcrumb-nav {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      padding: 12px 0; font-size: 12px; color: var(--muted);
      font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
    }
    .breadcrumb-nav a { color: var(--muted); transition: color 0.2s; }
    .breadcrumb-nav a:hover { color: var(--accent); }
    .breadcrumb-sep { color: var(--border); }
    .breadcrumb-current { color: var(--text); }
  `;
  document.head.appendChild(style);

  // Auto-build from data attributes
  const crumbs = JSON.parse(container.dataset.crumbs || '[]');
  if (!crumbs.length) return;

  container.innerHTML = `<nav class="breadcrumb-nav" aria-label="breadcrumb">
    ${crumbs.map((c, i) => i < crumbs.length - 1
      ? `<a href="${c.url}">${c.label}</a><span class="breadcrumb-sep">/</span>`
      : `<span class="breadcrumb-current">${c.label}</span>`
    ).join('')}
  </nav>`;
}

// ─────────────────────────────────────────────────────────────
// 23. ALERTA STOCK POR EMAIL
// ─────────────────────────────────────────────────────────────
function initStockEmailAlert() {
  const container = document.getElementById('stockEmailAlert');
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    .stock-alert-form {
      background: var(--card); border: 1px solid var(--border);
      border-left: 3px solid #f59e0b;
      border-radius: 4px; padding: 16px 20px;
    }
    .stock-alert-title { font-size: 13px; color: #f59e0b; font-weight: 500; margin-bottom: 10px; }
    .stock-alert-row { display: flex; gap: 8px; }
    .stock-alert-input {
      flex: 1; background: var(--dark); border: 1px solid var(--border);
      color: var(--text); padding: 8px 12px; border-radius: 4px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
      transition: border-color 0.2s;
    }
    .stock-alert-input:focus { border-color: #f59e0b; }
    .stock-alert-btn {
      background: #f59e0b; color: var(--black); border: none;
      padding: 8px 16px; border-radius: 4px; cursor: pointer;
      font-family: 'Bebas Neue', sans-serif; font-size: 14px; letter-spacing: 1px;
      white-space: nowrap;
    }
    .stock-alert-btn:hover { background: #d97706; }
  `;
  document.head.appendChild(style);

  const productName = container.dataset.name || 'este producto';

  container.innerHTML = `
    <div class="stock-alert-form">
      <div class="stock-alert-title">🔔 AVÍSAME CUANDO HAYA STOCK</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Te notificamos cuando <strong style="color:var(--text)">${productName}</strong> vuelva a estar disponible.</div>
      <div class="stock-alert-row">
        <input class="stock-alert-input" id="stockAlertEmail" type="email" placeholder="tu@email.com" />
        <button class="stock-alert-btn" onclick="subscribeStockAlert()">AVISAR</button>
      </div>
    </div>
  `;

  window.subscribeStockAlert = function() {
    const email = document.getElementById('stockAlertEmail')?.value?.trim();
    if (!email || !email.includes('@')) { if (typeof showToast === 'function') showToast('⚠ Introduce un email válido'); return; }
    const alerts = JSON.parse(localStorage.getItem('nexusStockAlerts') || '[]');
    alerts.push({ product: productName, email, date: new Date().toISOString() });
    localStorage.setItem('nexusStockAlerts', JSON.stringify(alerts));
    container.innerHTML = `<div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.4);border-radius:4px;padding:16px 20px;font-size:13px;color:#f59e0b">✅ Registrado. Te avisaremos en <strong>${email}</strong> cuando haya stock.</div>`;
    if (typeof showToast === 'function') showToast('🔔 Alerta de stock activada');
  };
}

// ─────────────────────────────────────────────────────────────
// Bootstrap v2
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initWishlist();
  initReviews();
  initPriceHistory();
  initShareProduct();
  initDarkModeToggle();
  initBreadcrumbs();
  initStockEmailAlert();
});

/* ============================================================
   NEXUS EXTRAS v3 — UX Global
   ============================================================ */

// ─────────────────────────────────────────────────────────────
// 24. QUICK VIEW MODAL
// ─────────────────────────────────────────────────────────────
function initQuickView() {
  const style = document.createElement('style');
  style.textContent = `
    #quickViewModal {
      position: fixed; inset: 0; z-index: 30000;
      display: none; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
      padding: 20px;
    }
    #quickViewModal.open { display: flex; }
    #quickViewBox {
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 4px; width: 100%; max-width: 640px;
      max-height: 90vh; overflow-y: auto;
      animation: qvSlide 0.3s cubic-bezier(.22,1,.36,1);
    }
    @keyframes qvSlide { from { transform: translateY(32px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .qv-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 24px 0; }
    .qv-cat { font-size: 10px; color: var(--accent); font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; margin-bottom: 6px; }
    .qv-name { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 1px; color: var(--white); line-height: 1.1; }
    .qv-close { background: none; border: 1px solid var(--border); color: var(--muted); width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 20px; flex-shrink: 0; transition: all 0.2s; }
    .qv-close:hover { border-color: #f87171; color: #f87171; }
    .qv-body { display: grid; grid-template-columns: 160px 1fr; gap: 0; padding: 24px; }
    .qv-icon { font-size: 80px; background: var(--card); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; padding: 20px; border-radius: 4px; }
    .qv-info { padding-left: 20px; }
    .qv-stars { color: #f59e0b; font-size: 14px; margin-bottom: 10px; }
    .qv-desc { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 16px; }
    .qv-specs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .qv-spec { background: var(--card); border: 1px solid var(--border); padding: 3px 10px; font-size: 11px; color: var(--text); font-family: 'JetBrains Mono', monospace; border-radius: 20px; }
    .qv-price { font-family: 'Bebas Neue', sans-serif; font-size: 36px; color: var(--accent); margin-bottom: 4px; }
    .qv-old { font-size: 14px; color: var(--muted); text-decoration: line-through; margin-bottom: 16px; }
    .qv-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .qv-btn-cart { background: var(--accent); color: var(--black); border: none; padding: 12px 24px; font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 1px; cursor: pointer; border-radius: 4px; flex: 1; transition: all 0.2s; }
    .qv-btn-cart:hover { background: #00aadd; }
    .qv-btn-more { background: none; border: 1px solid var(--border); color: var(--muted); padding: 12px 20px; font-family: 'Bebas Neue', sans-serif; font-size: 14px; letter-spacing: 1px; cursor: pointer; border-radius: 4px; transition: all 0.2s; }
    .qv-btn-more:hover { border-color: var(--accent); color: var(--accent); }
    @media(max-width:480px){ .qv-body { grid-template-columns: 1fr; } .qv-info { padding-left: 0; padding-top: 16px; } }
    .quick-view-trigger {
      position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%) translateY(8px);
      background: rgba(15,28,46,0.92); border: 1px solid var(--border); color: var(--muted);
      font-size: 11px; padding: 5px 12px; border-radius: 20px; cursor: pointer;
      white-space: nowrap; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;
      opacity: 0; transition: all 0.2s; pointer-events: none; z-index: 5;
    }
    .product-card:hover .quick-view-trigger { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
  `;
  document.head.appendChild(style);

  // Build modal
  const modal = document.createElement('div');
  modal.id = 'quickViewModal';
  modal.innerHTML = '<div id="quickViewBox"></div>';
  document.body.appendChild(modal);

  modal.addEventListener('click', e => { if (e.target === modal) closeQuickView(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickView(); });

  // Inject trigger buttons on product cards
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.querySelector('.product-name')?.textContent;
    const price = card.querySelector('.product-price')?.textContent?.replace('€','').replace('.','').trim();
    const brand = card.querySelector('.product-brand')?.textContent || '';
    const icon = card.querySelector('.product-img')?.textContent?.trim() || '📦';
    const specs = [...(card.querySelectorAll('.spec-tag') || [])].map(s => s.textContent).join(' · ');
    const oldPrice = card.querySelector('.product-price-old')?.textContent || '';
    if (!name) return;

    // Make sure card has relative positioning
    card.style.position = 'relative';

    const trigger = document.createElement('button');
    trigger.className = 'quick-view-trigger';
    trigger.textContent = '⚡ Vista Rápida';
    trigger.onclick = function(e) {
      e.stopPropagation();
      openQuickView({ name, brand, price, oldPrice, icon, specs });
    };
    card.appendChild(trigger);
  });

  window.openQuickView = function({ name, brand, price, oldPrice, icon, specs }) {
    const box = document.getElementById('quickViewBox');
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const specArr = specs ? specs.split(' · ') : [];
    box.innerHTML = `
      <div class="qv-header">
        <div>
          <div class="qv-cat">${brand.toUpperCase()}</div>
          <div class="qv-name">${name}</div>
        </div>
        <button class="qv-close" onclick="closeQuickView()">×</button>
      </div>
      <div class="qv-body">
        <div class="qv-icon">${icon}</div>
        <div class="qv-info">
          <div class="qv-stars">★★★★★ <span style="font-size:11px;color:var(--muted);margin-left:4px;font-family:'JetBrains Mono',monospace">4.8 / 5</span></div>
          <div class="qv-specs">${specArr.map(s => `<span class="qv-spec">${s}</span>`).join('')}</div>
          <div class="qv-price">${price}€</div>
          ${oldPrice ? `<div class="qv-old">${oldPrice}</div>` : ''}
          <div class="qv-actions">
            <button class="qv-btn-cart" onclick="addToCart(this.dataset.n, parseFloat(this.dataset.p));this.textContent='✓ Añadido';setTimeout(()=>this.textContent='🛒 Añadir al carrito',1400)" data-n="${name.replace(/"/g,'&amp;quot;')}" data-p="${parseFloat(price)||0}">🛒 Añadir al carrito</button>
            <button class="qv-btn-more" onclick="closeQuickView();window.location.href='producto-${slug}.html'">Ver más →</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('quickViewModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeQuickView = function() {
    document.getElementById('quickViewModal').classList.remove('open');
    document.body.style.overflow = '';
  };
}

// ─────────────────────────────────────────────────────────────
// 25. CONTADORES ANIMADOS (sobre-nosotros, index)
// ─────────────────────────────────────────────────────────────
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      const display = Number.isInteger(target) ? Math.round(current) : current.toFixed(1);
      el.textContent = prefix + display.toLocaleString('es-ES') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };

  // Use IntersectionObserver for scroll trigger
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────────────────────
// 26. NEWSLETTER POPUP + FLOATING BANNER
// ─────────────────────────────────────────────────────────────
function initNewsletter() {
  // Show again after 7 days
  var nlSeen = localStorage.getItem('nexusNewsletter');
  if (nlSeen) {
    var seenDate = parseInt(nlSeen);
    if (!isNaN(seenDate) && (Date.now() - seenDate) < 7 * 24 * 3600 * 1000) return;
    if (nlSeen === '1') return; // legacy: never show again if manually dismissed
  }

  const style = document.createElement('style');
  style.textContent = `
    #newsletterPopup {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -40%) scale(0.95);
      opacity: 0; pointer-events: none;
      z-index: 19000;
      width: 360px; max-width: calc(100vw - 32px);
      background: var(--dark); border: 1px solid var(--border);
      border-top: 3px solid var(--accent2); border-radius: 8px; padding: 28px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.7);
      transition: transform 0.4s cubic-bezier(.22,1,.36,1), opacity 0.35s ease;
    }
    #newsletterPopup.show {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1; pointer-events: auto;
    }
    #newsletterPopup-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 18999; opacity: 0; pointer-events: none;
      transition: opacity 0.35s;
    }
    #newsletterPopup-overlay.show { opacity: 1; pointer-events: auto; }
    #newsletterPopup .nl-close { position:absolute; top:12px; right:12px; background:none; border:none; color:var(--muted); cursor:pointer; font-size:18px; }
    #newsletterPopup .nl-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:1px; color:var(--white); margin-bottom:4px; }
    #newsletterPopup .nl-sub { font-size:12px; color:var(--muted); margin-bottom:16px; line-height:1.5; }
    #newsletterPopup .nl-row { display:flex; gap:0; }
    #newsletterPopup .nl-input { flex:1; background:var(--black); border:1px solid var(--border); border-right:none; color:var(--text); padding:10px 12px; font-size:12px; font-family:'DM Sans',sans-serif; outline:none; border-radius:4px 0 0 4px; }
    #newsletterPopup .nl-input:focus { border-color:var(--accent2); }
    #newsletterPopup .nl-btn { background:var(--accent2); color:white; border:none; padding:10px 16px; font-family:'Bebas Neue',sans-serif; font-size:14px; letter-spacing:1px; cursor:pointer; border-radius:0 4px 4px 0; }
    #newsletterPopup .nl-note { font-size:10px; color:var(--muted); margin-top:10px; }
    #newsletterPopup .nl-perk { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--muted); margin-bottom:6px; }
  `;
  document.head.appendChild(style);

  const popup = document.createElement('div');
  popup.id = 'newsletterPopup';
  popup.innerHTML = `
    <button class="nl-close" onclick="closeNewsletter()">×</button>
    <div class="nl-title">📧 ÚNETE A NEXUS</div>
    <div class="nl-sub">Newsletter semanal con las mejores ofertas, guías y novedades tech.</div>
    <div class="nl-perk">✅ Código 15% de descuento en tu próxima compra</div>
    <div class="nl-perk">✅ Alertas de flash sales exclusivas</div>
    <div class="nl-perk">✅ Guías de compra antes de publicarse</div>
    <div class="nl-row" style="margin-top:14px">
      <input class="nl-input" type="email" id="nlEmail" placeholder="tu@email.com">
      <button class="nl-btn" onclick="subscribeNewsletter()">SUSCRIBIR</button>
    </div>
    <div class="nl-note">Sin spam. Baja cuando quieras. Datos protegidos según RGPD.</div>
  `;
  document.body.appendChild(popup);

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'newsletterPopup-overlay';
  overlay.onclick = function() { window.closeNewsletter(); };
  document.body.appendChild(overlay);

  setTimeout(() => {
    popup.classList.add('show');
    overlay.classList.add('show');
  }, 3000);

  window.closeNewsletter = function() {
    popup.classList.remove('show');
    overlay.classList.remove('show');
    localStorage.setItem('nexusNewsletter', '1');
  };

  window.subscribeNewsletter = function() {
    const email = document.getElementById('nlEmail')?.value?.trim();
    if (!email || !email.includes('@')) { if (typeof showToast === 'function') showToast('⚠ Email inválido'); return; }
    localStorage.setItem('nexusNewsletter', '1');
    localStorage.setItem('nexusNewsletterEmail', email);
    popup.innerHTML = `<div style="text-align:center;padding:10px 0"><div style="font-size:40px;margin-bottom:12px">🎉</div><div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--white);margin-bottom:6px">¡BIENVENIDO/A!</div><div style="font-size:12px;color:var(--muted);margin-bottom:16px">Tu código de descuento: <span style="background:rgba(139,92,246,0.15);border:1px solid var(--accent2);color:var(--accent2);font-family:'JetBrains Mono',monospace;padding:2px 10px;border-radius:3px">NEXUSVIP</span></div><button onclick="closeNewsletter()" style="background:var(--accent2);color:white;border:none;padding:8px 20px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:1px;cursor:pointer;border-radius:4px">USAR AHORA</button></div>`;
    setTimeout(() => popup.classList.remove('show'), 5000);
  };
}

// ─────────────────────────────────────────────────────────────
// 27. SKELETON LOADERS (auto-inject on products grid)
// ─────────────────────────────────────────────────────────────
function initSkeletonLoader() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -800px 0; }
      100% { background-position: 800px 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, var(--card) 25%, var(--border) 50%, var(--card) 75%);
      background-size: 800px 100%;
      animation: shimmer 1.5s infinite linear;
      border-radius: 4px;
    }
    .skeleton-card {
      background: var(--card); border: 1px solid var(--border);
      border-radius: 4px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
    }
    .skeleton-img { height: 120px; }
    .skeleton-line-lg { height: 16px; width: 80%; }
    .skeleton-line-md { height: 12px; width: 60%; }
    .skeleton-line-sm { height: 10px; width: 45%; }
    .skeleton-price { height: 24px; width: 30%; }
    .skeleton-btn { height: 36px; }
  `;
  document.head.appendChild(style);

  window.showSkeletons = function(container, count = 6) {
    container.innerHTML = Array(count).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line-lg"></div>
        <div class="skeleton skeleton-line-md"></div>
        <div class="skeleton skeleton-line-sm"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <div class="skeleton skeleton-price"></div>
          <div class="skeleton" style="width:40px;height:32px;border-radius:4px"></div>
        </div>
      </div>
    `).join('');
  };
}

// ─────────────────────────────────────────────────────────────
// 28. COMPARADOR: GRÁFICO RADAR SVG
// ─────────────────────────────────────────────────────────────
function initCompareRadar() {
  const container = document.getElementById('compareRadar');
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    .radar-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .radar-legend { display: flex; gap: 20px; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
    .radar-legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
  `;
  document.head.appendChild(style);

  // Will be called by comparar.html with actual data
  window.renderRadar = function(products) {
    if (!products.length) { container.innerHTML = ''; return; }
    const axes = ['Rendimiento', 'Precio/Valor', 'Eficiencia', 'Conectividad', 'Fiabilidad'];
    const colors = ['#00c8ff', '#8b5cf6', '#f59e0b'];
    const cx = 200, cy = 200, R = 150;
    const N = axes.length;

    function point(angle, r) {
      const a = (angle * Math.PI * 2 / N) - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }

    let svg = `<svg viewBox="0 0 400 400" style="width:100%;max-width:400px">`;

    // Background grid
    [0.2, 0.4, 0.6, 0.8, 1].forEach(t => {
      const pts = axes.map((_, i) => point(i, R * t).join(',')).join(' ');
      svg += `<polygon points="${pts}" fill="none" stroke="var(--border)" stroke-width="${t === 1 ? 1.5 : 0.5}"/>`;
    });

    // Axes
    axes.forEach((label, i) => {
      const [x, y] = point(i, R);
      svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--border)" stroke-width="0.5"/>`;
      const [lx, ly] = point(i, R + 20);
      svg += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--muted)" font-family="JetBrains Mono,monospace">${label}</text>`;
    });

    // Product polygons
    products.forEach((p, pi) => {
      const scores = p.radarScores || [70, 65, 80, 60, 75];
      const pts = scores.map((s, i) => point(i, R * s / 100).join(',')).join(' ');
      svg += `<polygon points="${pts}" fill="${colors[pi]}" fill-opacity="0.15" stroke="${colors[pi]}" stroke-width="2"/>`;
      scores.forEach((s, i) => {
        const [x, y] = point(i, R * s / 100);
        svg += `<circle cx="${x}" cy="${y}" r="4" fill="${colors[pi]}" stroke="var(--dark)" stroke-width="2"/>`;
      });
    });

    svg += '</svg>';

    const legend = products.map((p, i) => `<span><span class="radar-legend-dot" style="background:${colors[i]}"></span>${p.name?.split(' ').slice(0,3).join(' ')}</span>`).join('');

    container.innerHTML = `<div class="radar-wrap"><div class="radar-legend">${legend}</div>${svg}</div>`;
  };
}

// ─────────────────────────────────────────────────────────────
// Bootstrap v3
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initQuickView();
  initAnimatedCounters();
  initNewsletter();
  initSkeletonLoader();
  initCompareRadar();
});
