const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tron-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambiar a true en producción con HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tron_encyclopedia',
    charset: 'utf8mb4'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('✅ Conectado a la base de datos TRON Encyclopedia');
});

// Hacer la conexión de BD disponible en toda la app
app.locals.db = db;

// Rutas de la API
// Autenticación
app.post('/api/login', require('./routes/auth').login);
app.post('/api/register', require('./routes/auth').register);
app.post('/api/logout', require('./routes/auth').logout);

// Datos de TRON
app.get('/api/peliculas', require('./routes/peliculas').getPeliculas);
app.get('/api/personajes', require('./routes/personajes').getPersonajes);
app.get('/api/tecnologia', require('./routes/tecnologia').getTecnologia);
app.get('/api/localizaciones', require('./routes/localizaciones').getLocalizaciones);

// Juego
app.get('/api/desafios', require('./routes/juego').getDesafios);
app.post('/api/progreso', require('./routes/juego').guardarProgreso);
app.get('/api/leaderboard', require('./routes/juego').getLeaderboard);

// Búsqueda
app.get('/api/buscar', require('./routes/busqueda').buscar);

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/escape-tron', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'escape-tron.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor TRON Encyclopedia ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Panel de administración: http://localhost:${PORT}/admin.html`);
    console.log(`🎮 Juego Escape de TRON: http://localhost:${PORT}/escape-tron`);
});

module.exports = app;
