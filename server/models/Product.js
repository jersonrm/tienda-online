const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image: DataTypes.STRING,
  description: DataTypes.TEXT,
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Product;
