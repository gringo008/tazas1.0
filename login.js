// login.js

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Aquí puedes poner tu lógica para verificar las credenciales
    // Por ejemplo, comparar con valores predefinidos para demostración
    if (username === 'gringo008' && password === 'santi2001') {
        window.location.href = 'admin.html'; // Redirige a admin.html si las credenciales son correctas
    } else {
        document.getElementById('error-message').textContent = 'Usuario o contraseña incorrectos.';
    }
});
