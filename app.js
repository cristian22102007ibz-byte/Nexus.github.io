// ═══════════════════════════════════════════════════════════════
//  NEXUS — app.js  (auth · cart · toast · nav)
// ═══════════════════════════════════════════════════════════════

// ── Cart ─────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');

function addToCart(name, price) {
  cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');
  var countBefore = cart.filter(function(i){ return i.name === name; }).length;
  cart.push({ name: name, price: Number(price) });
  localStorage.setItem('nexusCart', JSON.stringify(cart));
  updateCartCount();
  var shortName = name.split(' ').slice(0,3).join(' ');
  var msg = shortName + ' añadido';
  if (countBefore >= 1) msg += ' (' + (countBefore+1) + ' uds. en carrito)';
  showToast(msg);
}

function updateCartCount() {
  cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');
  document.querySelectorAll('#cartCount').forEach(function(el) {
    el.textContent = cart.length;
  });
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg, type) {
  // type: 'success' | 'error' | 'info' | 'warn' — default success
  var t = document.getElementById('toast');
  if (!t) return;
  // Clear classes
  t.className = 'toast';
  // Style by type
  var colors = {
    success: 'var(--accent)',
    error:   '#ef4444',
    info:    '#818cf8',
    warn:    '#f59e0b',
  };
  var icons = { success:'✓', error:'✕', info:'ℹ', warn:'⚠' };
  var tp = type || (msg.startsWith('✓') ? 'success' : msg.startsWith('✕') ? 'error' : 'success');
  var ic = icons[tp] || '✓';
  var bg = colors[tp] || colors.success;
  t.style.background = bg;
  t.style.color = tp === 'info' || tp === 'warn' ? '#0f1c2e' : '#0f1c2e';
  t.innerHTML = '<span style="font-weight:700;margin-right:6px">' + ic + '</span>' + msg.replace(/^[✓✕⚠ℹ📍📄📦↩🎉🔧🚀⭐]\s?/, '');
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

// ── Auth helpers ──────────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem('nexusUser') || 'null'); }
  catch(e) { return null; }
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('nexusUsers') || '[]'); }
  catch(e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem('nexusUsers', JSON.stringify(users));
}

// Register a new user — returns {ok, error}
function registerUser(nombre, apellido, email, password) {
  var users = getUsers();
  var exists = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
  if (exists) return { ok: false, error: 'Este email ya está registrado.' };
  var user = {
    email: email,
    password: password,
    name: nombre + ' ' + apellido,
    loggedIn: true,
    points: 500,
    joinDate: new Date().toLocaleDateString('es-ES'),
    orders: []
  };
  users.push(user);
  saveUsers(users);
  // Set as active session (without password)
  var session = { email: user.email, name: user.name, loggedIn: true, points: user.points, joinDate: user.joinDate };
  localStorage.setItem('nexusUser', JSON.stringify(session));
  return { ok: true, user: session };
}

// Login — returns {ok, error, user}
function loginUser(email, password) {
  var users = getUsers();
  // Also support legacy demo account
  if (email === 'demo@nexus.com' && password === 'nexus123') {
    var session = { email: email, name: 'Demo User', loggedIn: true, points: 500, joinDate: '01/01/2024' };
    localStorage.setItem('nexusUser', JSON.stringify(session));
    return { ok: true, user: session };
  }
  var user = users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
  if (!user) return { ok: false, error: 'No existe ninguna cuenta con este email.' };
  if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta.' };
  var session = { email: user.email, name: user.name, loggedIn: true, points: user.points || 500, joinDate: user.joinDate };
  localStorage.setItem('nexusUser', JSON.stringify(session));
  return { ok: true, user: session };
}

function logoutUser() {
  localStorage.removeItem('nexusUser');
  renderNavAuth();
  showToast('✓ Sesión cerrada correctamente');
}

