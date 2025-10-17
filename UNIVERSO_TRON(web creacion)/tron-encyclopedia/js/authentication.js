// Sistema de Autenticación
// Validar login, guardar sesión en localStorage, mostrar errores si falla

class TRONAuth {
    constructor() {
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
        this.setupFormValidation();
    }

    // Verificar si ya existe una sesión activa
    checkExistingSession() {
        const userSession = localStorage.getItem('userSession');
        const adminSession = localStorage.getItem('adminSession');
        
        if (userSession) {
            this.redirectToEscapeRoom();
        } else if (adminSession) {
            this.redirectToAdmin();
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario de login de usuario
        const userLoginForm = document.getElementById('userLoginForm');
        if (userLoginForm) {
            userLoginForm.addEventListener('submit', (e) => this.handleUserLogin(e));
        }

        // Formulario de login de administrador
        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        // Cambio entre pestañas
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Enlace de registro
        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegistrationForm();
            });
        }

        // Botón de olvidé contraseña
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Cerrar notificaciones
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('notification-close')) {
                e.target.parentElement.remove();
            }
        });
    }

    // Configurar validación de formularios
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, introduce un email válido';
                }
                break;
            
            case 'text':
                if (field.id === 'username' && value.length < 3) {
                    isValid = false;
                    errorMessage = 'El usuario debe tener al menos 3 caracteres';
                }
                break;
            
            case 'password':
                if (value.length < 6) {
                    isValid = false;
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                }
                break;
        }

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Manejar login de usuario normal
    async handleUserLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validar campos
        if (!this.validateLoginForm(form)) {
            return;
        }

        // Mostrar loading
        this.showLoading(true, 'user');

        try {
            // Simular verificación de credenciales (en producción sería una API call)
            const isValid = await this.verifyUserCredentials(username, password);
            
            if (isValid) {
                this.createUserSession(username, rememberMe);
                this.showNotification('¡Login exitoso! Redirigiendo al Escape Room...', 'success');
                
                setTimeout(() => {
                    this.redirectToEscapeRoom();
                }, 1500);
            } else {
                this.showNotification('Usuario o contraseña incorrectos', 'error');
                this.recordFailedAttempt();
            }
        } catch (error) {
            this.showNotification('Error de conexión. Intenta nuevamente.', 'error');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false, 'user');
        }
    }

    // Manejar login de administrador
    async handleAdminLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const adminUser = document.getElementById('adminUser').value.trim();
        const adminPass = document.getElementById('adminPass').value.trim();

        // Validar campos
        if (!this.validateLoginForm(form)) {
            return;
        }

        // Mostrar loading
        this.showLoading(true, 'admin');

        try {
            // Verificar credenciales de administrador
            const isValid = await this.verifyAdminCredentials(adminUser, adminPass);
            
            if (isValid) {
                this.createAdminSession(adminUser);
                this.showNotification('¡Acceso administrativo concedido!', 'success');
                
                setTimeout(() => {
                    this.redirectToAdmin();
                }, 1500);
            } else {
                this.showNotification('Credenciales de administrador incorrectas', 'error');
                this.recordFailedAdminAttempt();
            }
        } catch (error) {
            this.showNotification('Error de autenticación administrativa', 'error');
            console.error('Admin login error:', error);
        } finally {
            this.showLoading(false, 'admin');
        }
    }

    // Validar formulario de login completo
    validateLoginForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Verificar credenciales de usuario (simulado)
    async verifyUserCredentials(username, password) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En producción, esto sería una llamada a la API
        const storedUsers = JSON.parse(localStorage.getItem('tronUsers') || '[]');
        
        // Buscar usuario en localStorage
        const user = storedUsers.find(u => 
            (u.username === username || u.email === username) && 
            u.password === this.hashPassword(password)
        );

        return !!user;
    }

    // Verificar credenciales de administrador
    async verifyAdminCredentials(username, password) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Credenciales fijas para administrador
        return username === 'ADMIN' && password === 'ADMIN';
    }

    // Crear sesión de usuario
    createUserSession(username, rememberMe) {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            isAdmin: false
        };

        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        if (rememberMe) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30); // 30 días
            sessionData.expiry = expiryDate.toISOString();
            localStorage.setItem('rememberMe', 'true');
        }

        // Registrar actividad
        this.logUserActivity(username, 'login');
    }

    // Crear sesión de administrador
    createAdminSession(username) {
        const sessionData = {
            username: username,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            isAdmin: true,
            ip: this.getClientIP() // Simulado
        };

        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        localStorage.setItem('adminUser', username);
        localStorage.setItem('adminPass', 'ADMIN');

        // Registrar actividad administrativa
        this.logAdminActivity(username, 'admin_login');
    }

    // Cambiar entre pestañas de login
    switchTab(e) {
        e.preventDefault();
        
        const target = e.target.dataset.tab;
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        // Actualizar botones activos
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === target) {
                btn.classList.add('active');
            }
        });

        // Mostrar panel activo
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `${target}Tab`) {
                pane.classList.add('active');
            }
        });

        // Limpiar formularios al cambiar de pestaña
        this.clearForms();
    }

    // Mostrar formulario de registro
    showRegistrationForm() {
        window.location.href = 'acceso-registro.html';
    }

    // Manejar olvidé contraseña
    handleForgotPassword() {
        const email = prompt('Introduce tu email para recuperar la contraseña:');
        
        if (email && this.isValidEmail(email)) {
            this.showNotification('Se ha enviado un enlace de recuperación a tu email', 'info');
            
            // Simular envío de email
            setTimeout(() => {
                this.showNotification('Enlace de recuperación enviado correctamente', 'success');
            }, 2000);
        } else if (email) {
            this.showNotification('Email no válido', 'error');
        }
    }

    // Mostrar/ocultar loading
    showLoading(show, type) {
        const button = document.querySelector(`#${type}LoginForm .login-btn`);
        const originalText = button.textContent;
        
        if (show) {
            button.disabled = true;
            button.innerHTML = '<div class="loading-spinner"></div> Procesando...';
        } else {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification.parentElement) {
                notification.remove();
            }
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;

        // Estilos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minWidth: '300px',
            maxWidth: '90vw'
        });

        document.body.appendChild(notification);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Mostrar error en campo específico
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#ff4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        `;
        
        field.parentElement.appendChild(errorElement);
    }

    // Limpiar error de campo
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Limpiar formularios
    clearForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => input.style.borderColor = '');
        });
    }

    // Redirecciones
    redirectToEscapeRoom() {
        window.location.href = 'escapeoftron.html';
    }

    redirectToAdmin() {
        window.location.href = 'admin.html';
    }

    // Utilidades
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hashPassword(password) {
        // En producción, usaría una librería de hashing como bcrypt
        // Esta es una implementación básica solo para demostración
        return btoa(password); // No usar en producción
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    getClientIP() {
        // Simulado - en producción se obtendría del servidor
        return '192.168.1.' + Math.floor(Math.random() * 255);
    }

    getNotificationColor(type) {
        const colors = {
            success: '#00ff88',
            error: '#ff4444',
            warning: '#ffcc00',
            info: '#00f0ff'
        };
        return colors[type] || colors.info;
    }

    // Registrar intentos fallidos (prevención de fuerza bruta)
    recordFailedAttempt() {
        let attempts = parseInt(localStorage.getItem('failedAttempts') || '0');
        attempts++;
        localStorage.setItem('failedAttempts', attempts.toString());
        localStorage.setItem('lastFailedAttempt', new Date().toISOString());

        if (attempts >= 5) {
            this.showNotification('Demasiados intentos fallidos. Espera 15 minutos.', 'warning');
            setTimeout(() => {
                localStorage.setItem('failedAttempts', '0');
            }, 15 * 60 * 1000); // 15 minutos
        }
    }

    recordFailedAdminAttempt() {
        let adminAttempts = parseInt(localStorage.getItem('failedAdminAttempts') || '0');
        adminAttempts++;
        localStorage.setItem('failedAdminAttempts', adminAttempts.toString());

        if (adminAttempts >= 3) {
            this.showNotification('Acceso administrativo bloqueado temporalmente', 'error');
            const adminForm = document.getElementById('adminLoginForm');
            if (adminForm) {
                adminForm.style.display = 'none';
                setTimeout(() => {
                    adminForm.style.display = 'block';
                    localStorage.setItem('failedAdminAttempts', '0');
                }, 30 * 60 * 1000); // 30 minutos
            }
        }
    }

    // Log de actividad (simulado)
    logUserActivity(username, action) {
        const log = {
            username: username,
            action: action,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        let activityLog = JSON.parse(localStorage.getItem('userActivityLog') || '[]');
        activityLog.push(log);
        
        // Mantener solo los últimos 100 registros
        if (activityLog.length > 100) {
            activityLog = activityLog.slice(-100);
        }
        
        localStorage.setItem('userActivityLog', JSON.stringify(activityLog));
    }

    logAdminActivity(username, action) {
        const log = {
            username: username,
            action: action,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP()
        };

        let adminLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
        adminLog.push(log);
        
        if (adminLog.length > 50) {
            adminLog = adminLog.slice(-50);
        }
        
        localStorage.setItem('adminActivityLog', JSON.stringify(adminLog));
    }
}

// Inicializar sistema de autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en una página de autenticación
    if (document.querySelector('.auth-container')) {
        window.tronAuth = new TRONAuth();
    }
});

// CSS para el loading spinner (se puede mover a un archivo CSS separado)
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .field-error {
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: 0.3rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);