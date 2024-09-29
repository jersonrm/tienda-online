// js/app.js

// Código para agregar productos al carrito en productos.html
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los botones "Agregar al Carrito"
    const botonesAgregar = document.querySelectorAll('.btn-agregar');

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
});

function agregarAlCarrito(event) {
    const productoElemento = event.target.parentElement;
    const nombre = productoElemento.querySelector('h3').textContent;
    const precio = productoElemento.querySelector('p').textContent;
    const imagenSrc = productoElemento.querySelector('img').src;

    // Crear un objeto del producto
    const item = {
        nombre: nombre,
        precio: precio,
        imagen: imagenSrc,
        cantidad: 1
    };

    // Obtener el carrito del LocalStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya existe en el carrito
    const indice = carrito.findIndex(producto => producto.nombre === nombre);

    if (indice !== -1) {
        // Si existe, aumentar la cantidad
        carrito[indice].cantidad += 1;
    } else {
        // Si no existe, agregar al carrito
        carrito.push(item);
    }

    // Guardar el carrito en LocalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(`${nombre} ha sido agregado al carrito.`);
}

// js/app.js

// Código para manejar el carrito en carrito.html

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en carrito.html
    if (document.getElementById('lista-carrito')) {
        cargarCarritoDesdeLocalStorage();
        mostrarCarrito();
    }
});

let carrito = [];

// Función para cargar el carrito desde LocalStorage
function cargarCarritoDesdeLocalStorage() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
}

// Función para mostrar el carrito en la página
function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalPagar = document.getElementById('total-pagar');
    listaCarrito.innerHTML = '';

    let total = 0;

    carrito.forEach((item, index) => {
        const fila = document.createElement('tr');

        // Calcular el total por producto
        const precioNumerico = parseFloat(item.precio.replace('$', ''));
        const totalProducto = precioNumerico * item.cantidad;
        total += totalProducto;

        fila.innerHTML = `
            <td><img src="${item.imagen}" alt="${item.nombre}"></td>
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td>
                <button class="btn-accion disminuir" data-index="${index}">-</button>
                ${item.cantidad}
                <button class="btn-accion aumentar" data-index="${index}">+</button>
            </td>
            <td>$${totalProducto.toFixed(2)}</td>
            <td><button class="btn-accion eliminar" data-index="${index}">Eliminar</button></td>
        `;

        listaCarrito.appendChild(fila);
    });

    totalPagar.textContent = total.toFixed(2);

    // Añadir event listeners a los botones de aumentar, disminuir y eliminar
    listaCarrito.addEventListener('click', manejarAccionesCarrito);
}

// Función para manejar las acciones en el carrito
function manejarAccionesCarrito(event) {
    const elemento = event.target;
    const index = elemento.getAttribute('data-index');

    if (elemento.classList.contains('eliminar')) {
        eliminarProducto(index);
    } else if (elemento.classList.contains('aumentar')) {
        aumentarCantidad(index);
    } else if (elemento.classList.contains('disminuir')) {
        disminuirCantidad(index);
    }
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(index) {
    carrito[index].cantidad += 1;
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        eliminarProducto(index);
        return;
    }
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

// Función para guardar el carrito en LocalStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Evento para vaciar el carrito
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', () => {
        carrito = [];
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
    });
}

// js/app.js

// Verificar si estamos en productos.html
if (document.querySelectorAll('.producto').length > 0) {
    // Seleccionar todos los productos
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        producto.addEventListener('click', mostrarModalProducto);
    });

    // Elementos del modal
    const modal = document.getElementById('modal-descripcion');
    const cerrarModalBtn = document.getElementById('cerrar-modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalImagen = document.getElementById('modal-imagen');
    const modalPrecio = document.getElementById('modal-precio');
    const modalDescripcionTexto = document.getElementById('modal-descripcion-texto');
    const modalAgregarCarritoBtn = document.getElementById('modal-agregar-carrito');

    // Función para mostrar el modal con la información del producto
    function mostrarModalProducto(event) {
        // Prevenir que el evento afecte a botones internos
        if (event.target.classList.contains('btn-agregar')) {
            return;
        }

        const productoElemento = event.currentTarget;
        const nombre = productoElemento.querySelector('h3').textContent;
        const precio = productoElemento.querySelector('p').textContent;
        const imagenSrc = productoElemento.querySelector('img').src;
        const descripcion = productoElemento.getAttribute('data-descripcion');

        // Actualizar el contenido del modal
        modalTitulo.textContent = nombre;
        modalImagen.src = imagenSrc;
        modalImagen.alt = nombre;
        modalPrecio.textContent = precio;
        modalDescripcionTexto.textContent = descripcion;

        // Mostrar el modal
        modal.style.display = 'block';

        // Añadir evento al botón "Agregar al Carrito" en el modal
        modalAgregarCarritoBtn.onclick = function() {
            agregarAlCarritoDesdeModal(nombre, precio, imagenSrc);
        };
    }

    // Función para cerrar el modal
    cerrarModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Función para agregar al carrito desde el modal
    function agregarAlCarritoDesdeModal(nombre, precio, imagenSrc) {
        // Crear un objeto del producto
        const item = {
            nombre: nombre,
            precio: precio,
            imagen: imagenSrc,
            cantidad: 1
        };

        // Obtener el carrito del LocalStorage
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Verificar si el producto ya existe en el carrito
        const indice = carrito.findIndex(producto => producto.nombre === nombre);

        if (indice !== -1) {
            // Si existe, aumentar la cantidad
            carrito[indice].cantidad += 1;
        } else {
            // Si no existe, agregar al carrito
            carrito.push(item);
        }

        // Guardar el carrito en LocalStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        alert(`${nombre} ha sido agregado al carrito.`);

        // Cerrar el modal
        modal.style.display = 'none';
    }
}
