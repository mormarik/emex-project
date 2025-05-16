document.addEventListener("DOMContentLoaded", () => {
  const catalogGrid = document.getElementById("catalogGrid");

  fetch('http://localhost:3000/api/session')
    .then(response => response.json())
    .then(data => {
        console.log("SESSION DATA:", data); // 👈 Вставь это
        const userRole = data.user?.role;
      

      fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(products => {
          products.forEach((product, index) => {
            const card = document.createElement("div");
            card.className = "item-card";
            card.setAttribute("data-category", product.category || "Без категории");

            // HTML шаблон карточки товара
            card.innerHTML = `
              <div class="item-image">
                <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
              </div>
              <div class="item-info">
                <p class="item-price">${product.price} ₽</p>
                <h3 class="item-name">${product.name}</h3>
                <p class="item-article">Артикул: ${product.article}</p>
              </div>
              <div class="item-buttons">
                ${userRole === 'admin' ? `<button class="btn-delete">Удалить</button>` : ''}
              </div>
            `;

            // Назначаем клик на карточку (кроме кнопки)
            card.addEventListener("click", (e) => {
              if (!e.target.classList.contains("btn-delete")) {
                window.location.href = `product.html?id=${product._id}`;

              }
            });

            catalogGrid.appendChild(card);

            // Назначаем обработчик удаления, если admin
            if (userRole === 'admin') {
              const deleteBtn = card.querySelector('.btn-delete');
              deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // предотвратить переход по карточке
                deleteProduct(product._id);
              });
            }
          });
        });
    })
    .catch(err => {
      console.error("Ошибка при получении роли пользователя:", err);
    });
});


document.querySelectorAll('.category-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const selectedCategory = button.dataset.category;
    document.querySelectorAll('.item-card').forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      card.style.display =
        selectedCategory === 'all' || cardCategory === selectedCategory
          ? 'block'
          : 'none';
    });
  });
});
