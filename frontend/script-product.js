// Получение ID товара из URL (например: ?id=123)
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  
  // Загрузка информации о товаре
  async function loadProduct() {
    const productId = getProductIdFromUrl();
    if (!productId) return;
  
    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
  
      // Привязка данных
      document.getElementById("product-image").src = product.image || 'https://via.placeholder.com/150';
      document.getElementById('product-title').textContent = product.name;
      document.getElementById('product-description').textContent = product.description || "Описание не доступно"; // Выводим описание
      document.getElementById('product-properties').textContent = `Характеристики: ${product.properties}`;
      document.getElementById('product-price').textContent = `${product.price} ₽`;
  
      saveToRecentlyViewed(product);
      loadRecentlyViewed(product._id);
    } catch (err) {
      console.error('Ошибка загрузки товара:', err);
    }
  }
  
  
  
  // Добавление товара в корзину
  function addToCart() {
    const productId = getProductIdFromUrl();
    if (!productId) return;
  
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('🛒 Товар добавлен в корзину!');
  }
  
  // Загрузка отзывов
  async function loadReviews() {
    const productId = getProductIdFromUrl();
    if (!productId) return;
  
    try {
      const response = await fetch(`/api/reviews/${productId}`);
      const reviews = await response.json();
  
      const reviewsList = document.getElementById('reviews-list');
      reviewsList.innerHTML = '';
  
      reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML = `<strong>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</strong><br>${review.text}`;
        reviewsList.appendChild(div);
      });
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  }
  
  // Отправка отзыва
  async function submitReview(event) {
    event.preventDefault();
  
    const productId = getProductIdFromUrl();
    const rating = parseInt(document.getElementById('rating').value);
    const text = document.getElementById('review-text').value;
  
    if (!text) return alert('Пожалуйста, введите отзыв.');
  
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, text })
      });
  
      document.getElementById('review-form').reset();
      loadReviews();
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err);
    }
  }
  
  document.getElementById('review-form').addEventListener('submit', submitReview);
  
  // Сохраняем товар в localStorage
  function saveToRecentlyViewed(product) {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    viewed = viewed.filter(p => p._id !== product._id); // удалим дубликаты
    viewed.unshift(product); // добавим в начало
    if (viewed.length > 10) viewed = viewed.slice(0, 10); // максимум 10 товаров
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
  }
  
  // Загружаем и отображаем недавно просмотренные товары
  function loadRecentlyViewed(currentId) {
    
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const container = document.getElementById('recently-viewed-list');
    container.innerHTML = '';
  
    viewed
      .filter(p => p._id !== currentId)
      .forEach(product => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <p>${product.price} ₽</p>
        `;
        div.onclick = () => {
          window.location.href = `product.html?id=${product._id}`;
        };
        container.appendChild(div);
      });
  }
  
  // Запуск
  loadProduct();
  loadReviews();
  