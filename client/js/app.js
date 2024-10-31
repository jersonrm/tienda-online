import { router } from './router.js';
import { initializeCart } from './cart.js';
import { loadProducts } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeCart();
  router.init();
  loadProducts();
});
