// Datos de ejemplo para la enciclopedia
const featuredContent = [
    {
        id: 1,
        title: "Light Cycles",
        description: "Los icónicos vehículos que dejan un rastro de luz impenetrable.",
        category: "Tecnología",
        movie: "TRON 1982",
        image: "https://via.placeholder.com/300x200/1a1a2a/00ffff?text=Light+Cycle"
    },
    {
        id: 2,
        title: "Kevin Flynn",
        description: "El creador del Grid y protagonista de la primera película.",
        category: "Personaje",
        movie: "TRON 1982",
        image: "https://via.placeholder.com/300x200/1a1a2a/ff0080?text=Kevin+Flynn"
    },
    {
        id: 3,
        title: "Identity Discs",
        description: "Los discos que contienen la esencia y memoria de los programas.",
        category: "Tecnología",
        movie: "TRON 1982",
        image: "https://via.placeholder.com/300x200/1a1a2a/ffff00?text=Identity+Disc"
    },
    {
        id: 4,
        title: "The Grid",
        description: "El mundo digital creado por Kevin Flynn en TRON: Legacy.",
        category: "Localización",
        movie: "TRON: Legacy",
        image: "https://via.placeholder.com/300x200/1a1a2a/00ff00?text=The+Grid"
    }
];

// Estadísticas iniciales
const stats = {
    characters: 45,
    technology: 32,
    locations: 18,
    images: 127
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFeaturedContent();
    loadStats();
    setupEventListeners();
    checkUserStatus();
}

function loadFeaturedContent() {
    const grid = document.getElementById('featured-grid');
    
    featuredContent.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${item.image}')"></div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-footer">
                    <span class="tag">${item.category}</span>
                    <span class="tag">${item.movie}</span>
                    <button class="btn btn-primary" onclick="viewItem(${item.id})">Ver más</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function loadStats() {
    // Animar contadores
    animateCounter('characters-count', stats.characters);
    animateCounter('technology-count', stats.technology);
    animateCounter('locations-count', stats.locations);
    animateCounter('images-count', stats.images);
}

function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

function setupEventListeners() {
    // Botón de exploración
    document.getElementById('explore-btn').addEventListener('click', function() {
        scrollToSection('.timeline-section');
    });
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewItem(id) {
    const item = featuredContent.find(i => i.id === id);
    if (item) {
        alert(`Ver detalles de: ${item.title}\n\n${item.description}\n\nCategoría: ${item.category}\nPelícula: ${item.movie}`);
    }
}

function checkUserStatus() {
    const user = JSON.parse(localStorage.getItem('tronUser'));
    if (user) {
        updateUIForLoggedInUser(user);
    }
}

function updateUIForLoggedInUser(user) {
    // Ocultar botones de login/registro
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('register-btn').style.display = 'none';
    
    // Mostrar información del usuario
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    usernameDisplay.textContent = user.username;
    if (user.role === 'admin') {
        usernameDisplay.innerHTML += ' <span class="admin-badge">ADMIN</span>';
    }
    
    userInfo.style.display = 'flex';
    
    // Mostrar sección Escape de TRON
    document.getElementById('escape-menu').style.display = 'block';
}

// Función global para logout
window.logout = function() {
    localStorage.removeItem('tronUser');
    location.reload();
};