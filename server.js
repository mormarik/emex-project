const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');

const User = require('./models/user');
const Product = require('./models/product');

const app = express();
const port = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB подключено'))
.catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// Настройка хранилища для изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // до 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /svg|jpg|jpeg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Разрешены только изображения: SVG, JPG, PNG, GIF'), false);
  }
});

// CORS и сессии
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: 'mySuperSecretKey12345!#',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));

// Статические файлы
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Регистрация
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "Все поля обязательны" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email или username уже используются" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (username === 'admin' && email === 'admin@yandex.ru') ? 'admin' : 'user';

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(200).json({ success: true, message: "Регистрация прошла успешно" });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Вход
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Неверный пароль' });

    req.session.userId = user._id;

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Ошибка при входе:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление товара (только админ)
app.post('/api/products', upload.single('image'), async (req, res) => {
  if (!req.session.userId) {
    return res.status(403).json({ message: 'Не авторизован' });
  }

  const user = await User.findById(req.session.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Только админ может добавлять товары' });
  }

  const { name, article, price, description, properties, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = new Product({ name, article, price, description, properties, category, image });
    await newProduct.save();
    res.status(200).json({ message: 'Товар добавлен' });
  } catch (err) {
    console.error('Ошибка добавления товара:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех товаров
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error('Ошибка получения товаров:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(product);
  } catch (err) {
    console.error('Ошибка получения товара:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отдача страницы корзины
app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/cart.html'));
});


// Проверка сессии
app.get('/api/session', (req, res) => {
  res.json({
    userId: req.session.userId,
    session: req.session,
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Сервер работает на http://localhost:${port}`);
});
