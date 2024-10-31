const productsContainer = document.getElementById('products-container');

async function fetchProducts() {
    try {
        console.log('Iniciando fetch de productos...');
        const response = await fetch('http://localhost:3000/api/productos'); // Cambiado a /api/productos
        console.log('Respuesta recibida:', response);
        const products = await response.json();
        console.log('Productos obtenidos:', products);
        displayProducts(products);
    } catch (error) {
        console.error('Error detallado:', error);
        productsContainer.innerHTML = `<p>Error al cargar los productos: ${error.message}</p>`;
    }
}

function displayProducts(products) {
    if (!Array.isArray(products)) {
        console.error('Los productos no son un array:', products);
        return;
    }

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p>${product.descripcion}</p>
            <div class="price">$${product.precio}</div>
            <p>Stock: ${product.stock}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        </div>
    `).join('');
}

window.addToCart = function(productId) {
    console.log('Producto agregado:', productId);
}

// Ejecutar inmediatamente al cargar
fetchProducts();