// ── Nav auth ──────────────────────────────────────────────────────
function renderNavAuth() {
  var nav = document.getElementById('navActions');
  if (!nav) return;
  var user = getUser();
  var page = window.location.pathname.split('/').pop() || 'index.html';

  var existing = document.getElementById('navAuthSlot');
  if (existing) existing.remove();

  var slot = document.createElement('div');
  slot.id = 'navAuthSlot';
  slot.style.cssText = 'display:flex;gap:8px;align-items:center';
  var cartBtn = nav.querySelector('.cart-btn');
  nav.insertBefore(slot, cartBtn);

  if (user && user.loggedIn) {
    slot.innerHTML =
      '<a href="perfil.html" style="font-size:11px;color:var(--accent);font-family:\'JetBrains Mono\',monospace;letter-spacing:1px;white-space:nowrap;transition:opacity .2s" onmouseover="this.style.opacity=\'.7\'" onmouseout="this.style.opacity=\'1\'">👤 ' + user.name.split(' ')[0].toUpperCase() + '</a>' +
      '<button onclick="logoutUser()" style="background:none;border:1px solid var(--border);color:var(--muted);padding:7px 14px;font-size:11px;cursor:pointer;border-radius:4px;letter-spacing:1px;text-transform:uppercase;font-family:\'DM Sans\',sans-serif;transition:all .2s;white-space:nowrap" onmouseover="this.style.borderColor=\'var(--accent)\';this.style.color=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--muted)\'">Salir</button>';
  } else {
    var showLogin    = page !== 'login.html';
    var showRegister = page !== 'registro.html';
    slot.innerHTML =
      (showLogin ? '<a href="login.html" style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-family:\'DM Sans\',sans-serif;transition:color .2s;white-space:nowrap;padding:7px 2px" onmouseover="this.style.color=\'var(--white)\'" onmouseout="this.style.color=\'var(--muted)\'">Entrar</a>' : '') +
      (showRegister ? '<a href="registro.html" style="background:var(--accent);color:var(--black);padding:7px 16px;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;border-radius:4px;font-family:\'DM Sans\',sans-serif;transition:opacity .2s;white-space:nowrap" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'">Registro</a>' : '');
  }
}

// ── Orders ────────────────────────────────────────────────────────
function saveOrder(orderData) {
  var orders = JSON.parse(localStorage.getItem('nexusOrders') || '[]');
  orders.unshift(orderData);  // newest first
  localStorage.setItem('nexusOrders', JSON.stringify(orders));
  // Update order count in user session
  var user = getUser();
  if (user) {
    user.orderCount = orders.length;
    localStorage.setItem('nexusUser', JSON.stringify(user));
  }
}

function getOrders() {
  return JSON.parse(localStorage.getItem('nexusOrders') || '[]');
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  renderNavAuth();
});

// ── Scroll reveal ─────────────────────────────────────────────────
(function() {
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el) { io.observe(el); });
  }
  document.addEventListener('DOMContentLoaded', initReveal);
})();

// ── Cart count bump animation ────────────────────────────────────
var _origAddToCart = addToCart;
addToCart = function(name, price) {
  _origAddToCart(name, price);
  document.querySelectorAll('#cartCount').forEach(function(el) {
    el.classList.remove('bump');
    void el.offsetWidth; // reflow
    el.classList.add('bump');
    setTimeout(function() { el.classList.remove('bump'); }, 400);
  });
};

// ── Page fade-in ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('page-transition');
});

// ── Shipping progress bar ────────────────────────────────────────
(function() {
  var FREE_THRESHOLD = 99;
  function updateShippingBar() {
    var bar = document.getElementById('shippingProgressBar');
    if (!bar) return;
    var items = JSON.parse(localStorage.getItem('nexusCart') || '[]');
    var total = items.reduce(function(s, i) { return s + (Number(i.price) || 0); }, 0);
    var pct = Math.min(100, Math.round(total / FREE_THRESHOLD * 100));
    var remaining = Math.max(0, FREE_THRESHOLD - total);
    var fill = bar.querySelector('.spb-fill');
    var label = bar.querySelector('.spb-label');
    var msg = bar.querySelector('.spb-msg');
    if (fill) fill.style.width = pct + '%';
    if (total >= FREE_THRESHOLD) {
      if (msg) msg.textContent = '🎉 ¡Envío gratis desbloqueado!';
      if (label) label.style.color = '#22c55e';
      bar.style.borderColor = 'rgba(34,197,94,.2)';
    } else {
      if (msg) msg.textContent = 'Te faltan ' + remaining.toFixed(0) + '€ para envío gratis';
      if (label) label.style.color = '';
      bar.style.borderColor = '';
    }
  }
  document.addEventListener('DOMContentLoaded', updateShippingBar);
  // Also update when cart changes
  var _prev = addToCart;
  addToCart = function(n, p) { _prev(n, p); updateShippingBar(); };
})();

