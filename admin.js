document.getElementById('form-tazas').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-taza').value;
    const precio = document.getElementById('precio-taza').value;
    const imagen = document.getElementById('imagen-taza').files[0];

    if (nombre && precio && imagen) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const productosTazas = JSON.parse(localStorage.getItem('productosTazas')) || [];
            const tazaExistente = productosTazas.some(producto => producto.nombre === nombre);
            if (tazaExistente) {
                alert('La taza ya existe.');
                return;
            }
            productosTazas.push({
                nombre: nombre,
                precio: `${precio} ARS`,
                imagen: reader.result
            });
            localStorage.setItem('productosTazas', JSON.stringify(productosTazas));
            cargarProductos(); // Recargar productos después de agregar
            alert('Taza agregada con éxito');
            document.getElementById('form-tazas').reset();
        };
        reader.readAsDataURL(imagen);
    }
});

document.getElementById('form-tazones').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-tazon').value;
    const precio = document.getElementById('precio-tazon').value;
    const imagen = document.getElementById('imagen-tazon').files[0];
    const color = document.getElementById('color-tazon').value;

    if (nombre && precio && imagen && color) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const productosTazones = JSON.parse(localStorage.getItem('productosTazones')) || [];
            const tazonExistente = productosTazones.some(producto => producto.nombre === nombre && producto.color === color);
            if (tazonExistente) {
                alert('El tazón ya existe con el mismo nombre y color.');
                return;
            }
            productosTazones.push({
                nombre: nombre,
                precio: `${precio} ARS`,
                imagen: reader.result,
                color: color
            });
            localStorage.setItem('productosTazones', JSON.stringify(productosTazones));
            cargarProductos(); // Recargar productos después de agregar
            alert('Tazón agregado con éxito');
            document.getElementById('form-tazones').reset();
        };
        reader.readAsDataURL(imagen);
    }
});

function cargarProductos() {
    // Cargar tazas
    const productosTazas = JSON.parse(localStorage.getItem('productosTazas')) || [];
    const contenedorTazas = document.getElementById('productos-tazas-admin');
    contenedorTazas.innerHTML = '';
    productosTazas.forEach((producto, index) => {
        const div = document.createElement('div');
        div.className = 'producto-admin';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.nombre}</p>
            <p>${producto.precio}</p>
            <button onclick="modificarProducto('tazas', ${index})">Modificar</button>
            <button onclick="eliminarProducto('tazas', ${index})">Eliminar</button>
        `;
        contenedorTazas.appendChild(div);
    });

    // Cargar tazones
    const productosTazones = JSON.parse(localStorage.getItem('productosTazones')) || [];
    const contenedorTazones = document.getElementById('productos-tazones-admin');
    contenedorTazones.innerHTML = '';
    productosTazones.forEach((producto, index) => {
        const div = document.createElement('div');
        div.className = 'producto-admin';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>${producto.nombre}</p>
            <p>${producto.precio}</p>
            <p>Color: ${producto.color}</p>
            <button onclick="modificarProducto('tazones', ${index})">Modificar</button>
            <button onclick="eliminarProducto('tazones', ${index})">Eliminar</button>
        `;
        contenedorTazones.appendChild(div);
    });
}

function modificarProducto(tipo, index) {
    const productos = JSON.parse(localStorage.getItem(`productos${capitalize(tipo)}`)) || [];
    const producto = productos[index];
    if (tipo === 'tazas') {
        document.getElementById('nombre-taza').value = producto.nombre;
        document.getElementById('precio-taza').value = producto.precio.replace(' ARS', '');
        // No se puede modificar la imagen de manera directa, deberías permitir subir una nueva
    } else if (tipo === 'tazones') {
        document.getElementById('nombre-tazon').value = producto.nombre;
        document.getElementById('precio-tazon').value = producto.precio.replace(' ARS', '');
        document.getElementById('color-tazon').value = producto.color;
        // No se puede modificar la imagen de manera directa, deberías permitir subir una nueva
    }
    // Aquí podrías permitir modificar directamente en el formulario y volver a guardar
    // Además, podrías implementar una lógica para eliminar el producto viejo y agregar el modificado
}

function eliminarProducto(tipo, index) {
    const productos = JSON.parse(localStorage.getItem(`productos${capitalize(tipo)}`)) || [];
    productos.splice(index, 1);
    localStorage.setItem(`productos${capitalize(tipo)}`, JSON.stringify(productos));
    cargarProductos(); // Recargar productos después de eliminar
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Cargar productos al cargar la página
cargarProductos();
