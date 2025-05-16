const root = document.getElementById("cart-root");
const isLoggedIn = localStorage.getItem("user");

if (!isLoggedIn) {
  root.innerHTML = '<p class="message">Зарегистрируйтесь или войдите в систему, чтобы увидеть корзину</p>';
} else {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!isLoggedIn) {
    root.innerHTML = `
    <div class="cart-empty">
      <p class="message">Зарегистрируйтесь или войдите в систему, чтобы увидеть корзину</p>
    </div>
  `;  
  }
   else {
    let products = {};

    Promise.all(cart.map(id => fetch(`/api/products/${id}`).then(r => r.json())))
      .then(items => {
        cart.forEach(id => {
          if (!products[id]) products[id] = { count: 0 };
          products[id].count++;
        });

        items.forEach(product => {
          if (products[product._id]) {
            products[product._id] = {
              ...products[product._id],
              ...product
            };
          }
        });

        renderCart(Object.values(products));
      });

    function renderCart(items) {
      let total = 0;
      let html = `<div class="cart-container">`;

      items.forEach(item => {
        const subtotal = item.price * item.count;
        total += subtotal;

        html += `
          <div class="cart-item" data-id="${item._id}">
            <img src="${item.image}" alt="${item.name}" />
            <div class="cart-info">
              <h3>${item.name}</h3>
              <p>${item.description || "Без описания"}</p>
            </div>
            <div class="cart-controls">
              <button onclick="updateQuantity('${item._id}', -1)">-</button>
              <span>${item.count}</span>
              <button onclick="updateQuantity('${item._id}', 1)">+</button>
            </div>
            <div class="cart-price">${subtotal} ₽</div>
          </div>
        `;
      });

      html += `
        <div class="cart-total">Итого: ${total} ₽</div>
        <button class="checkout-btn">Перейти к оформлению</button>
      </div>`;

      root.innerHTML = html;
    }

    window.updateQuantity = function (id, delta) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (delta === -1) {
        const index = cart.indexOf(id);
        if (index > -1) cart.splice(index, 1);
      } else {
        cart.push(id);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };
  }
}
