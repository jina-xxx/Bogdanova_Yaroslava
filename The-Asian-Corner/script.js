// Навигация
const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');

function showSection(id) {
  sections.forEach(s => s.id === id ? s.classList.add('active') : s.classList.remove('active'));
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === id));
  clearMessages();
}
navButtons.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

// Очистка сообщений
function clearMessages() {
  document.querySelectorAll('.message').forEach(m => m.textContent = '');
}

// Переключение Вход/Регистрация
const toggleLoginBtn = document.getElementById('toggle-login');
const toggleRegisterBtn = document.getElementById('toggle-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');

toggleLoginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  toggleLoginBtn.classList.add('primary');
  toggleRegisterBtn.classList.remove('primary');
  authMessage.textContent = '';
});
toggleRegisterBtn.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  toggleLoginBtn.classList.remove('primary');
  toggleRegisterBtn.classList.add('primary');
  authMessage.textContent = '';
});

// Пользователь (имитация)
let user = null;

// Регистрация
registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const identifier = document.getElementById('register-identifier').value.trim();
  const password = document.getElementById('register-password').value.trim();
  if (!name || !identifier || !password) {
    authMessage.className = 'message error';
    authMessage.textContent = 'Пожалуйста, заполните все поля.';
    return;
  }
  user = {
    name,
    identifier,
    password,
    walletBalance: 0,
    favorites: [],
    cart: [],
    orders: []
  };
  authMessage.className = 'message success';
  authMessage.textContent = `Регистрация успешна! Добро пожаловать, ${name}.`;
  registerForm.reset();
  updateAccountInfo();
  showSection('home');
  renderFavorites();
  renderCart();
  renderOrders();
  updateWalletBalance();
});

// Вход
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!identifier || !password) {
    authMessage.className = 'message error';
    authMessage.textContent = 'Пожалуйста, заполните все поля.';
    return;
  }
  if (user && user.identifier === identifier && user.password === password) {
    authMessage.className = 'message success';
    authMessage.textContent = `Добро пожаловать, ${user.name}!`;
    loginForm.reset();
    updateAccountInfo();
    showSection('home');
    renderFavorites();
    renderCart();
    renderOrders();
    updateWalletBalance();
  } else {
    authMessage.className = 'message error';
    authMessage.textContent = 'Неверный логин или пароль.';
  }
});

// Обновление аккаунта на домашней странице
function updateAccountInfo() {
  const accDiv = document.getElementById('account-info');
  if (user) {
    accDiv.innerHTML = `
      <p>Здравствуйте, <strong>${user.name}</strong>!</p>
      <p>Баланс: <strong>${user.walletBalance.toFixed(2)} ₽</strong></p>
      <p>Избранных товаров: <strong>${user.favorites.length}</strong></p>
      <p>Товаров в корзине: <strong>${user.cart.length}</strong></p>
      <button id="logout-btn" class="primary" style="margin-top:15px;">Выйти</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      user = null;
      accDiv.innerHTML = `<em>Пожалуйста, войдите или зарегистрируйтесь, чтобы увидеть информацию о вашем аккаунте.</em>`;
      showSection('auth');
    });
  } else {
    accDiv.innerHTML = `<em>Пожалуйста, войдите или зарегистрируйтесь, чтобы увидеть информацию о вашем аккаунте.</em>`;
  }
}

updateAccountInfo();

// Продукты
const productsData = [
  {id:1, name:"Японский рис", price:250, description:"Высококачественный рис из Японии."},
  {id:2, name:"Соевый соус", price:150, description:"Аутентичный соевый соус."},
  {id:3, name:"Зеленый чай", price:300, description:"Свежий зеленый чай из Китая."},
  {id:4, name:"Паста мисо", price:200, description:"Традиционная японская паста мисо."},
];

const productsList = document.getElementById('products-list');

function renderProducts() {
  productsList.innerHTML = '';
  productsData.forEach(prod => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <h3>${prod.name}</h3>
      <p>${prod.description}</p>
      <p>Цена: <strong>${prod.price} ₽</strong></p>
      <div style="display:flex; gap:10px; margin-top:auto;">
        <button data-id="${prod.id}" class="add-fav-btn primary" aria-label="Добавить ${prod.name} в избранные">Избранное</button>
        <button data-id="${prod.id}" class="add-cart-btn primary" aria-label="Добавить ${prod.name} в корзину">В корзину</button>
      </div>
    `;
    productsList.appendChild(card);
  });
  attachProductButtons();
}

