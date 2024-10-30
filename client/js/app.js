import { router } from './router.js';
import { initializeCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeCart();
  router.init();
});
