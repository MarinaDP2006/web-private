// Sistema de autenticación
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    setupAuthModals();
    setupAuthForms();
}

function setupAuthModals() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeModals = document.querySelectorAll('.close-modal');

    // Abrir modales
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
    });

    // Cerrar modales
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Cerrar al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
}

function setupAuthForms() {
    // Formulario de login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // Formulario de registro
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });

    // Botón de logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
}

function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Validación básica
    if (!username || !password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    // Simular autenticación
    const users = JSON.parse(localStorage.getItem('tronUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user || (username === 'ADMIN' && password === 'ADMIN')) {
        let userData;
        
        if (username === 'ADMIN' && password === 'ADMIN') {
            userData = {
                username: 'ADMIN',
                email: 'admin@tron.com',
                role: 'admin',
                joinDate: new Date().toISOString()
            };
        } else {
            userData = user;
        }

        // Guardar sesión
        localStorage.setItem('tronUser', JSON.stringify(userData));
        
        // Cerrar modal y actualizar UI
        document.getElementById('login-modal').style.display = 'none';
        updateUIForLoggedInUser(userData);
        
        showNotification(`¡Bienvenido al Grid, ${username}!`, 'success');
        
        // Limpiar formulario
        document.getElementById('login-form').reset();
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}

function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    // Validaciones
    if (!username || !email || !password || !confirm) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }

    if (password !== confirm) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('tronUsers')) || [];
    if (users.find(u => u.username === username)) {
        showNotification('El nombre de usuario ya está en uso', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('El email ya está registrado', 'error');
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        username,
        email,
        password,
        role: 'user',
        joinDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('tronUsers', JSON.stringify(users));

    // Iniciar sesión automáticamente
    localStorage.setItem('tronUser', JSON.stringify(newUser));
    
    // Cerrar modal y actualizar UI
    document.getElementById('register-modal').style.display = 'none';
    updateUIForLoggedInUser(newUser);
    
    showNotification(`¡Cuenta creada exitosamente! Bienvenido, ${username}`, 'success');
    
    // Limpiar formulario
    document.getElementById('register-form').reset();
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.background = 'var(--secondary-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}