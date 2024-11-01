let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
        total += item.precio * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-details">
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
                <button onclick="removeFromCart(${index})" class="remove-btn">Eliminar</button>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '100px'; // Ajustado para que aparezca justo debajo del menú
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function addToCartWithNotification(product) {
    try {
        // Si product es string, intentar parsearlo
        if (typeof product === 'string') {
            product = JSON.parse(product);
        }
        
        addToCart(product);
        showNotification(`${product.nombre} agregado al carrito`);
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        showNotification('Error al agregar el producto al carrito');
    }
}

// Modificar la función addToCart para asegurar que funcione correctamente
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Si estamos en la página del carrito, actualizar la visualización
    if (document.getElementById('cart-container')) {
        updateCartDisplay();
    }
}

function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
    }
    saveCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Initialize cart display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

// Add event listener for checkout button
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    alert('¡Gracias por tu compra!');
    cart = [];
    saveCart();
});
