// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    const productoElement = event.target.parentElement; // Seleccionamos el contenedor del producto
    const nombre = productoElement.querySelector("h3").textContent; // Extraemos el nombre del producto
    const precio = productoElement.querySelector("p").textContent; // Extraemos el precio del producto
    const imagen = productoElement.querySelector("img").src; // Extraemos la imagen del producto

    // Creamos un objeto con los detalles del producto
    const producto = {
        nombre: nombre,
        precio: precio,
        imagen: imagen,
        cantidad: 1
    };

    // Obtenemos el carrito almacenado en localStorage o un arreglo vacío si no existe
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificamos si el producto ya está en el carrito
    const indiceProducto = carrito.findIndex(item => item.nombre === nombre);

    if (indiceProducto !== -1) {
        // Si el producto ya está en el carrito, incrementamos su cantidad
        carrito[indiceProducto].cantidad += 1;
    } else {
        // Si no está, lo agregamos al carrito
        carrito.push(producto);
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Mostramos un mensaje de confirmación
    alert(`${nombre} ha sido agregado al carrito.`);
}

// Función para cargar el carrito desde localStorage y mostrarlo
function cargarCarritoDesdeLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("lista-carrito");
    const totalPagar = document.getElementById("total-pagar");

    listaCarrito.innerHTML = ''; // Limpiamos el contenido previo
    let total = 0;

    carrito.forEach((producto, indice) => {
        const fila = document.createElement("tr");
        const precioProducto = parseFloat(producto.precio.replace("$", "")) * producto.cantidad;
        total += precioProducto;

        fila.innerHTML = `
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>
                <button class="btn-accion disminuir" data-index="${indice}">-</button>
                ${producto.cantidad}
                <button class="btn-accion aumentar" data-index="${indice}">+</button>
            </td>
            <td>$${precioProducto.toFixed(2)}</td>
            <td><button class="btn-accion eliminar" data-index="${indice}">Eliminar</button></td>
        `;
        listaCarrito.appendChild(fila);
    });

    totalPagar.textContent = total.toFixed(2); // Actualizamos el total a pagar
}

// Función para manejar las acciones del carrito (aumentar, disminuir, eliminar)
function manejarAccionesCarrito(event) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const indice = event.target.getAttribute("data-index");

    if (event.target.classList.contains("eliminar")) {
        carrito.splice(indice, 1); // Eliminamos el producto
    } else if (event.target.classList.contains("aumentar")) {
        carrito[indice].cantidad += 1; // Aumentamos la cantidad
    } else if (event.target.classList.contains("disminuir")) {
        if (carrito[indice].cantidad > 1) {
            carrito[indice].cantidad -= 1; // Disminuimos la cantidad
        } else {
            carrito.splice(indice, 1); // Si la cantidad es 1, eliminamos el producto
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos el carrito actualizado
    cargarCarritoDesdeLocalStorage(); // Refrescamos la vista del carrito
}

// Asignar los eventos cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Asignamos la función agregar al carrito a los botones
    document.querySelectorAll(".btn-agregar").forEach(btn => {
        btn.addEventListener("click", agregarAlCarrito);
    });

    // Si estamos en la página del carrito, cargamos el contenido del carrito
    if (document.getElementById("lista-carrito")) {
        cargarCarritoDesdeLocalStorage();

        // Asignamos la funcionalidad de manejo de acciones del carrito
        document.getElementById("lista-carrito").addEventListener("click", manejarAccionesCarrito);

        // Asignamos el evento de vaciar el carrito
        const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener("click", () => {
                localStorage.removeItem("carrito"); // Vaciamos el carrito en localStorage
                cargarCarritoDesdeLocalStorage(); // Refrescamos la vista
            });
        }
    }
});

