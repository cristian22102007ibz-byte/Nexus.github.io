/* ============================================================
   NEXUS AI CHAT — Asistente de compra con IA
   Claude-powered shopping assistant
   ============================================================ */

function initAIChat() {
  // Remove old basic chat widget if present
  const oldChat = document.getElementById('chatWidget');
  if (oldChat) oldChat.remove();

  const style = document.createElement('style');
  style.textContent = `
    #nexusAIBtn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none; cursor: pointer; font-size: 24px;
      box-shadow: 0 8px 32px rgba(0,200,255,0.35);
      transition: transform 0.3s, box-shadow 0.3s;
      display: flex; align-items: center; justify-content: center;
    }
    #nexusAIBtn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(0,200,255,0.5); }
    #nexusAIBtn.open { transform: scale(0.9); }
    #nexusAIBadge {
      position: absolute; top: -4px; right: -4px;
      background: #f59e0b; color: var(--black); border-radius: 50%;
      width: 18px; height: 18px; font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      animation: aiBadgePop 0.4s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes aiBadgePop { from { transform: scale(0); } to { transform: scale(1); } }

    #nexusAIPanel {
      position: fixed; bottom: 92px; right: 24px; z-index: 9997;
      width: 380px; max-width: calc(100vw - 32px);
      height: 540px; max-height: calc(100vh - 120px);
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 8px; display: flex; flex-direction: column;
      box-shadow: 0 24px 64px rgba(0,0,0,0.6);
      transform: translateY(20px) scale(0.95); opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.3s;
    }
    #nexusAIPanel.open {
      transform: translateY(0) scale(1); opacity: 1;
      pointer-events: auto;
    }

    .ai-header {
      padding: 16px 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; gap: 12px;
      background: linear-gradient(135deg, rgba(0,200,255,0.06), rgba(139,92,246,0.06));
      border-radius: 8px 8px 0 0; flex-shrink: 0;
    }
    .ai-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
      box-shadow: 0 0 12px rgba(0,200,255,0.3);
    }
    .ai-header-info { flex: 1; }
    .ai-name { font-size: 14px; color: var(--white); font-weight: 500; }
    .ai-status { font-size: 11px; color: var(--accent); font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; gap: 5px; }
    .ai-status-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: aiPulse 2s ease-in-out infinite; }
    @keyframes aiPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
    .ai-close { background: none; border: 1px solid var(--border); color: var(--muted); width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
    .ai-close:hover { border-color: #f87171; color: #f87171; }

    .ai-messages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex;
      flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: var(--border) transparent;
    }
    .ai-messages::-webkit-scrollbar { width: 4px; }
    .ai-messages::-webkit-scrollbar-track { background: transparent; }
    .ai-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    .ai-msg { display: flex; gap: 8px; align-items: flex-end; max-width: 100%; }
    .ai-msg.user { flex-direction: row-reverse; }
    .ai-msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; }
    .ai-msg.bot .ai-msg-avatar { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
    .ai-msg.user .ai-msg-avatar { background: var(--card); border: 1px solid var(--border); }
    .ai-msg-bubble {
      max-width: 82%; padding: 10px 14px; border-radius: 12px;
      font-size: 13px; line-height: 1.6; color: var(--text);
    }
    .ai-msg.bot .ai-msg-bubble {
      background: var(--card); border: 1px solid var(--border);
      border-bottom-left-radius: 4px;
    }
    .ai-msg.user .ai-msg-bubble {
      background: rgba(0,200,255,0.12); border: 1px solid rgba(0,200,255,0.2);
      color: var(--white); border-bottom-right-radius: 4px;
    }
    .ai-msg-bubble a { color: var(--accent); text-decoration: underline; }
    .ai-msg-bubble strong { color: var(--white); }

    .ai-typing {
      display: none; align-items: center; gap: 4px; padding: 10px 14px;
      background: var(--card); border: 1px solid var(--border);
      border-radius: 12px; border-bottom-left-radius: 4px;
      width: fit-content;
    }
    .ai-typing.show { display: flex; }
    .ai-typing-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: typingBounce 1.2s ease-in-out infinite; }
    .ai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

    .ai-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 8px; flex-shrink: 0; }
    .ai-qr {
      background: var(--card); border: 1px solid var(--border);
      color: var(--muted); padding: 5px 12px; border-radius: 16px;
      font-size: 11px; cursor: pointer; transition: all 0.2s;
      font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .ai-qr:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,200,255,0.06); }

    .ai-input-area {
      padding: 12px 16px; border-top: 1px solid var(--border);
      display: flex; gap: 8px; flex-shrink: 0;
      background: var(--dark); border-radius: 0 0 8px 8px;
    }
    #aiInput {
      flex: 1; background: var(--card); border: 1px solid var(--border);
      color: var(--text); padding: 10px 14px; border-radius: 20px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none;
      transition: border-color 0.2s; resize: none;
    }
    #aiInput:focus { border-color: var(--accent); }
    #aiInput::placeholder { color: var(--muted); }
    #aiSendBtn {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none; cursor: pointer; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, opacity 0.2s; flex-shrink: 0;
    }
    #aiSendBtn:hover { transform: scale(1.08); }
    #aiSendBtn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    /* Product card inside chat */
    .ai-product-card {
      background: var(--dark); border: 1px solid var(--border);
      border-radius: 8px; padding: 12px; margin-top: 8px;
      display: flex; gap: 10px; align-items: center;
      cursor: pointer; transition: border-color 0.2s;
    }
    .ai-product-card:hover { border-color: var(--accent); }
    .ai-product-icon { font-size: 28px; flex-shrink: 0; }
    .ai-product-info { flex: 1; min-width: 0; }
    .ai-product-name { font-size: 12px; color: var(--white); line-height: 1.3; }
    .ai-product-price { font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--accent); }
    .ai-product-add {
      background: var(--accent); color: var(--black); border: none;
      padding: 4px 10px; border-radius: 4px; font-size: 10px;
      font-family: 'Bebas Neue', sans-serif; letter-spacing: 1px; cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Build button
  const btn = document.createElement('button');
  btn.id = 'nexusAIBtn';
  btn.innerHTML = '🤖<span id="nexusAIBadge" style="display:none">1</span>';
  btn.title = 'Asistente NEXUS IA';
  document.body.appendChild(btn);

  // Build panel
  const panel = document.createElement('div');
  panel.id = 'nexusAIPanel';
  panel.innerHTML = `
    <div class="ai-header">
      <div class="ai-avatar">🤖</div>
      <div class="ai-header-info">
        <div class="ai-name">NEXUS Assistant</div>
        <div class="ai-status"><span class="ai-status-dot"></span> En línea — Powered by Claude</div>
      </div>
      <button class="ai-close" id="aiClose">×</button>
    </div>
    <div class="ai-messages" id="aiMessages">
      <div class="ai-msg bot">
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble">¡Hola! Soy el asistente IA de NEXUS. Puedo ayudarte a encontrar el hardware perfecto para tu setup, comparar productos, resolver dudas técnicas o configurar tu PC ideal. ¿En qué te ayudo? 🖥️</div>
      </div>
    </div>
    <div class="ai-typing" id="aiTyping">
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    </div>
    <div class="ai-quick-replies" id="aiQuickReplies">
      <span class="ai-qr" onclick="aiQuickSend(this)">¿Qué GPU compro?</span>
      <span class="ai-qr" onclick="aiQuickSend(this)">PC gaming 1.500€</span>
      <span class="ai-qr" onclick="aiQuickSend(this)">Diferencia DDR5 vs DDR4</span>
      <span class="ai-qr" onclick="aiQuickSend(this)">Mejor monitor 2026</span>
    </div>
    <div class="ai-input-area">
      <input id="aiInput" placeholder="Pregunta sobre hardware, precios, compatibilidad..." />
      <button id="aiSendBtn">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  // State
  let isOpen = false;
  let conversationHistory = [];
  let isLoading = false;

  const SYSTEM_PROMPT = `Eres el asistente de compra de NEXUS Tech, una tienda online española de hardware de alto rendimiento. Tu nombre es "NEXUS Assistant".

CATÁLOGO DISPONIBLE (precios en euros):
- CPUs: Core Ultra 9 285K (589€), Ryzen 9 9950X (649€), i9-14900KS (499€), Ryzen 7 9700X (329€), Core Ultra 7 265K (389€), Ryzen 5 9600X (249€), i7-14700K (349€), Threadripper 7970X (2499€)
- GPUs: RTX 5090 32GB (1999€), RTX 5080 16GB (1199€), RTX 4090 (1549€), RTX 4070 Ti Super (799€), RTX 4060 Ti (449€), RX 9070 XT (699€), RX 7900 XTX (799€), RX 7600 XT (329€)
- RAM DDR5: Dominator Titanium 32GB (219€), Trident Z5 64GB (349€), Fury Beast 32GB (149€), Vengeance 16GB (79€)
- SSDs: Samsung 990 Pro 2TB (159€), WD SN850X 4TB (299€), Crucial T705 2TB Gen5 (249€), Sabrent Rocket 5 Plus 8TB (799€)
- Monitores: ROG Swift OLED 27" 240Hz (799€), UltraGear 4K 32" 144Hz (649€), Odyssey G9 49" (1299€), MSI MPG QD-OLED 4K (899€)
- Periféricos: G Pro X Superlight 2 (159€), DeathAdder V3 (99€), K100 Air (229€), BlackWidow V4 Pro (199€), Arctis Nova Pro Wireless (249€)
- Placas Base AM5: ROG Maximus Z890 (699€), MEG Z890 ACE (549€), MAG X870E Tomahawk (279€), B650M Pro RS (149€)
- Placas Base Intel Z890: Z890 Aorus Master (479€), ProArt X870E (449€)
- Cajas: O11 EVO XL (199€), Torrent RGB (169€), H9 Flow (179€), Corsair 7000D (219€)
- Fuentes: HX1500i 1500W (329€), Dark Power 1300W (299€), ROG THOR 1000W (249€), Focus GX-850W (129€)

PÁGINAS DE LA TIENDA:
- Catálogo: productos.html | Gaming + configurador: gaming.html | Ofertas: ofertas.html
- Outlet/reacondicionados: outlet.html | Guías de compra: guias.html | Garantía: garantia.html
- Comparador: comparar.html | Carrito: carrito.html | Financiación: financiacion.html

INSTRUCCIONES:
- Responde siempre en español, de forma amigable y concisa (máx 3 párrafos)
- Recomienda productos concretos del catálogo con sus precios
- Para builds completos, desglosa CPU+GPU+RAM+SSD+Placa Base
- Menciona compatibilidad de sockets cuando sea relevante (AM5, LGA1851, LGA1700)
- Si el usuario tiene presupuesto limitado, prioriza relación calidad-precio
- Usa emojis moderadamente para hacer la conversación más amena
- Cuando recomiendes un producto, incluye el precio entre paréntesis
- Habla de "nuestra tienda" y "nuestro catálogo" como si fueras parte de NEXUS`;

  // Toggle
  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    btn.classList.toggle('open', isOpen);
    document.getElementById('nexusAIBadge').style.display = 'none';
    if (isOpen) document.getElementById('aiInput').focus();
  });
  document.getElementById('aiClose').addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
    btn.classList.remove('open');
  });

  // Show badge after 3s if not opened
  setTimeout(() => {
    if (!isOpen) {
      const badge = document.getElementById('nexusAIBadge');
      badge.style.display = 'flex';
      badge.textContent = '1';
    }
  }, 3000);

  function addMessage(role, content, products = []) {
    const msgs = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = role === 'bot' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble';
    bubble.innerHTML = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

    // Inject product cards if present
    if (products.length) {
      products.forEach(p => {
        const card = document.createElement('a');
        var _b=location.pathname.includes('/pages/')?'../products/':'products/';card.href=_b+'producto-'+p.slug+'.html';
        card.className = 'ai-product-card';
        card.innerHTML = `
          <span class="ai-product-icon">${p.icon}</span>
          <div class="ai-product-info">
            <div class="ai-product-name">${p.name}</div>
            <div class="ai-product-price">${p.price}€</div>
          </div>
          <button class="ai-product-add" onclick="event.preventDefault();addToCart('${p.name}',${p.price});this.textContent='✓'">+</button>
        `;
        bubble.appendChild(card);
      });
    }

    div.appendChild(avatar);
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function setTyping(show) {
    const t = document.getElementById('aiTyping');
    const typing = document.createElement('div');
    t.className = `ai-typing ${show ? 'show' : ''}`;
    // Move typing indicator after messages
    const msgs = document.getElementById('aiMessages');
    msgs.after(t);
    if (show) msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;

    // Hide quick replies after first send
    document.getElementById('aiQuickReplies').style.display = 'none';

    addMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });

    const input = document.getElementById('aiInput');
    const sendBtn = document.getElementById('aiSendBtn');
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;
    isLoading = true;
    setTyping(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20260514',
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Lo siento, hubo un error. Inténtalo de nuevo.';

      conversationHistory.push({ role: 'assistant', content: reply });
      setTyping(false);
      addMessage('bot', reply);

    } catch (err) {
      setTyping(false);
      addMessage('bot', 'Parece que hay un problema de conexión. Mientras tanto, puedes explorar nuestro <a href="catalogo.html">catálogo</a> o contactar con <a href="soporte.html">soporte</a>. 🔧');
    }

    input.disabled = false;
    sendBtn.disabled = false;
    isLoading = false;
    input.focus();
  }

  document.getElementById('aiSendBtn').addEventListener('click', () => {
    sendMessage(document.getElementById('aiInput').value);
  });
  document.getElementById('aiInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e.target.value); }
  });

  window.aiQuickSend = function(el) {
    document.getElementById('aiInput').value = el.textContent;
    sendMessage(el.textContent);
  };
}

document.addEventListener('DOMContentLoaded', initAIChat);