function attachProductButtons() {
  document.querySelectorAll('.add-fav-btn').forEach(btn => {
    btn.onclick = () => {
      if (!user) {
        alert('Пожалуйста, войдите в аккаунт чтобы добавлять в избранные.');
        showSection('auth');
        return;
      }
      const id = +btn.dataset.id;
      if (!user.favorites.includes(id)) {
        user.favorites.push(id);
        alert('Товар добавлен в избранные.');
        renderFavorites();
        updateAccountInfo();
      } else {
        alert('Товар уже в избранных.');
      }
    };
  });
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.onclick = () => {
      if (!user) {
        alert('Пожалуйста, войдите в аккаунт чтобы добавлять в корзину.');
        showSection('auth');
        return;
      }
      const id = +btn.dataset.id;
      user.cart.push(id);
      alert('Товар добавлен в корзину.');
      renderCart();
      updateAccountInfo();
    };
  });
}

// Избранные
const favoritesList = document.getElementById('favorites-list');
function renderFavorites() {
  if (!user || user.favorites.length === 0) {
    favoritesList.innerHTML = '<p>Пока нет избранных товаров.</p>';
    return;
  }
  favoritesList.innerHTML = '';
  user.favorites.forEach(id => {
    const prod = productsData.find(p => p.id === id);
    if (!prod) return;
    const card = document.createElement('article');
    card.className = 'fav-card';
    card.innerHTML = `
      <h3>${prod.name}</h3>
      <p>Цена: ${prod.price} ₽</p>
      <button data-id="${prod.id}" class="remove-fav-btn primary">Удалить</button>
    `;
    favoritesList.appendChild(card);
  });
  document.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.dataset.id;
      user.favorites = user.favorites.filter(fid => fid !== id);
      renderFavorites();
      updateAccountInfo();
    };
  });
}

// Корзина
const cartList = document.getElementById('cart-list');
const checkoutBtn = document.getElementById('checkout-btn');
const cartMessage = document.getElementById('cart-message');

function renderCart() {
  if (!user || user.cart.length === 0) {
    cartList.innerHTML = '<p>Корзина пуста.</p>';
    checkoutBtn.disabled = true;
    return;
  }
  cartList.innerHTML = '';
  const counts = {};
  user.cart.forEach(id => counts[id] = (counts[id] || 0) + 1);
  for (const [idStr, count] of Object.entries(counts)) {
    const id = +idStr;
    const prod = productsData.find(p => p.id === id);
    if (!prod) continue;
    const card = document.createElement('article');
    card.className = 'cart-card';
    card.innerHTML = `
      <h3>${prod.name}</h3>
      <p>Цена: ${prod.price} ₽</p>
      <p>Количество: ${count}</p>
      <button data-id="${prod.id}" class="remove-cart-btn primary">Удалить</button>
    `;
    cartList.appendChild(card);
  }
  checkoutBtn.disabled = false;

  document.querySelectorAll('.remove-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const id = +btn.dataset.id;
      const idx = user.cart.indexOf(id);
      if (idx !== -1) {
        user.cart.splice(idx, 1);
        renderCart();
        updateAccountInfo();
      }
    };
  });
}

