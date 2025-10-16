// Mostrar formularios para añadir datos a la enciclopedia, escape room, etc.
// admin.js - Panel de administración para TRON Encyclopedia

class TRONAdmin {
    constructor() {
        this.currentUser = null;
        this.editingItem = null;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadInitialData();
    }

    // Verificar autenticación del administrador
    checkAuthentication() {
        const adminUser = localStorage.getItem('adminUser');
        const adminPass = localStorage.getItem('adminPass');
        
        if (adminUser !== 'ADMIN' || adminPass !== 'ADMIN') {
            window.location.href = 'acceso-denegado.html';
            return;
        }
        
        this.currentUser = 'ADMIN';
    }

    // Configurar event listeners
    setupEventListeners() {
        // Navegación
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Cerrar sesión
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Formularios
        this.setupFormListeners();
        
        // Modal
        this.setupModalListeners();
        
        // Upload de imágenes
        this.setupGalleryListeners();
    }

    // Mostrar sección específica
    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        document.getElementById(sectionId).classList.add('active');
        
        // Actualizar navegación
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Actualizar título
        document.getElementById('section-title').textContent = 
            document.querySelector(`[data-section="${sectionId}"]`).textContent;
        
        // Cargar datos específicos de la sección
        this.loadSectionData(sectionId);
    }

    // Configurar listeners de formularios
    setupFormListeners() {
        // Formulario de enciclopedia
        document.getElementById('enciclopedia-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEnciclopediaItem();
        });

        // Reset formulario enciclopedia
        document.getElementById('reset-form').addEventListener('click', () => {
            this.resetEnciclopediaForm();
        });

        // Formulario escape room
        document.getElementById('escape-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEscapeQuestion();
        });

        // Reset formulario escape room
        document.getElementById('reset-escape-form').addEventListener('click', () => {
            this.resetEscapeForm();
        });

        // Tipo de pregunta cambia
        document.getElementById('tipo-pregunta-select').addEventListener('change', (e) => {
            this.updateQuestionType(e.target.value);
        });

        // Formulario configuración
        document.getElementById('settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Búsqueda de artículos
        document.getElementById('search-articles').addEventListener('input', (e) => {
            this.searchArticles(e.target.value);
        });
    }

    // Configurar modal
    setupModalListeners() {
        const modal = document.getElementById('confirm-modal');
        const cancelBtn = document.getElementById('modal-cancel');
        
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Configurar galería
    setupGalleryListeners() {
        const uploadBox = document.getElementById('upload-box');
        const fileInput = document.getElementById('file-input');
        
        uploadBox.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.backgroundColor = '';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.backgroundColor = '';
            const files = e.dataTransfer.files;
            this.handleImageUpload(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });
    }

    // Cargar datos iniciales
    loadInitialData() {
        this.loadEnciclopediaItems();
        this.loadEscapeQuestions();
        this.loadUsers();
        this.loadGallery();
        this.loadCharts();
    }

    // Cargar datos del dashboard
    loadDashboardData() {
        // Simular datos del dashboard
        const stats = {
            users: 1542,
            content: 87,
            escapePlays: 423,
            activeUsers: 23
        };
        
        document.getElementById('total-users').textContent = stats.users;
        document.getElementById('total-content').textContent = stats.content;
        document.getElementById('escape-plays').textContent = stats.escapePlays;
        document.getElementById('active-now').textContent = stats.activeUsers;
        
        this.loadRecentActivity();
    }

    // Cargar actividad reciente
    loadRecentActivity() {
        const activities = [
            { action: 'Nuevo artículo añadido', user: 'Admin', time: 'Hace 5 minutos' },
            { action: 'Usuario registrado', user: 'flynn1982', time: 'Hace 15 minutos' },
            { action: 'Partida de Escape Room completada', user: 'tron_fan', time: 'Hace 30 minutos' },
            { action: 'Imagen subida a la galería', user: 'Admin', time: 'Hace 1 hora' },
            { action: 'Artículo actualizado', user: 'Admin', time: 'Hace 2 horas' }
        ];
        
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon"></div>
                <div class="activity-content">
                    <div>${activity.action}</div>
                    <div class="activity-time">Por ${activity.user} • ${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Cargar datos específicos de sección
    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'enciclopedia':
                this.loadEnciclopediaItems();
                break;
            case 'escape-room':
                this.loadEscapeQuestions();
                break;
            case 'usuarios':
                this.loadUsers();
                break;
            case 'galeria':
                this.loadGallery();
                break;
            case 'estadisticas':
                this.loadCharts();
                break;
            case 'configuracion':
                this.loadSettings();
                break;
        }
    }

    // Cargar artículos de la enciclopedia
    loadEnciclopediaItems() {
        // Simular carga de artículos
        const articles = [
            { id: 1, titulo: 'Kevin Flynn', pelicula: 'tron-1982', categoria: 'personajes', estado: 'publicado' },
            { id: 2, titulo: 'Light Cycles', pelicula: 'tron-1982', categoria: 'tecnologia', estado: 'publicado' },
            { id: 3, titulo: 'Sam Flynn', pelicula: 'tron-legacy', categoria: 'personajes', estado: 'borrador' }
        ];
        
        const container = document.getElementById('articles-container');
        container.innerHTML = articles.map(article => `
            <div class="article-card">
                <div class="article-header">
                    <div class="article-title">${article.titulo}</div>
                    <div class="article-meta">${this.getPeliculaName(article.pelicula)}</div>
                </div>
                <div class="article-meta">${this.getCategoriaName(article.categoria)} • ${article.estado}</div>
                <div class="article-actions">
                    <button class="btn btn-secondary" onclick="admin.editArticle(${article.id})">Editar</button>
                    <button class="btn btn-danger" onclick="admin.deleteArticle(${article.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    // Guardar artículo de enciclopedia
    saveEnciclopediaItem() {
        const formData = {
            pelicula: document.getElementById('pelicula-select').value,
            categoria: document.getElementById('categoria-select').value,
            titulo: document.getElementById('titulo-input').value,
            descripcion: document.getElementById('descripcion-textarea').value,
            imagen: document.getElementById('imagen-input').value,
            estado: document.getElementById('estado-select').value
        };
        
        // Validación básica
        if (!formData.titulo || !formData.descripcion) {
            this.showNotification('Por favor, completa todos los campos requeridos', 'error');
            return;
        }
        
        if (this.editingItem) {
            // Editar artículo existente
            this.showNotification('Artículo actualizado correctamente', 'success');
        } else {
            // Nuevo artículo
            this.showNotification('Artículo creado correctamente', 'success');
        }
        
        this.resetEnciclopediaForm();
        this.loadEnciclopediaItems();
    }

    // Editar artículo
    editArticle(id) {
        // Simular carga de datos del artículo
        const article = {
            id: id,
            pelicula: 'tron-1982',
            categoria: 'personajes',
            titulo: 'Kevin Flynn',
            descripcion: 'Programador y creador del Grid...',
            imagen: '',
            estado: 'publicado'
        };
        
        document.getElementById('pelicula-select').value = article.pelicula;
        document.getElementById('categoria-select').value = article.categoria;
        document.getElementById('titulo-input').value = article.titulo;
        document.getElementById('descripcion-textarea').value = article.descripcion;
        document.getElementById('imagen-input').value = article.imagen;
        document.getElementById('estado-select').value = article.estado;
        
        this.editingItem = id;
        this.showNotification('Editando artículo...', 'info');
    }

    // Eliminar artículo
    deleteArticle(id) {
        this.showConfirmModal(
            'Eliminar Artículo',
            '¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.',
            () => {
                this.showNotification('Artículo eliminado correctamente', 'success');
                this.loadEnciclopediaItems();
            }
        );
    }

    // Reset formulario enciclopedia
    resetEnciclopediaForm() {
        document.getElementById('enciclopedia-form').reset();
        this.editingItem = null;
    }

    // Buscar artículos
    searchArticles(query) {
        // Implementar búsqueda
        console.log('Buscando:', query);
    }

    // Cargar preguntas del escape room
    loadEscapeQuestions() {
        // Simular carga de preguntas
        const questions = [
            { id: 1, pregunta: '¿Quién creó el MCP?', nivel: 1, tipo: 'multiple', puntos: 10 },
            { id: 2, pregunta: 'Código de desactivación', nivel: 2, tipo: 'codigo', puntos: 20 },
            { id: 3, pregunta: 'Describe la función de los Light Cycles', nivel: 3, tipo: 'texto', puntos: 15 }
        ];
        
        const tbody = document.getElementById('questions-tbody');
        tbody.innerHTML = questions.map(q => `
            <tr>
                <td>${q.id}</td>
                <td>${q.pregunta}</td>
                <td>Nivel ${q.nivel}</td>
                <td>${this.getTipoPreguntaName(q.tipo)}</td>
                <td>${q.puntos}</td>
                <td class="table-actions">
                    <button class="btn btn-secondary" onclick="admin.editQuestion(${q.id})">Editar</button>
                    <button class="btn btn-danger" onclick="admin.deleteQuestion(${q.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    // Actualizar tipo de pregunta
    updateQuestionType(tipo) {
        const container = document.getElementById('opciones-container');
        
        switch(tipo) {
            case 'multiple':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Opciones (separadas por |)</label>
                        <input type="text" class="form-input" id="opciones-input" placeholder="Opción 1|Opción 2|Opción 3">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Respuesta Correcta</label>
                        <input type="text" class="form-input" id="respuesta-correcta-input">
                    </div>
                `;
                break;
            case 'texto':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Respuesta Esperada</label>
                        <input type="text" class="form-input" id="respuesta-esperada-input">
                    </div>
                `;
                break;
            case 'codigo':
                container.innerHTML = `
                    <div class="form-group">
                        <label class="form-label">Código Correcto</label>
                        <input type="text" class="form-input" id="codigo-correcto-input">
                    </div>
                `;
                break;
            default:
                container.innerHTML = '';
        }
    }

    // Guardar pregunta del escape room
    saveEscapeQuestion() {
        const formData = {
            nivel: document.getElementById('nivel-select').value,
            tipo: document.getElementById('tipo-pregunta-select').value,
            pregunta: document.getElementById('pregunta-textarea').value,
            puntos: document.getElementById('puntos-input').value,
            tiempo: document.getElementById('tiempo-input').value
        };
        
        // Validación
        if (!formData.pregunta) {
            this.showNotification('La pregunta es requerida', 'error');
            return;
        }
        
        this.showNotification('Pregunta guardada correctamente', 'success');
        this.resetEscapeForm();
        this.loadEscapeQuestions();
    }

    // Editar pregunta
    editQuestion(id) {
        // Simular carga de datos
        this.showNotification('Editando pregunta...', 'info');
    }

    // Eliminar pregunta
    deleteQuestion(id) {
        this.showConfirmModal(
            'Eliminar Pregunta',
            '¿Estás seguro de que quieres eliminar esta pregunta?',
            () => {
                this.showNotification('Pregunta eliminada correctamente', 'success');
                this.loadEscapeQuestions();
            }
        );
    }

    // Reset formulario escape room
    resetEscapeForm() {
        document.getElementById('escape-form').reset();
        document.getElementById('opciones-container').innerHTML = '';
    }

    // Cargar usuarios
    loadUsers() {
        // Simular carga de usuarios
        const users = [
            { id: 1, usuario: 'flynn1982', email: 'flynn@encom.com', registro: '2023-01-15', estado: 'activo' },
            { id: 2, usuario: 'tron_fan', email: 'fan@tron.com', registro: '2023-02-20', estado: 'activo' },
            { id: 3, usuario: 'grid_explorer', email: 'explorer@grid.com', registro: '2023-03-10', estado: 'inactivo' }
        ];
        
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td>${user.registro}</td>
                <td><span class="status-${user.estado}">${user.estado}</span></td>
                <td class="table-actions">
                    <button class="btn btn-secondary">Editar</button>
                    <button class="btn btn-warning">${user.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
                </td>
            </tr>
        `).join('');
    }

    // Cargar galería
    loadGallery() {
        // Simular carga de imágenes
        const images = [
            { id: 1, url: 'assets/images/grid1.jpg', nombre: 'Grid Overview' },
            { id: 2, url: 'assets/images/lightcycle.jpg', nombre: 'Light Cycle' },
            { id: 3, url: 'assets/images/recognizer.jpg', nombre: 'Recognizer' }
        ];
        
        const container = document.getElementById('gallery-container');
        container.innerHTML = images.map(img => `
            <div class="gallery-item">
                <img src="${img.url}" alt="${img.nombre}" class="gallery-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAzMzQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwZjBmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                <div class="gallery-actions">
                    <button class="btn btn-danger" onclick="admin.deleteImage(${img.id})">×</button>
                </div>
            </div>
        `).join('');
    }

    // Manejar upload de imágenes
    handleImageUpload(files) {
        if (files.length === 0) return;
        
        // Simular upload
        this.showNotification(`Subiendo ${files.length} imagen(es)...`, 'info');
        
        setTimeout(() => {
            this.showNotification('Imágenes subidas correctamente', 'success');
            this.loadGallery();
        }, 2000);
    }

    // Eliminar imagen
    deleteImage(id) {
        this.showConfirmModal(
            'Eliminar Imagen',
            '¿Estás seguro de que quieres eliminar esta imagen?',
            () => {
                this.showNotification('Imagen eliminada correctamente', 'success');
                this.loadGallery();
            }
        );
    }

    // Cargar configuración
    loadSettings() {
        // Cargar configuración actual
        document.getElementById('access-key').value = 'universeEnter';
        // ... otros valores de configuración
    }

    // Guardar configuración
    saveSettings() {
        const settings = {
            accessKey: document.getElementById('access-key').value,
            maintenance: document.getElementById('maintenance-mode').value,
            userRegistration: document.getElementById('user-registration').value,
            escapeRoomAccess: document.getElementById('escape-room-access').value
        };
        
        this.showNotification('Configuración guardada correctamente', 'success');
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--admin-green)' : 
                        type === 'error' ? 'var(--admin-red)' : 
                        type === 'warning' ? 'var(--admin-yellow)' : 'var(--tron-blue)'};
            color: ${type === 'warning' ? 'var(--tron-dark)' : 'white'};
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Mostrar modal de confirmación
    showConfirmModal(title, message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        
        const confirmBtn = document.getElementById('modal-confirm');
        confirmBtn.onclick = () => {
            modal.classList.remove('active');
            onConfirm();
        };
        modal.classList.add('active');
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminPass');
        window.location.href = 'index.html';
    }

    // Helper functions
    getPeliculaName(key) {
        const peliculas = {
            'tron-1982': 'TRON (1982)',
            'tron-legacy': 'TRON: Legacy',
            'tron-ares': 'TRON: Ares'
        };
        return peliculas[key] || key;
    }

    getCategoriaName(key) {
        const categorias = {
            'personajes': 'Personajes',
            'tecnologia': 'Tecnología',
            'localizaciones': 'Localizaciones',
            'historia': 'Historia'
        };
        return categorias[key] || key;
    }

    getTipoPreguntaName(key) {
        const tipos = {
            'multiple': 'Opción Múltiple',
            'texto': 'Texto Libre',
            'codigo': 'Código'
        };
        return tipos[key] || key;
    }
}

// Inicializar administración cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new TRONAdmin();
});