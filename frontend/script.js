
function toggleDropdown() {
    const dropdown = document.getElementById('city-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

  function selectCity(city) {
    document.getElementById('selected-city').textContent = city;
    toggleDropdown();
  }
  
  function filterCities() {
    const query = document.getElementById('city-search').value.toLowerCase();
    const cities = document.querySelectorAll('#city-list li');
  
    cities.forEach(city => {
      const name = city.textContent.toLowerCase();
      city.style.display = name.includes(query) ? 'block' : 'none';
    });
  }
  document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('city-dropdown');
    const btn = document.querySelector('.location-btn');
  
    if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  });

  document.getElementById('catalog-button').addEventListener('click', function () {
    window.location.href = 'catalog.html';
  });

const products = {
    category1: [
      { price: "7 021 ₽", name: "Масло моторное 229.3/229.5, 5л", article: "МБ РУС·A000989210713MBR", imgSrc: "img/cart1.svg", link: "link_to_product_1" },
      { price: "7 073 ₽", name: "Масло моторное 229.51, 5л", article: "МБ РУС·A000989220713MBR", imgSrc: "img/cart2.svg", link: "link_to_product_2" },
      { price: "78 929 ₽", name: "Стекло лобовое для Mercedes-Benz GLE", article: "МБ РУС·A1666705400MB", imgSrc: "img/cart3.svg", link: "link_to_product_3" },
      { price: "189 ₽", name: "Свеча зажигания", article: "Denso·K16RU11", imgSrc: "img/cart4.svg", link: "link_to_product_4" },
      { price: "549 ₽", name: "Масляный фильтр", article: "Hyundai / KIA·2630035505", imgSrc: "img/cart5.svg", link: "link_to_product_5" },
      { price: "34 ₽", name: "Прокладка сливной пробки", article: "Nissan·1102601M02", imgSrc: "img/cart6.svg", link: "link_to_product_6" }
    ],
    category2: [
      { price: "664 ₽", name: "Сальник распредвала", article: "Mitsubishi·MD372536", imgSrc: "img/cart2-1.svg", link: "link_to_product_7" },
      { price: "1 339 ₽", name: "Прокладка клапанной крышки", article: "Toyota·1121320030", imgSrc: "img/cart2-2.svg", link: "link_to_product_8" },
      { price: "467 ₽", name: "Втулка стабилизатора", article: "Subaru·20464SC010", imgSrc: "img/cart2-3.svg", link: "link_to_product_9" },
      { price: "274 ₽", name: "Уплотнение фильтра CVT", article: "Nissan·315263VX0A", imgSrc: "img/cart2-4.svg", link: "link_to_product_10" },
      { price: "486 ₽", name: "Прокладка свечного колодца", article: "Subaru·13293AA051", imgSrc: "img/cart2-5.svg", link: "link_to_product_11" },
      { price: "1 561 ₽", name: "Свеча зажигания", article: "Toyota·9091901210", imgSrc: "img/cart2-6.svg", link: "link_to_product_12" }
    ],
    category3: [
      { price: "387 ₽", name: "Очиститель двигателя Motor Cleaner", article: "Grass·116100", imgSrc: "img/cart3-1.svg", link: "link_to_product_13" },
      { price: "633 ₽", name: "Герметик высокотемпературный силиконовый", article: "Victor Reinz·703141410", imgSrc: "img/cart3-2.svg", link: "link_to_product_14" },
      { price: "1 259 ₽", name: "Щётки стеклоочистителя зимняя", article: "Alca·074000", imgSrc: "img/cart3-3.svg", link: "link_to_product_15" },
      { price: "271 ₽", name: "Лампа Philips Vision", article: "Philips·12342PRC1", imgSrc: "img/cart3-4.svg", link: "link_to_product_16" },
      { price: "186 ₽", name: "Манометр стрелочный в пластиковом корпусе 5 атм", article: "Airline·APRM05", imgSrc: "img/cart3-5.svg", link: "link_to_product_17" },
      { price: "113 150 ₽", name: "Шкив-муфта впускная", article: "Volvo·8642284", imgSrc: "img/cart3-6.svg", link: "link_to_product_18" }
    ],
    category4: [
      { price: "1 208 ₽", name: "Приспособление для утапливания поршней тормозных цилиндров VAG", article: "Дело Техники·820005", imgSrc: "img/cart4-1.svg", link: "link_to_product_19" },
      { price: "456 ₽", name: "Щетка очистки клеммы АКБ", article: "Autoprofi·BATBRS113", imgSrc: "img/cart4-2.svg", link: "link_to_product_20" },
      { price: "1 103 ₽", name: "Приспособление для установки кислородного датчика", article: "Jonnesway·AI010033", imgSrc: "img/cart4-3.svg", link: "link_to_product_21" },
      { price: "501 ₽", name: "Съемник масляного фильтра, серп 65—110 мм", article: "Alca·440000", imgSrc: "img/cart4-4.svg", link: "link_to_product_22" },
      { price: "476 ₽", name: "Масленка-нагнетатель, 0,3 л, гибкий наконечник", article: "Sparta·531305", imgSrc: "img/cart4-5.svg", link: "link_to_product_23" },
      { price: "327 ₽", name: "Приспособление для проверки зазора между электродами свечи накала", article: "JTC·JTC1507", imgSrc: "img/cart4-6.svg", link: "link_to_product_24" }
    ]
  };
  
  function updateProducts(category) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; 
    const categoryProducts = products[category];  
  
    categoryProducts.forEach(product => {
      const productCell = document.createElement('div');
      productCell.classList.add('product-cell', 'product-card');
      productCell.innerHTML = `
        <a href="${product.link}">
          <img src="${product.imgSrc}" alt="${product.name}">
        </a>
        <div class="product-info">
          <div class="product-price">${product.price}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-article">${product.article}</div>
        </div>
      `;
      productGrid.appendChild(productCell);  
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const rectangles = document.querySelectorAll(".rectangle");
  
    rectangles.forEach(rect => {
      rect.addEventListener("click", function () {
        rectangles.forEach(el => {
          el.classList.remove("rectangle-yellow");
          el.classList.add("rectangle-black");
        });
        this.classList.remove("rectangle-black");
        this.classList.add("rectangle-yellow");
        const category = this.getAttribute("data-category");

        updateProducts(category);
      });
    });
    updateProducts('category1');
  });


