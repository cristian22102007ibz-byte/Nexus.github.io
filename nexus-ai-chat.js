/* ============================================================
   NEXUS AI CHAT — Asistente de compra con IA (v2)
   Claude-powered · Mejorado con mejor UX y animaciones
   ============================================================ */

function initAIChat() {
  const oldChat = document.getElementById('chatWidget');
  if (oldChat) oldChat.remove();

  // ── Styles ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Button */
    #nexusAIBtn {
      position: fixed; bottom: 24px; right: 24px; z-index: 10001;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none; cursor: pointer; font-size: 22px;
      box-shadow: 0 8px 32px rgba(0,200,255,.4), 0 0 0 0 rgba(0,200,255,.4);
      transition: transform .3s, box-shadow .3s;
      display: flex; align-items: center; justify-content: center;
      animation: aiPulse 3s ease-in-out infinite;
    }
    #nexusAIBtn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(0,200,255,.6); animation: none; }
    #nexusAIBtn.open { transform: scale(0.92); animation: none; }
    @keyframes aiPulse {
      0%,100% { box-shadow: 0 8px 32px rgba(0,200,255,.4), 0 0 0 0 rgba(0,200,255,.3); }
      50%      { box-shadow: 0 8px 32px rgba(0,200,255,.4), 0 0 0 10px rgba(0,200,255,0); }
    }
    #nexusAIBadge {
      position: absolute; top: -4px; right: -4px;
      background: #f59e0b; color: #000; border-radius: 50%;
      width: 18px; height: 18px; font-size: 10px; font-weight: 700;
      display: none; align-items: center; justify-content: center;
      animation: badgePop .4s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes badgePop { from { transform:scale(0); } to { transform:scale(1); } }

    /* Panel */
    #nexusAIPanel {
      position: fixed; bottom: 92px; right: 24px; z-index: 10000;
      width: 390px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 120px);
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 12px; display: flex; flex-direction: column;
      box-shadow: 0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(0,200,255,.08);
      transform: translateY(16px) scale(0.96); opacity: 0;
      pointer-events: none;
      transition: transform .35s cubic-bezier(.22,1,.36,1), opacity .25s;
      overflow: hidden;
    }
    #nexusAIPanel.open {
      transform: translateY(0) scale(1); opacity: 1;
      pointer-events: auto;
    }

    /* Header */
    .ai-header {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
      background: linear-gradient(135deg, rgba(0,200,255,.06), rgba(139,92,246,.04));
      flex-shrink: 0;
    }
    .ai-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(0,200,255,.2), rgba(139,92,246,.2));
      border: 1px solid rgba(0,200,255,.3);
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      position: relative; flex-shrink: 0;
    }
    .ai-online-dot {
      position: absolute; bottom: 1px; right: 1px;
      width: 9px; height: 9px; background: #22c55e; border-radius: 50%;
      border: 2px solid var(--dark);
      animation: onlinePulse 2s ease-in-out infinite;
    }
    @keyframes onlinePulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    .ai-header-info { flex: 1; min-width: 0; }
    .ai-name { font-size: 14px; font-weight: 500; color: var(--white); }
    .ai-status { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    .ai-header-actions { display: flex; gap: 4px; }
    .ai-header-btn {
      background: none; border: none; color: var(--muted); cursor: pointer;
      width: 28px; height: 28px; border-radius: 6px; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: background .15s, color .15s;
    }
    .ai-header-btn:hover { background: rgba(255,255,255,.06); color: var(--white); }

    /* Messages */
    .ai-messages {
      flex: 1; overflow-y: auto; padding: 16px 14px;
      display: flex; flex-direction: column; gap: 12px;
      scroll-behavior: smooth;
    }
    .ai-messages::-webkit-scrollbar { width: 4px; }
    .ai-messages::-webkit-scrollbar-track { background: transparent; }
    .ai-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    .ai-msg { display: flex; gap: 8px; align-items: flex-end; animation: msgIn .25s ease both; }
    .ai-msg.user { flex-direction: row-reverse; }
    @keyframes msgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .ai-msg-av {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
      background: rgba(0,200,255,.1); border: 1px solid rgba(0,200,255,.2);
    }
    .ai-msg.user .ai-msg-av { background: rgba(139,92,246,.15); border-color: rgba(139,92,246,.3); }

    .ai-msg-bubble {
      max-width: 78%; padding: 10px 13px; border-radius: 12px;
      font-size: 13px; line-height: 1.55; color: var(--text);
      background: var(--card); border: 1px solid var(--border);
    }
    .ai-msg.user .ai-msg-bubble {
      background: linear-gradient(135deg, rgba(0,200,255,.15), rgba(139,92,246,.12));
      border-color: rgba(0,200,255,.25); color: var(--white);
    }
    .ai-msg-bubble a { color: var(--accent); }
    .ai-msg-bubble strong { color: var(--white); }

    /* Typing */
    .ai-typing {
      display: none; align-items: center; gap: 4px;
      padding: 0 14px 8px; height: 0; overflow: hidden;
      transition: height .2s;
    }
    .ai-typing.show { display: flex; height: auto; }
    .ai-typing-dot {
      width: 7px; height: 7px; background: var(--accent); border-radius: 50%;
      animation: typingBounce 1.1s ease-in-out infinite;
      opacity: .6;
    }
    .ai-typing-dot:nth-child(2) { animation-delay: .18s; }
    .ai-typing-dot:nth-child(3) { animation-delay: .36s; }
    @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px); opacity:1} }

    /* Product chips */
    .ai-product-card {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 10px; margin-top: 8px;
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 8px; cursor: pointer; text-decoration: none;
      transition: border-color .15s, background .15s;
    }
    .ai-product-card:hover { border-color: var(--accent); background: rgba(0,200,255,.04); }
    .ai-product-icon { font-size: 24px; flex-shrink: 0; }
    .ai-product-info { flex: 1; min-width: 0; }
    .ai-product-name { font-size: 11px; color: var(--white); line-height: 1.3; }
    .ai-product-price { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: var(--accent); }
    .ai-product-add {
      background: var(--accent); color: var(--black); border: none;
      padding: 5px 10px; border-radius: 6px; font-size: 11px;
      font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; cursor: pointer;
      transition: opacity .15s; flex-shrink: 0;
    }
    .ai-product-add:hover { opacity: .85; }

    /* Quick replies */
    .ai-quick-replies {
      padding: 8px 14px; display: flex; gap: 6px; flex-wrap: wrap;
      border-top: 1px solid var(--border); flex-shrink: 0;
    }
    .ai-qr {
      background: var(--card); border: 1px solid var(--border);
      color: var(--text); padding: 5px 11px; border-radius: 20px;
      font-size: 11px; cursor: pointer; font-family: 'JetBrains Mono', monospace;
      letter-spacing: .5px; transition: border-color .15s, color .15s, background .15s;
      white-space: nowrap;
    }
    .ai-qr:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,200,255,.06); }

    /* Input */
    .ai-input-area {
      padding: 12px 14px; border-top: 1px solid var(--border);
      display: flex; gap: 8px; align-items: center; flex-shrink: 0;
      background: rgba(0,0,0,.2);
    }
    #aiInput {
      flex: 1; background: var(--card); border: 1px solid var(--border);
      color: var(--white); padding: 9px 13px; border-radius: 8px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
      transition: border-color .2s;
    }
    #aiInput:focus { border-color: var(--accent); }
    #aiInput::placeholder { color: var(--muted); }
    #aiInput:disabled { opacity: .5; }
    #aiSendBtn {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none; color: var(--black); font-size: 15px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s, opacity .15s;
    }
    #aiSendBtn:hover { transform: scale(1.08); }
    #aiSendBtn:disabled { opacity: .4; transform: none; cursor: not-allowed; }

    @media (max-width: 480px) {
      #nexusAIPanel { bottom: 80px; right: 12px; left: 12px; width: auto; }
    }
  `;
  document.head.appendChild(style);

  // ── DOM ─────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'nexusAIBtn';
  btn.title = 'Asistente NEXUS IA';
  btn.innerHTML = '🤖<span id="nexusAIBadge">1</span>';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'nexusAIPanel';
  panel.innerHTML = `
    <div class="ai-header">
      <div class="ai-avatar">🤖<div class="ai-online-dot"></div></div>
      <div class="ai-header-info">
        <div class="ai-name">NEXUS Assistant</div>
        <div class="ai-status">IA · Powered by Claude</div>
      </div>
      <div class="ai-header-actions">
        <button class="ai-header-btn" id="aiClearBtn" title="Limpiar chat">🗑</button>
        <button class="ai-header-btn" id="aiClose" title="Cerrar">✕</button>
      </div>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-typing" id="aiTyping">
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    </div>
    <div class="ai-quick-replies" id="aiQuickReplies">
      <span class="ai-qr" onclick="aiQS(this)">¿Qué GPU compro?</span>
      <span class="ai-qr" onclick="aiQS(this)">PC gaming 1.500€</span>
      <span class="ai-qr" onclick="aiQS(this)">DDR5 vs DDR4</span>
      <span class="ai-qr" onclick="aiQS(this)">Mejor monitor 2026</span>
      <span class="ai-qr" onclick="aiQS(this)">Setup streaming</span>
    </div>
    <div class="ai-input-area">
      <input id="aiInput" placeholder="Hardware, precios, compatibilidad…" autocomplete="off">
      <button id="aiSendBtn" title="Enviar">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  // ── State ────────────────────────────────────────────────────
  let isOpen = false;
  let history = [];
  let busy = false;

  // ── Greet ────────────────────────────────────────────────────
  const greetings = [
    '¡Hola! Soy el asistente IA de NEXUS 👋 Puedo ayudarte a elegir componentes, comparar productos o configurar tu PC ideal. ¿Por dónde empezamos?',
    '¡Bienvenido a NEXUS! 🖥️ Estoy aquí para ayudarte a encontrar el hardware perfecto. Cuéntame qué necesitas.',
  ];
  addMessage('bot', greetings[Math.floor(Math.random() * greetings.length)]);

  // Show badge after 4s
  setTimeout(() => {
    if (!isOpen) {
      const b = document.getElementById('nexusAIBadge');
      b.style.display = 'flex';
    }
  }, 4000);

  // ── System prompt ────────────────────────────────────────────
  const SYSTEM = `Eres el asistente de compra de NEXUS Tech, una tienda española de hardware de alto rendimiento. Tu nombre es "NEXUS Assistant".

CATÁLOGO (precios en €):
CPUs: Core Ultra 9 285K 589€, Ryzen 9 9950X 649€, i9-14900KS 499€, Ryzen 7 9700X 329€, Core Ultra 7 265K 389€, Ryzen 5 9600X 249€, i7-14700K 349€, Threadripper 7970X 2499€
GPUs: RTX 5090 1999€, RTX 5080 1199€, RTX 4090 1549€, RTX 4070 Ti Super 799€, RTX 4060 Ti 449€, RX 9070 XT 699€, RX 7900 XTX 799€, RX 7600 XT 329€
RAM DDR5: Corsair Dominator 32GB 219€, G.Skill Trident Z5 64GB 349€, Kingston Fury Beast 32GB 149€, Corsair Vengeance 16GB 79€
SSD: Samsung 990 Pro 2TB 159€, WD SN850X 4TB 299€, Crucial T705 2TB 249€, Sabrent Rocket 8TB 799€
Monitores: ROG Swift OLED 27" 240Hz 799€, LG UltraGear 4K 32" 649€, Samsung Odyssey G9 49" 1299€, MSI QD-OLED 4K 899€, Acer Predator X34 549€
Periféricos: G Pro X Superlight 2 159€, DeathAdder V3 99€, MX Master 3S 99€, K100 Air 229€, BlackWidow V4 Pro 199€, G915 TKL 189€, Arctis Nova Pro 249€, Cloud Alpha 149€, Stream Deck 149€, NT-USB+ 189€
Placas AM5: ROG Maximus Z890 699€, MEG Z890 ACE 549€, Z890 Aorus Master 479€, ProArt X870E 449€, MAG X870E Tomahawk 279€, B650E Aorus Pro 219€, B650M Pro RS 149€
Placas LGA1851: mismas placas Z890
Cajas: O11 EVO XL 199€, Torrent RGB 169€, H9 Flow 179€, Corsair 7000D 219€, Silent Base 802 149€, O11 Mini 99€, Morpheus 79€
Fuentes: HX1500i 1500W 329€, Dark Power 1300W 299€, ROG THOR 1000W 249€, Focus GX-850 129€, RM850e 109€, Pure Power 750W 89€, S12III 650W 59€

PÁGINAS: productos.html | gaming.html | ofertas.html | outlet.html | guias.html | comparar.html | carrito.html | financiacion.html

REGLAS:
- Responde en español, tono amigable y directo. Máximo 3 párrafos cortos.
- Recomienda productos concretos del catálogo con su precio.
- Para builds, incluye CPU + GPU + RAM + SSD + Placa Base + estimación total.
- Indica compatibilidad de socket cuando sea relevante (AM5 para Ryzen, LGA1851 para Intel 14ª/Ultra).
- Si preguntan por presupuesto ajustado, prioriza relación calidad/precio.
- Usa emojis con moderación. Habla como parte de NEXUS ("nuestro catálogo", "te enviamos en 24h").
- Si no sabes algo concreto, ofrece redirigir a soporte.html.`;

  // ── Helpers ──────────────────────────────────────────────────
  function addMessage(role, html, products = []) {
    const msgs = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;

    const av = document.createElement('div');
    av.className = 'ai-msg-av';
    av.textContent = role === 'bot' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    if (products.length) {
      products.forEach(p => {
        const card = document.createElement('a');
        card.className = 'ai-product-card';
        card.href = 'producto-' + p.slug + '.html';
        card.innerHTML = `
          <span class="ai-product-icon">${p.icon}</span>
          <div class="ai-product-info">
            <div class="ai-product-name">${p.name}</div>
            <div class="ai-product-price">${p.price}€</div>
          </div>
          <button class="ai-product-add" onclick="event.preventDefault();addToCart('${p.name.replace(/'/g,"\\'")}',${p.price});this.textContent='✓';this.style.background='#22c55e'">+</button>
        `;
        bubble.appendChild(card);
      });
    }

    div.appendChild(av);
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function setTyping(show) {
    document.getElementById('aiTyping').classList.toggle('show', show);
    if (show) document.getElementById('aiMessages').scrollTop = 999999;
  }

  function clearChat() {
    history = [];
    document.getElementById('aiMessages').innerHTML = '';
    document.getElementById('aiQuickReplies').style.display = 'flex';
    addMessage('bot', '¡Chat reiniciado! ¿En qué te puedo ayudar? 🖥️');
  }

  async function sendMessage(text) {
    if (!text.trim() || busy) return;
    document.getElementById('aiQuickReplies').style.display = 'none';
    addMessage('user', text);
    history.push({ role: 'user', content: text });

    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSendBtn');
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    busy = true;
    setTyping(true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 600,
          system: SYSTEM,
          messages: history.slice(-10)  // keep last 10 for context window
        })
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Lo siento, hubo un error. Inténtalo de nuevo.';
      history.push({ role: 'assistant', content: reply });
      setTyping(false);
      addMessage('bot', reply);

    } catch (e) {
      setTyping(false);
      addMessage('bot', 'Parece que hay un problema de conexión 🔧 Mientras tanto, puedes ver nuestro <a href="productos.html">catálogo</a> o escribirnos en <a href="soporte.html">soporte</a>.');
    }

    input.disabled = false;
    sendBtn.disabled = false;
    busy = false;
    input.focus();
  }

  // ── Events ────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    btn.classList.toggle('open', isOpen);
    document.getElementById('nexusAIBadge').style.display = 'none';
    if (isOpen) setTimeout(() => document.getElementById('aiInput').focus(), 300);
    // Hide/show other floating buttons to avoid overlap
    var otherBtns = ['wishlistFloating', 'floatHelp', 'backToTop'];
    otherBtns.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.opacity = isOpen ? '0' : '';
      if (el) el.style.pointerEvents = isOpen ? 'none' : '';
      if (el) el.style.transition = 'opacity .3s';
    });
  });

  document.getElementById('aiClose').addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
    btn.classList.remove('open');
  });

  document.getElementById('aiClearBtn').addEventListener('click', clearChat);

  document.getElementById('aiSendBtn').addEventListener('click', () => {
    sendMessage(document.getElementById('aiInput').value);
  });

  document.getElementById('aiInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e.target.value); }
  });

  // Adjust position dynamically when compareBar / cookieBanner appear
  function adjustForBars() {
    var compareBar = document.getElementById('compareBar');
    var cookieBanner = document.getElementById('cookieBanner');
    var barH = 0;
    if (compareBar && compareBar.classList.contains('show')) {
      barH = Math.max(barH, compareBar.getBoundingClientRect().height || 64);
    }
    if (cookieBanner && getComputedStyle(cookieBanner).display !== 'none') {
      barH = Math.max(barH, cookieBanner.getBoundingClientRect().height || 0);
    }
    var base = barH > 0 ? barH + 16 : 24;
    btn.style.bottom = base + 'px';
    panel.style.bottom = (base + 68) + 'px';
  }

  // Use MutationObserver for instant reaction, fallback to interval
  try {
    var mo = new MutationObserver(adjustForBars);
    mo.observe(document.body, { childList: true, subtree: false, attributes: true, attributeFilter: ['class', 'style'] });
  } catch(e) {}
  setInterval(adjustForBars, 800);
  setTimeout(adjustForBars, 300);

  // Close on click outside
  document.addEventListener('click', e => {
    if (isOpen && !panel.contains(e.target) && e.target !== btn) {
      isOpen = false;
      panel.classList.remove('open');
      btn.classList.remove('open');
    }
  });

  window.aiQS = function(el) {
    document.getElementById('aiInput').value = el.textContent;
    sendMessage(el.textContent);
  };
}

document.addEventListener('DOMContentLoaded', initAIChat);
