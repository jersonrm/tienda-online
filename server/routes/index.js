const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Middleware de autenticación
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Middleware para verificar rol de admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Root route
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Ejemplo de ruta protegida con el middleware de autenticación
router.get('/some-protected-route', auth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Modificar la ruta de productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Agregar ruta para crear productos (temporal, para pruebas)
router.post('/products', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error creating product' });
  }
});

module.exports = router;
