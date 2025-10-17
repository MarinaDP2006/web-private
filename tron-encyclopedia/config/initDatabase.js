const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tron_encyclopedia',
  multipleStatements: true // Permite ejecutar múltiples sentencias SQL
};

// Crear conexión
const connection = mysql.createConnection(dbConfig);

// Enlace a la base de datos: http://localhost/phpmyadmin/index.php?route=/database/structure&db=tron_encyclopedia

// Función para inicializar la base de datos
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    connection.connect(async (err) => {
      if (err) {
        console.error('Error conectando a MySQL:', err);
        reject(err);
        return;
      }

      console.log('Conectado a MySQL correctamente');

      try {
        // Crear la base de datos si no existe
        await createDatabase();
        
        // Usar la base de datos
        await useDatabase();
        
        // Crear tablas
        await createTables();
        
        // Insertar datos iniciales
        await insertInitialData();
        
        console.log('Base de datos inicializada correctamente');
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

function createDatabase() {
  return new Promise((resolve, reject) => {
    const createDBQuery = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`;
    
    connection.query(createDBQuery, (err, results) => {
      if (err) {
        console.error('Error creando la base de datos:', err);
        reject(err);
        return;
      }
      console.log('Base de datos verificada/creada correctamente');
      resolve(results);
    });
  });
}

function useDatabase() {
  return new Promise((resolve, reject) => {
    const useDBQuery = `USE ${dbConfig.database}`;
    
    connection.query(useDBQuery, (err, results) => {
      if (err) {
        console.error('Error seleccionando la base de datos:', err);
        reject(err);
        return;
      }
      console.log('Usando base de datos:', dbConfig.database);
      resolve(results);
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const createTablesQuery = `
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'user') DEFAULT 'user',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT TRUE
      );

      -- Tabla de películas
      CREATE TABLE IF NOT EXISTS peliculas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        año YEAR,
        director VARCHAR(100),
        sinopsis TEXT,
        duracion INT,
        imagen_url VARCHAR(255),
        fecha_estreno DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de personajes
      CREATE TABLE IF NOT EXISTS personajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        actor VARCHAR(100),
        pelicula_id INT,
        tipo ENUM('protagonista', 'antagonista', 'secundario'),
        imagen_url VARCHAR(255),
        historia TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE SET NULL
      );

      -- Tabla de tecnología
      CREATE TABLE IF NOT EXISTS tecnologia (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo ENUM('vehiculo', 'dispositivo', 'sistema', 'otros'),
        descripcion TEXT,
        pelicula_id INT,
        funcion TEXT,
        imagen_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE SET NULL
      );

      -- Tabla de localizaciones
      CREATE TABLE IF NOT EXISTS localizaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo ENUM('grid', 'mundo_real', 'sistema'),
        descripcion TEXT,
        pelicula_id INT,
        importancia ENUM('alta', 'media', 'baja') DEFAULT 'media',
        imagen_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE SET NULL
      );

      -- Tabla de galería
      CREATE TABLE IF NOT EXISTS galeria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100),
        descripcion TEXT,
        url_imagen VARCHAR(255) NOT NULL,
        categoria ENUM('personajes', 'tecnologia', 'localizaciones', 'vehiculos', 'escenas'),
        pelicula_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE SET NULL
      );

      -- Tabla para el juego Escape Room
      CREATE TABLE IF NOT EXISTS escape_room_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        tiempo_segundos INT,
        puntuacion INT,
        nivel_alcanzado INT DEFAULT 1,
        fecha_juego TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );

      -- Tabla de búsquedas (historial)
      CREATE TABLE IF NOT EXISTS busquedas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        termino_busqueda VARCHAR(255),
        resultados INT,
        fecha_busqueda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
      );
    `;

    connection.query(createTablesQuery, (err, results) => {
      if (err) {
        console.error('Error creando las tablas:', err);
        reject(err);
        return;
      }
      console.log('Tablas creadas/verificadas correctamente');
      resolve(results);
    });
  });
}

function insertInitialData() {
  return new Promise((resolve, reject) => {
    const initialDataQuery = `
      -- Insertar películas
      INSERT IGNORE INTO peliculas (titulo, año, director, sinopsis, duracion) VALUES
      ('TRON', 1982, 'Steven Lisberger', 'Un programador es absorbido por el mundo digital de una computadora donde debe participar en juegos mortales.', 96),
      ('TRON: El Legado', 2010, 'Joseph Kosinski', 'El hijo de Kevin Flynn se adentra en el Grid para encontrar a su padre desaparecido.', 125),
      ('TRON: Ares', 2025, 'Joachim Rønning', 'Próxima entrega de la franquicia TRON que explorará nuevos aspectos del universo digital.', NULL);

      -- Insertar personajes de TRON (1982)
      INSERT IGNORE INTO personajes (nombre, descripcion, actor, pelicula_id, tipo) VALUES
      ('Kevin Flynn', 'Programador y protagonista que entra al mundo digital', 'Jeff Bridges', 1, 'protagonista'),
      ('Tron', 'Programa de seguridad que lucha por los usuarios', 'Bruce Boxleitner', 1, 'protagonista'),
      ('Sark', 'Comandante del MCP y principal antagonista', 'David Warner', 1, 'antagonista'),
      ('Alan Bradley', 'Creador del programa Tron en el mundo real', 'Bruce Boxleitner', 1, 'secundario');

      -- Insertar personajes de TRON: Legacy
      INSERT IGNORE INTO personajes (nombre, descripcion, actor, pelicula_id, tipo) VALUES
      ('Sam Flynn', 'Hijo de Kevin Flynn que busca a su padre', 'Garrett Hedlund', 2, 'protagonista'),
      ('Quorra', 'Programa ISO y aliada de Kevin Flynn', 'Olivia Wilde', 2, 'protagonista'),
      ('Clu', 'Programa creado por Flynn que se corrompe', 'Jeff Bridges', 2, 'antagonista'),
      ('Kevin Flynn', 'Creador del Grid, atrapado en su creación', 'Jeff Bridges', 2, 'protagonista');

      -- Insertar tecnología
      INSERT IGNORE INTO tecnologia (nombre, tipo, descripcion, pelicula_id, funcion) VALUES
      ('Light Cycle', 'vehiculo', 'Motocicleta de luz que deja una estela impenetrable', 1, 'Transporte y combate en el Grid'),
      ('Identity Disc', 'dispositivo', 'Disco que almacena la información de los programas', 1, 'Almacenamiento de datos y arma'),
      ('Recognizer', 'vehiculo', 'Nave de reconocimiento y transporte', 1, 'Vigilancia y transporte de programas'),
      ('Light Jet', 'vehiculo', 'Aeronave de combate avanzada', 2, 'Combate aéreo en el Grid'),
      ('Rectifier', 'sistema', 'Dispositivo de asimilación digital', 2, 'Transformación entre mundos');

      -- Insertar localizaciones
      INSERT IGNORE INTO localizaciones (nombre, tipo, descripcion, pelicula_id, importancia) VALUES
      ('The Grid', 'grid', 'Mundo digital principal del universo TRON', 1, 'alta'),
      ('ENCOM', 'mundo_real', 'Compañía de tecnología donde trabaja Flynn', 1, 'alta'),
      ('Arcade Flynn', 'mundo_real', 'Salón de juegos de Kevin Flynn', 1, 'media'),
      ('The Grid (Actualizado)', 'grid', 'Grid recreado por Kevin Flynn en Legacy', 2, 'alta'),
      ('The Sea of Simulation', 'grid', 'Mar de simulación en los límites del Grid', 1, 'media');

      -- Crear usuario admin por defecto (password: admin123)
      INSERT IGNORE INTO usuarios (username, email, password, rol) VALUES
      ('admin', 'admin@tronencyclopedia.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
    `;

    connection.query(initialDataQuery, (err, results) => {
      if (err) {
        console.error('Error insertando datos iniciales:', err);
        reject(err);
        return;
      }
      console.log('Datos iniciales insertados correctamente');
      resolve(results);
    });
  });
}

// Función para cerrar la conexión
function closeConnection() {
  connection.end((err) => {
    if (err) {
      console.error('Error cerrando la conexión:', err);
      return;
    }
    console.log('Conexión a MySQL cerrada');
  });
}

module.exports = {
  initializeDatabase,
  closeConnection,
  connection
};