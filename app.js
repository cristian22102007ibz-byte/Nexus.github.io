// Shared cart and toast logic
let cart = JSON.parse(localStorage.getItem('nexusCart') || '[]');

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  renderNavAuth();
});

function addToCart(name, price) {
  cart.push({ name, price, qty: 1 });
  localStorage.setItem('nexusCart', JSON.stringify(cart));
  updateCartCount();
  showToast('✓ ' + name + ' añadido al carrito');
}

function updateCartCount() {
  const els = document.querySelectorAll('#cartCount');
  els.forEach(el => el.textContent = cart.length);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function renderNavAuth() {
  const nav = document.getElementById('navActions');
  if (!nav) return;
  const user = JSON.parse(localStorage.getItem('nexusUser') || 'null');
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Remove existing slot if any
  const existing = document.getElementById('navAuthSlot');
  if (existing) existing.remove();

  const slot = document.createElement('div');
  slot.id = 'navAuthSlot';
  slot.style.cssText = 'display:flex;gap:8px;align-items:center';
  const cartBtn = nav.querySelector('.cart-btn');
  nav.insertBefore(slot, cartBtn);

  if (user && user.loggedIn) {
    // Logged in state — shown on all pages
    slot.innerHTML = `
      <span style="font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;white-space:nowrap">
        <a href="perfil.html" style="color:var(--accent);transition:opacity 0.2s" onmouseover="this.style.opacity='0.75'" onmouseout="this.style.opacity='1'">👤 ${user.name.split(' ')[0].toUpperCase()}</a>
      </span>
      <button onclick="logoutUser()"
        style="background:none;border:1px solid var(--border);color:var(--muted);padding:7px 14px;
               font-size:11px;cursor:pointer;border-radius:4px;letter-spacing:1px;text-transform:uppercase;
               font-family:'DM Sans',sans-serif;transition:all 0.2s;white-space:nowrap"
        onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'"
        onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">
        Salir
      </button>`;
  } else {
    // Not logged in — hide buttons if we're already on that auth page
    const showLogin    = page !== 'login.html';
    const showRegister = page !== 'registro.html';

    slot.innerHTML = `
      ${showLogin ? `
        <a href="login.html"
          style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);
                 font-family:'DM Sans',sans-serif;transition:color 0.2s;white-space:nowrap;padding:7px 2px"
          onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--muted)'">
          Entrar
        </a>` : ''}
      ${showRegister ? `
        <a href="registro.html"
          style="background:var(--accent);color:var(--black);padding:7px 16px;font-size:11px;font-weight:500;
                 letter-spacing:1px;text-transform:uppercase;border-radius:4px;font-family:'DM Sans',sans-serif;
                 transition:opacity 0.2s;box-shadow:0 0 12px rgba(0,180,255,0.3);white-space:nowrap"
          onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
          Registro
        </a>` : ''}`;
  }
}

function logoutUser() {
  localStorage.removeItem('nexusUser');
  renderNavAuth();
  showToast('✓ Sesión cerrada correctamente');
}
