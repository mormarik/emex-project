const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const products = []; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frontend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  const { name, article, price, description, category, properties } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const product = {
    id: Date.now(),
    name,
    article,
    price,
    description,
    properties: properties || '{}',
    category,
    imageUrl,
  };

  products.push(product); 
  res.status(201).json({ message: 'Товар добавлен', product });
});

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) {
    return res.json(products.filter(p => p.category === category));
  }
  res.json(products);
});

module.exports = router;
