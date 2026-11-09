const cart = JSON.parse(localStorage.getItem('game-cart') || '[]');
const account = JSON.parse(localStorage.getItem('game-account') || 'null');

lucide.createIcons();

function euro(value) {
  return `${value.toFixed(2).replace('.', ',')}€`;
}

function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach((item) => { item.textContent = cart.length; });
  localStorage.setItem('game-cart', JSON.stringify(cart));
}

function renderDrawer() {
  const items = document.querySelector('.drawer-items');
  const total = document.querySelector('.drawer-total');
  if (!items || !total) return;
  items.innerHTML = cart.length ? cart.map((item, index) => `
    <div class="drawer-item">
      <div><b>${item.name}</b><small>Producto gaming</small></div>
      <strong>${euro(item.price)}</strong>
      <button class="drawer-remove" data-index="${index}" aria-label="Eliminar producto">×</button>
    </div>`).join('') : '<div class="drawer-empty"><i data-lucide="shopping-cart"></i><h3>Tu carrito está vacío</h3><p>Añade juegos y accesorios para verlos aquí.</p><a class="pink-button" href="tienda.html">Ir a la tienda</a></div>';
  total.textContent = euro(cart.reduce((sum, item) => sum + item.price, 0));
  items.querySelectorAll('.drawer-remove').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      updateCartCount();
      renderDrawer();
      lucide.createIcons();
    });
  });
  lucide.createIcons();
}

function openDrawer() {
  document.querySelector('.cart-drawer').classList.add('open');
  document.querySelector('.drawer-backdrop').classList.add('open');
}

function closeDrawer() {
  document.querySelector('.cart-drawer').classList.remove('open');
  document.querySelector('.drawer-backdrop').classList.remove('open');
}

function updateAccountUI() {
  const login = document.querySelector('.login');
  if (!login) return;
  if (account) {
    login.innerHTML = `<i data-lucide="user-round"></i><span>${account.name}</span>`;
    login.classList.add('logged');
    login.title = 'Cerrar sesión';
  } else {
    login.innerHTML = '<i data-lucide="user-round"></i><span>Iniciar sesión</span>';
    login.classList.remove('logged');
    login.title = 'Iniciar sesión';
  }
  lucide.createIcons();
}

function openLogin() {
  document.querySelector('.login-modal').classList.add('open');
  document.querySelector('.drawer-backdrop').classList.add('open');
}

function closeLogin() {
  document.querySelector('.login-modal').classList.remove('open');
  if (!document.querySelector('.cart-drawer').classList.contains('open')) document.querySelector('.drawer-backdrop').classList.remove('open');
}

document.body.insertAdjacentHTML('beforeend', `
  <div class="drawer-backdrop"></div>
  <aside class="cart-drawer" aria-label="Carrito de compra">
    <div class="drawer-header"><div><p class="eyebrow">TU COMPRA</p><h2>Mi carrito <span class="cart-count">0</span></h2></div><button class="drawer-close" aria-label="Cerrar carrito">×</button></div>
    <div class="drawer-items"></div>
    <div class="drawer-footer"><div><span>Total</span><strong class="drawer-total">0,00€</strong></div><a class="pink-button" href="carrito.html">Ver carrito y comprar <i data-lucide="arrow-right"></i></a></div>
  </aside>
  <section class="login-modal" aria-label="Inicio de sesión">
    <button class="login-close" aria-label="Cerrar">×</button>
    <div class="login-form"><p class="eyebrow">ÁREA DE CLIENTE</p><h2>Iniciar sesión</h2><p>Accede a tus pedidos, puntos y ventajas de Club GAME.</p><form><label for="login-name">Nombre</label><input id="login-name" required placeholder="Tu nombre"><label for="login-password">Contraseña</label><input id="login-password" type="password" required placeholder="Tu contraseña"><button class="pink-button" type="submit">Entrar en mi cuenta <i data-lucide="arrow-right"></i></button><small class="login-message"></small></form></div>
  </section>`);

document.querySelectorAll('.cart-button').forEach((button) => button.addEventListener('click', openDrawer));
document.querySelector('.drawer-close').addEventListener('click', closeDrawer);
document.querySelector('.drawer-backdrop').addEventListener('click', () => { closeDrawer(); closeLogin(); });
document.querySelector('.login-close').addEventListener('click', closeLogin);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); closeLogin(); } });

document.querySelectorAll('.add-product').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    cart.push({ name: card.dataset.name, price: Number(card.dataset.price) });
    updateCartCount();
    renderDrawer();
    openDrawer();
    button.textContent = '✓ Añadido al carrito';
    button.classList.add('added');
    setTimeout(() => { button.textContent = 'Añadir al carrito'; button.classList.remove('added'); }, 1500);
  });
});

document.querySelector('.login').addEventListener('click', (event) => {
  event.preventDefault();
  if (account) {
    localStorage.removeItem('game-account');
    window.location.reload();
  } else openLogin();
});

document.querySelector('.login-form form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#login-name').value.trim();
  localStorage.setItem('game-account', JSON.stringify({ name }));
  document.querySelector('.login-message').textContent = `¡Bienvenido, ${name}!`;
  setTimeout(() => window.location.reload(), 700);
});

document.querySelectorAll('.filter-button').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('selected'));
    filter.classList.add('selected');
    document.querySelectorAll('.product-card').forEach((product) => {
      product.hidden = filter.dataset.category !== 'all' && product.dataset.category !== filter.dataset.category;
    });
  });
});

const menuButton = document.querySelector('.menu-button');
if (menuButton) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    document.querySelector('.mobile-links').classList.toggle('open', !expanded);
  });
}

updateCartCount();
renderDrawer();
updateAccountUI();
