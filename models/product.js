const mongoose = require('mongoose');

// Определяем схему для продукта
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  article: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  properties: { type: String, default: '{}' },
  category: { type: String, required: true },
  image: { type: String, required: true }, // Это может быть путь или base64 строка
});

// Создаем модель для продукта
module.exports = mongoose.model('Product', productSchema);
