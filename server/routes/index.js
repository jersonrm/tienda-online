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

// Root route
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Ejemplo de ruta protegida con el middleware de autenticación
router.get('/some-protected-route', auth, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Agrega más rutas aquí, por ejemplo:
router.get('/products', (req, res) => {
  // Lógica para obtener productos
  res.json({ products: [] });
});

module.exports = router;