function toggleFilter(id) {
  const filter = document.getElementById(id);
  const toggle = filter.previousElementSibling.querySelector('.toggle');
  if (filter.style.display === 'none' || filter.style.display === '') {
      filter.style.display = 'block';
      toggle.textContent = '-';
  } else {
      filter.style.display = 'none';
      toggle.textContent = '+';
  }
}


  const loadRange = document.getElementById('loadRange');
  const loadValue = document.getElementById('loadValue');
  loadRange.addEventListener('input', () => {
    loadValue.textContent = loadRange.value;
  });

  const deliveryRange = document.getElementById('deliveryRange');
  const deliveryValue = document.getElementById('deliveryValue');
  deliveryRange.addEventListener('input', () => {
    deliveryValue.textContent = deliveryRange.value;
  });


  function updateFileName() {
    const input = document.getElementById('resume-file');
    const fileName = document.getElementById('file-name');
    fileName.textContent = input.files.length > 0 ? input.files[0].name : 'Файл не выбран';
  }


  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "connect-src 'self' http://127.0.0.1:*;");
    next();
  });

  document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const profileBtnContainer = document.getElementById("profile-btn-container");
    const profileBtn = document.getElementById("profile-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
    const profileLink = document.getElementById("profile-link");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
        loginBtn.style.display = "none";
        profileBtnContainer.style.display = "inline-block";
        profileBtn.textContent = user.username;
    } else {
        loginBtn.style.display = "inline-block";
        profileBtnContainer.style.display = "none";
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (profileDropdown) {
                profileDropdown.style.display =
                    profileDropdown.style.display === "block" ? "none" : "block";
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (
            profileDropdown &&
            !profileDropdown.contains(e.target) &&
            !profileBtn.contains(e.target)
        ) {
            profileDropdown.style.display = "none";
        }
    });

    if (profileLink) {
        profileLink.addEventListener("click", () => {
            window.location.href = "/profile.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            location.reload(); 
        });
    }
  });

  

  document.getElementById('product-catalog').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.products) {
                const productList = data.products;
                const catalogContainer = document.getElementById('catalog'); 
                let productsHtml = '<ul>';

                productList.forEach(product => {
                    productsHtml += `
                        <li>
                            <div class="product-item">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <p>Цена: ${product.price}</p>
                                <img src="${product.image}" alt="${product.name}" />
                            </div>
                        </li>
                    `;
                });

                productsHtml += '</ul>';
                catalogContainer.innerHTML = productsHtml; 
            } else {
                catalogContainer.innerHTML = '<p>Не удалось загрузить товары.</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке продуктов:', error);
            catalogContainer.innerHTML = '<p>Ошибка при загрузке товаров.</p>';
        });
});
document.addEventListener('DOMContentLoaded', loadAllProducts);

function loadAllProducts() {
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      data.products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
          <h3>${product.name}</h3>
          <p>Артикул: ${product.article}</p>
          <p>Категория: ${product.category}</p>
          <p>Цена: ${product.price} руб.</p>
          <p>${product.description}</p>
        `;
        productList.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Ошибка загрузки товаров:', err);
    });
}


// товары!! catalog.html

const categoryButtons = document.querySelectorAll('.category-btn');

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.category-btn.active').classList.remove('active');
    btn.classList.add('active');

    const category = btn.dataset.category;
    products.forEach(product => {
      product.style.display = (category === 'all' || product.dataset.category === category) ? 'block' : 'none';
    });
  });
});