checkoutBtn.onclick = () => {
  if (!user) {
    alert('Пожалуйста, войдите в аккаунт для оформления заказа.');
    showSection('auth');
    return;
  }
  if (user.cart.length === 0) {
    cartMessage.className = 'message error';
    cartMessage.textContent = 'Корзина пуста.';
    return;
  }
  let total = 0;
  user.cart.forEach(id => {
    const prod = productsData.find(p => p.id === id);
    if (prod) total += prod.price;
  });
  if (user.walletBalance < total) {
    cartMessage.className = 'message error';
    cartMessage.textContent = `Недостаточно средств. Нужно ${total} ₽, у вас ${user.walletBalance.toFixed(2)} ₽.`;
    return;
  }
  user.walletBalance -= total;
  user.orders.push({
    id: Date.now(),
    items: [...user.cart],
    total,
    date: new Date().toLocaleString(),
    status: 'В обработке'
  });
  user.cart = [];
  cartMessage.className = 'message success';
  cartMessage.textContent = `Заказ оформлен на сумму ${total} ₽. Спасибо за покупку!`;
  renderCart();
  updateAccountInfo();
  renderOrders();
  updateWalletBalance();
};

// Кошелёк
const walletBalanceEl = document.getElementById('wallet-balance');
const walletAddAmount = document.getElementById('wallet-add-amount');
const walletAddBtn = document.getElementById('wallet-add-btn');
const walletMessage = document.getElementById('wallet-message');

walletAddBtn.onclick = () => {
  if (!user) {
    walletMessage.className = 'message error';
    walletMessage.textContent = 'Пожалуйста, войдите в аккаунт.';
    showSection('auth');
    return;
  }
  const amount = parseFloat(walletAddAmount.value);
  if (isNaN(amount) || amount <= 0) {
    walletMessage.className = 'message error';
    walletMessage.textContent = 'Введите корректную сумму.';
    return;
  }
  user.walletBalance += amount;
  updateWalletBalance();
  walletMessage.className = 'message success';
  walletMessage.textContent = `Баланс пополнен на ${amount.toFixed(2)} ₽.`;
  walletAddAmount.value = '';
  updateAccountInfo();
};

function updateWalletBalance() {
  walletBalanceEl.textContent = user ? user.walletBalance.toFixed(2) : '0';
}

// Заказы
const ordersList = document.getElementById('orders-list');
function renderOrders() {
  if (!user || user.orders.length === 0) {
    ordersList.innerHTML = '<p>У вас пока нет заказов.</p>';
    return;
  }
  ordersList.innerHTML = '';
  user.orders.forEach(order => {
    const div = document.createElement('article');
    div.className = 'order-card';
    let itemsDesc = '';
    const counts = {};
    order.items.forEach(id => counts[id] = (counts[id] || 0) + 1);
    for (const [idStr, count] of Object.entries(counts)) {
      const prod = productsData.find(p => p.id === +idStr);
      if (prod) itemsDesc += `${prod.name} x${count}, `;
    }
    itemsDesc = itemsDesc.slice(0, -2);
    div.innerHTML = `
      <h3>Заказ №${order.id}</h3>
      <p>Дата: ${order.date}</p>
      <p>Товары: ${itemsDesc}</p>
      <p>Сумма: ${order.total.toFixed(2)} ₽</p>
      <p>Статус: ${order.status}</p>
    `;
    ordersList.appendChild(div);
  });
}

// Техподдержка
const supportForm = document.getElementById('support-form');
const supportResponse = document.getElementById('support-response');

supportForm.addEventListener('submit', e => {
  e.preventDefault();
  const contact = document.getElementById('support-contact').value.trim();
  const message = document.getElementById('support-message').value.trim();

  if (!contact || !message) {
    supportResponse.className = 'message error';
    supportResponse.textContent = 'Пожалуйста, заполните все поля.';
    return;
  }
  supportResponse.className = 'message success';
  supportResponse.textContent = 'Спасибо! Ваш запрос отправлен в техподдержку.';
  supportForm.reset();
});

// Инициализация
renderProducts();
renderFavorites();
renderCart();
renderOrders();
updateWalletBalance();
