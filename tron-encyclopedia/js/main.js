// main.js - Funcionalidades principales para TRON Encyclopedia

document.addEventListener('DOMContentLoaded', function() {
    console.log('TRON Encyclopedia - Sistema inicializado');
    
    inicializarNavegacion();
    inicializarComponentesComunes();
    cargarContenidoDinamico();
    verificarEstadoUsuario();
});

// Sistema de navegación inteligente
function inicializarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link, nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Marcar enlace activo
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'inicio.html') ||
            (currentPage.includes('t-') && linkHref && linkHref.includes(currentPage))) {
            link.classList.add('nav-active');
            link.classList.add('active');
        }
        
        // Prevenir navegación por defecto para enlaces internos
        if (linkHref && linkHref.endsWith('.html') && !linkHref.startsWith('http')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('href');
                console.log(`Navegando a: ${targetPage}`);
                window.location.href = targetPage;
            });
        }
    });
}

// Componentes comunes a todas las páginas
function inicializarComponentesComunes() {
    inicializarBuscador();
    inicializarEfectosTRON();
    inicializarModales();
    inicializarFiltros();
}

// Sistema de búsqueda global
function inicializarBuscador() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.trim();
            if (term.length > 2) {
                debouncedSearch(term);
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                ejecutarBusqueda(this.value.trim());
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const term = searchInput ? searchInput.value.trim() : '';
            if (term) {
                ejecutarBusqueda(term);
            }
        });
    }
}

// Debounce para búsquedas
function debouncedSearch(term) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
        ejecutarBusqueda(term);
    }, 500);
}

// Ejecutar búsqueda
function ejecutarBusqueda(termino) {
    if (termino) {
        window.location.href = `search.html?q=${encodeURIComponent(termino)}`;
    }
}

// Efectos visuales estilo TRON
function inicializarEfectosTRON() {
    // Efecto en tarjetas
    const cards = document.querySelectorAll('.movie-card, .character-card, .tech-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0, 255, 255, 0.4)';
            this.style.borderColor = '#00ffff';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 255, 255, 0.2)';
            this.style.borderColor = '#0080ff';
        });
    });
    
    // Efecto en botones
    const buttons = document.querySelectorAll('.btn-tron, .tron-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, #00ffff, #0080ff)';
            this.style.textShadow = '0 0 10px #00ffff';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(45deg, #0080ff, #0040ff)';
            this.style.textShadow = 'none';
        });
    });
}

// Sistema de modales para imágenes
function inicializarModales() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.modal-close');
    
    if (modal && modalImg) {
        // Abrir modal al hacer click en imágenes expandibles
        document.querySelectorAll('.expandable-image').forEach(img => {
            img.addEventListener('click', function() {
                modalImg.src = this.src;
                modalImg.alt = this.alt;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Cerrar modal
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Sistema de filtros
function inicializarFiltros() {
    const filterButtons = document.querySelectorAll('.filter-btn, [data-filter]');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter') || this.getAttribute('data-category');
            
            // Actualizar botones activos
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            aplicarFiltro(filterValue);
        });
    });
}

function aplicarFiltro(categoria) {
    const elementos = document.querySelectorAll('[data-category], .filterable');
    
    elementos.forEach(elemento => {
        if (categoria === 'all' || elemento.getAttribute('data-category') === categoria) {
            elemento.style.display = 'block';
            setTimeout(() => {
                elemento.style.opacity = '1';
                elemento.style.transform = 'scale(1)';
            }, 50);
        } else {
            elemento.style.opacity = '0';
            elemento.style.transform = 'scale(0.8)';
            setTimeout(() => {
                elemento.style.display = 'none';
            }, 300);
        }
    });
}

// Verificar estado de autenticación
function verificarEstadoUsuario() {
    const token = localStorage.getItem('tron_user_token');
    const userSection = document.getElementById('user-section');
    const guestSection = document.getElementById('guest-section');
    
    if (token) {
        // Usuario autenticado
        if (userSection) userSection.style.display = 'block';
        if (guestSection) guestSection.style.display = 'none';
        
        // Mostrar enlace a Escape Room
        const escapeRoomLink = document.querySelector('[href="escape-room.html"]');
        if (escapeRoomLink) {
            escapeRoomLink.style.display = 'block';
        }
    } else {
        // Usuario invitado
        if (userSection) userSection.style.display = 'none';
        if (guestSection) guestSection.style.display = 'block';
    }
}

// Cargar contenido dinámico según la página
function cargarContenidoDinamico() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'inicio.html':
        case 'index.html':
            inicializarTimeline();
            cargarEstadisticas();
            break;
        case 't-1982.html':
            cargarContenidoPelicula('tron-1982');
            break;
        case 't-legacy.html':
            cargarContenidoPelicula('tron-legacy');
            break;
        case 't-ares.html':
            cargarContenidoPelicula('tron-ares');
        break;
         case 'galeria.html':
        inicializarGaleria();
        break;
    }

// Nueva función específica para Ares
function inicializarGaleriaAres() {
    console.log('Inicializando galería especial de TRON: Ares');
    
    // Galería específica con escenas de la película
    const escenasAres = [
        {
            titulo: "La Llegada de Ares",
            imagen: "../images/ares/arrival-scene.jpg",
            descripcion: "Momento en que Ares emerge del portal cuántico"
        },
        {
            titulo: "Batalla Dimensional",
            imagen: "../images/ares/battle-scene.jpg", 
            descripcion: "Conflicto en el Grid actualizado"
        },
        {
            titulo: "Encuentro Humano-Digital",
            imagen: "../images/ares/human-connection.jpg",
            descripcion: "Ares experimentando emociones humanas"
        }
    ];
    
    // Cargar galería dinámica si existe
    const galeriaContainer = document.getElementById('galeria-ares');
    if (galeriaContainer) {
        galeriaContainer.innerHTML = escenasAres.map(escena => `
            <div class="gallery-item">
                <img src="${escena.imagen}" alt="${escena.titulo}" class="expandable-image">
                <div class="gallery-caption">
                    <h4>${escena.titulo}</h4>
                    <p>${escena.descripcion}</p>
                </div>
            </div>
        `).join('');
    }
}
}

// Timeline interactivo
function inicializarTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const movie = this.getAttribute('data-movie');
            
            timelineItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Navegar a la película
            window.location.href = `${movie}.html`;
        });
    });
}

// Cargar estadísticas
function cargarEstadisticas() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            const statsContainer = document.getElementById('stats-container');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <h3>${data.personajes || 28}</h3>
                        <p>Personajes</p>
                    </div>
                    <div class="stat-card">
                        <h3>${data.tecnologias || 15}</h3>
                        <p>Tecnologías</p>
                    </div>
                    <div class="stat-card">
                        <h3>${data.vehiculos || 12}</h3>
                        <p>Vehículos</p>
                    </div>
                    <div class="stat-card">
                        <h3>${data.localizaciones || 8}</h3>
                        <p>Localizaciones</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error cargando estadísticas:', error);
        });
}

// Inicializar galería
function inicializarGaleria() {
    console.log('Galería TRON inicializada');
    // Funcionalidad específica de la galería
}

// Utilidades
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Exportar para Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        inicializarNavegacion,
        ejecutarBusqueda,
        aplicarFiltro,
        verificarEstadoUsuario
    };
}