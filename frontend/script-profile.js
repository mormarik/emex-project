document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentPath = window.location.pathname;

  if (!user && currentPath === '/profile.html') {
    window.location.href = '/auth.html';
    return;
  }

  if (user && currentPath === '/auth.html') {
    window.location.href = '/profile.html';
    return;
  }

  if (user && currentPath === '/profile.html') {
    initializeProfilePage(user);
  }

  setupNavigationLinks();
  setupProductForm();
  setupCategoryButtons();
});

function initializeProfilePage(user) {
  const usernameInput = document.getElementById('user-username');
  const emailInput = document.getElementById('user-email');
  const avatarImg = document.getElementById('user-avatar');
  const storedAvatar = localStorage.getItem('avatar');

  if (usernameInput) usernameInput.value = user.username || '';
  if (emailInput) emailInput.value = user.email || '';
  if (storedAvatar && avatarImg) avatarImg.src = storedAvatar;

  console.log("User role:", user.role);

  if (user.role === 'admin') {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
      console.log('Showing admin panel');
      adminPanel.style.display = 'block';
    }
  }

  setupProfileActions(user);
}

function setupProfileActions(user) {
  const usernameInput = document.getElementById('user-username');
  const emailInput = document.getElementById('user-email');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const errorMsg = document.getElementById('error-msg');
  const logoutBtn = document.getElementById('logout-btn');
  const changeAvatarBtn = document.getElementById('change-avatar-btn');
  const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
  const avatarInput = document.getElementById('user-avatar-input');
  const avatarImg = document.getElementById('user-avatar');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  saveBtn?.addEventListener('click', () => {
    const username = usernameInput.value;
    const email = emailInput.value;

    if (!username || !email) {
      errorMsg.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      errorMsg.textContent = 'Введите корректный email.';
      return;
    }

    const updatedUser = { ...user, username, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    errorMsg.textContent = '';
    alert('Профиль успешно сохранен!');
  });

  cancelBtn?.addEventListener('click', () => {
    usernameInput.value = user.username || '';
    emailInput.value = user.email || '';
    errorMsg.textContent = '';
  });

  changeAvatarBtn?.addEventListener('click', () => {
    avatarInput.click();
  });

  avatarInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        avatarImg.src = reader.result;
        localStorage.setItem('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  deleteAvatarBtn?.addEventListener('click', () => {
    avatarImg.src = 'img/img2/avatar.webp';
    localStorage.removeItem('avatar');
  });

  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/auth.html';
  });

  profileBtn?.addEventListener('click', () => {
    profileDropdown.style.display =
      profileDropdown.style.display === 'block' ? 'none' : 'block';
  });
}

function setupNavigationLinks() {
  const profileLink = document.getElementById('profile-link');
  const homeLink = document.getElementById('home-link');

  profileLink?.addEventListener('click', () => {
    if (window.location.pathname !== '/profile.html') {
      window.location.href = '/profile.html';
    }
  });

  homeLink?.addEventListener('click', () => {
    if (window.location.pathname !== '/index.html') {
      window.location.href = '/index.html';
    }
  });
}

function setupProductForm() {
  const addProductForm = document.getElementById('add-product-form');

  if (!addProductForm) return;

  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addProductForm);
    const user = JSON.parse(localStorage.getItem('user')); // Получаем данные пользователя

    if (!user || user.role !== 'admin') {
      alert('Только администратор может добавлять товары');
      return;
    }

    // Добавляем роль пользователя в форму (если нужно)
    formData.append('role', user.role); 

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
        credentials: 'include', // <-- Это важно
      });

      const result = await response.json();
      if (result.message === 'Продукт добавлен') {
        alert('Продукт успешно добавлен');
        addProductForm.reset();
      } else {
        alert('Произошла ошибка при добавлении товара');
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      alert('Произошла ошибка при добавлении товара');
    }
  });
}

function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-btn');

  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const category = btn.getAttribute('data-category');
      try {
        const response = await fetch(`/api/products?category=${category}`);
        const products = await response.json();
        displayProducts(products);
      } catch (error) {
        console.error('Ошибка при получении товаров по категории:', error);
      }
    });
  });
}

function displayProducts(products) {
  const productsContainer = document.getElementById('products-list');
  productsContainer.innerHTML = '';

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product-item');
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>${product.price}₽</p>
    `;
    productsContainer.appendChild(productElement);
  });
}
