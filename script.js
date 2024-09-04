let paginaActualTazas = 1;
let paginaActualTazones = 1;
const productosPorPagina = 4;

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const productosTazas = JSON.parse(localStorage.getItem('productosTazas')) || [];
const productosTazones = JSON.parse(localStorage.getItem('productosTazones')) || [];

// Función para mostrar productos de tazas y tazones
function mostrarProductos() {
    mostrarProductosPorTipo('tazas', paginaActualTazas, 'productos-tazas');
    mostrarProductosPorTipo('tazones', paginaActualTazones, 'productos-tazones');
}

// Función para mostrar productos por tipo
function mostrarProductosPorTipo(tipo, pagina, contenedorId, colorFiltro = null) {
    let productos = tipo === 'tazas' ? productosTazas : productosTazones;
    if (tipo === 'tazones' && colorFiltro && colorFiltro !== 'todos') {
        productos = productos.filter(producto => producto.color === colorFiltro);
    }
    const inicio = (pagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productos.slice(inicio, fin);

    const contenedor = document.getElementById(contenedorId);
    contenedor.innerHTML = '';

    productosPagina.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.nombre}</p>
            <p>${producto.precio}</p>
            <button onclick="agregarAlCarrito('${producto.nombre}', '${producto.precio}', '${producto.imagen}')">Añadir al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

// Función para cambiar de página para tazas
function cambiarPaginaTazas(incremento) {
    paginaActualTazas += incremento;
    mostrarProductos();
}

// Función para cambiar de página para tazones
function cambiarPaginaTazones(incremento) {
    paginaActualTazones += incremento;
    mostrarProductos();
}

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    carrito.push({ nombre, precio, imagen });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    document.getElementById('carrito-cantidad').textContent = carrito.length;
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoModal = document.getElementById('carrito-modal');
    const carritoContenido = document.getElementById('carrito-items-list');
    
    carritoContenido.innerHTML = '';
    carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <p>${item.nombre}</p>
            <p>${item.precio}</p>
            <button onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
        `;
        carritoContenido.appendChild(div);
    });

    const total = carrito.reduce((sum, item) => sum + parseFloat(item.precio.replace(' ARS', '').replace(',', '.')), 0);
    document.getElementById('total').textContent = `Total: ${total.toFixed(2)} ARS`;

    const formaPago = document.getElementById('forma-pago').value;

    const pagarBtn = document.getElementById('pagar');
    pagarBtn.onclick = () => {
        const mensaje = encodeURIComponent(`Hola, quiero pagar los siguientes productos: ${carrito.map(item => item.nombre).join(', ')}. Total: ${total.toFixed(2)} ARS. Forma de pago: ${formaPago}`);
        window.location.href = `https://wa.me/?text=${mensaje}`;
    };

    carritoModal.style.display = 'flex'; // Mostrar el modal
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    document.getElementById('carrito-cantidad').textContent = carrito.length;
}

// Función para ocultar el carrito
function ocultarCarrito() {
    document.getElementById('carrito-modal').style.display = 'none'; // Ocultar el modal
}

// Función para filtrar productos por color
function filtrarPorColor(color) {
    paginaActualTazones = 1; // Reiniciar la página al filtrar
    mostrarProductosPorTipo('tazones', paginaActualTazones, 'productos-tazones', color);
}

// Añadir evento de filtrado por color
document.getElementById('filtros-tazones').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        filtrarPorColor(event.target.textContent.toLowerCase());
    }
});

document.getElementById('carrito').addEventListener('click', mostrarCarrito);
document.getElementById('carrito-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        ocultarCarrito();
    }
});

// Inicializar los productos al cargar la página
mostrarProductos();
