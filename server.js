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


mongoose.connect('mongodb://localhost:27017/your-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('манго подключено '))
.catch(err => console.error('манго ошибку выдало...пон:', err));


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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /svg|jpg|jpeg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only SVG, JPG, PNG, GIF files allowed'), false);
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "connect-src 'self' http://127.0.0.1:30102 https://yandexmetrica.com https://gc.kis.v2.scr.kaspersky-labs.com;");
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  secret: 'mySuperSecretKey12345!#',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "все поля обязательны для заполнения" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "такой пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (username === 'admin' && email === 'admin@yandex.ru') ? 'admin' : 'user';
    const newUser = new User({ username, email, password: hashedPassword, role });

    await newUser.save();
    res.status(200).json({ success: true, message: "вы успешно зарегистрировались, теперь войдите" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'сервер выдал ошибку' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'такой пользователь не найден' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'неверный пароль' });

    req.session.userId = user._id;
    console.log("Session UserId: ", req.session.userId);

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'неверные учетные данные' });
  }

  req.session.userId = user._id;
  res.json({ message: 'вход выполнен', user: { username: user.username, role: user.role } });
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'только для админа.' });
  }
  

  const { name, article, price, description, properties, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = new Product({ name, article, price, description, properties, category, image });
    await newProduct.save();
    res.status(200).json({ message: 'продукт добавлен' });
  } catch (error) {
    console.error('ошибка добавления:', error);
    res.status(500).json({ message: 'ошибка при добавлении.' });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'слишком большой файл' });
  }
  res.status(200).json({ message: 'файл загружен', file: req.file });
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'сервер выдает ошибку' });
  }
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'profile.html'));
});
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'products.html'));
});

app.listen(port, () => {
  console.log(`сервак работает тут http://localhost:${port}`);
});
