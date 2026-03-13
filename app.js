// ═══════════════════════════════════════════════════════════════
//  NEXUS — app.js  (auth · cart · toast · nav)
// ═══════════════════════════════════════════════════════════════

// ── Cart ─────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');

function addToCart(name, price) {
  cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');
  cart.push({ name: name, price: Number(price) });
  localStorage.setItem('nexusCart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ ' + name.split(' ').slice(0,3).join(' ') + ' añadido al carrito');
}

function updateCartCount() {
  cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');
  document.querySelectorAll('#cartCount').forEach(function(el) {
    el.textContent = cart.length;
  });
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
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