// ── Mini cart dropdown ────────────────────────────────────────────
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var cartBtn = document.querySelector('.cart-btn');
    if (!cartBtn) return;

    // Inject mini cart styles
    var s = document.createElement('style');
    s.textContent = [
      '.mini-cart-wrap{position:relative;display:inline-flex}',
      '.mini-cart{position:absolute;top:calc(100% + 12px);right:0;width:320px;background:var(--dark);border:1px solid var(--border);border-radius:8px;box-shadow:0 16px 48px rgba(0,0,0,.6);z-index:9000;opacity:0;pointer-events:none;transform:translateY(8px);transition:opacity .2s,transform .2s;overflow:hidden}',
      '.mini-cart.show{opacity:1;pointer-events:auto;transform:translateY(0)}',
      '.mini-cart-header{padding:12px 16px;border-bottom:1px solid var(--border);font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase}',
      '.mini-cart-items{max-height:240px;overflow-y:auto;padding:8px 0}',
      '.mini-cart-item{display:flex;align-items:center;gap:10px;padding:8px 16px;transition:background .15s}',
      '.mini-cart-item:hover{background:rgba(255,255,255,.03)}',
      '.mini-cart-icon{font-size:22px;width:32px;text-align:center;flex-shrink:0}',
      '.mini-cart-name{flex:1;font-size:12px;color:var(--text);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.mini-cart-price{font-family:\'Bebas Neue\',sans-serif;font-size:16px;color:var(--accent);flex-shrink:0}',
      '.mini-cart-footer{padding:12px 16px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px}',
      '.mini-cart-total{font-family:\'Bebas Neue\',sans-serif;font-size:20px;color:var(--white)}',
      '.mini-cart-empty{padding:32px 16px;text-align:center;font-size:13px;color:var(--muted)}',
    ].join('');
    document.head.appendChild(s);

    // Wrap cart button
    var wrap = document.createElement('div');
    wrap.className = 'mini-cart-wrap';
    cartBtn.parentNode.insertBefore(wrap, cartBtn);
    wrap.appendChild(cartBtn);

    var mc = document.createElement('div');
    mc.className = 'mini-cart';
    mc.id = 'miniCart';
    wrap.appendChild(mc);

    function getIcon(n) {
      if (!n) return '🔧'; var l = n.toLowerCase();
      if (l.includes('rtx')||l.includes('radeon')) return '🎮';
      if (l.includes('ryzen')||l.includes('core')) return '⚡';
      if (l.includes('ddr')||l.includes('ram')) return '🧠';
      if (l.includes('ssd')||l.includes('nvme')) return '💾';
      if (l.includes('monitor')||l.includes('oled')) return '🖥️';
      return '🔧';
    }

    function renderMiniCart() {
      var items = JSON.parse(localStorage.getItem('nexusCart') || '[]');
      var grouped = {};
      items.forEach(function(it) {
        if (!grouped[it.name]) grouped[it.name] = { name:it.name, price:it.price, qty:0 };
        grouped[it.name].qty++;
      });
      var list = Object.values(grouped);
      var total = list.reduce(function(s,g){ return s+g.price*g.qty; }, 0);
      if (!list.length) {
        mc.innerHTML = '<div class="mini-cart-header">Mi carrito</div><div class="mini-cart-empty">🛒<br>Tu carrito está vacío</div>';
        return;
      }
      mc.innerHTML = '<div class="mini-cart-header">Mi carrito · ' + items.length + ' artículo' + (items.length!==1?'s':'') + '</div>' +
        '<div class="mini-cart-items">' +
        list.map(function(g) {
          return '<div class="mini-cart-item"><span class="mini-cart-icon">' + getIcon(g.name) + '</span>' +
            '<span class="mini-cart-name">' + (g.qty > 1 ? g.qty+'× ' : '') + g.name + '</span>' +
            '<span class="mini-cart-price">' + (g.price * g.qty) + '€</span></div>';
        }).join('') +
        '</div>' +
        '<div class="mini-cart-footer"><span class="mini-cart-total">Total: ' + total.toLocaleString('es-ES') + '€</span>' +
        '<a href="carrito.html" style="background:var(--accent);color:var(--black);border:none;padding:8px 16px;border-radius:4px;font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:1px;cursor:pointer;text-decoration:none;white-space:nowrap">Ver carrito →</a></div>';
    }

    var hoverTimer;
    wrap.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimer);
      renderMiniCart();
      mc.classList.add('show');
    });
    wrap.addEventListener('mouseleave', function() {
      hoverTimer = setTimeout(function() { mc.classList.remove('show'); }, 250);
    });
    mc.addEventListener('mouseenter', function() { clearTimeout(hoverTimer); });
    mc.addEventListener('mouseleave', function() {
      hoverTimer = setTimeout(function() { mc.classList.remove('show'); }, 250);
    });
  });
})();



// ── Recently Viewed (global) ──────────────────────────────────────
function addToRecentlyViewed(slug, name, price, icon) {
  var rv = JSON.parse(localStorage.getItem('nexusRecentlyViewed') || '[]');
  rv = rv.filter(function(p){ return p.slug !== slug; });
  rv.unshift({ slug: slug, name: name, price: price, icon: icon });
  rv = rv.slice(0, 12);
  localStorage.setItem('nexusRecentlyViewed', JSON.stringify(rv));
}


// ── Keyboard shortcuts ───────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  // "/" opens search (unless already in an input)
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    var searchInput = document.getElementById('searchInput') || document.getElementById('bigSearch');
    if (searchInput) { searchInput.focus(); searchInput.select(); }
  }
  // Escape closes dropdowns / modals
  if (e.key === 'Escape') {
    var dd = document.getElementById('searchDropdown');
    if (dd) dd.style.display = 'none';
    var suggest = document.getElementById('suggestBox');
    if (suggest) suggest.style.display = 'none';
    var modal = document.getElementById('selectorModal');
    if (modal && modal.style.display !== 'none') modal.style.display = 'none';
    var aiPanel = document.getElementById('nexusAIPanel');
    if (aiPanel && aiPanel.classList.contains('open')) {
      aiPanel.classList.remove('open');
      var aiBtn = document.getElementById('nexusAIBtn');
      if (aiBtn) aiBtn.classList.remove('open');
    }
  }
});
