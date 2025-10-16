CREATE DATABASE IF NOT EXISTS tron_encyclopedia;
USE tron_encyclopedia;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_login DATETIME,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    avatar VARCHAR(255) DEFAULT 'default_avatar.png',
    nivel_juego INT DEFAULT 1,
    progreso_juego INT DEFAULT 0
);

CREATE TABLE peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    director VARCHAR(100),
    descripcion TEXT,
    duracion INT,
    poster VARCHAR(255),
    trailer_url VARCHAR(255),
    fecha_estreno DATE,
    orden_cronologico INT
);

CREATE TABLE personajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    rol ENUM('protagonista', 'antagonista', 'secundario', 'programa', 'usuario'),
    actor_original VARCHAR(100),
    imagen VARCHAR(255),
    primera_aparicion INT,
    FOREIGN KEY (primera_aparicion) REFERENCES peliculas(id)
);
-- Tabla de relación personajes-películas (muchos a muchos)
CREATE TABLE personaje_pelicula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personaje_id INT,
    pelicula_id INT,
    rol_en_pelicula VARCHAR(100),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id),
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

CREATE TABLE tecnologia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('vehiculo', 'herramienta', 'sistema', 'armamento', 'otros'),
    descripcion TEXT,
    primera_aparicion INT,
    imagen VARCHAR(255),
    FOREIGN KEY (primera_aparicion) REFERENCES peliculas(id)
);

CREATE TABLE localizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('grid', 'mundo_real', 'sistema', 'otros'),
    descripcion TEXT,
    primera_aparicion INT,
    imagen VARCHAR(255),
    FOREIGN KEY (primera_aparicion) REFERENCES peliculas(id)
);

CREATE TABLE multimedia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('imagen', 'audio', 'video', 'concept_art'),
    titulo VARCHAR(100),
    descripcion TEXT,
    archivo_url VARCHAR(255) NOT NULL,
    categoria VARCHAR(50),
    pelicula_id INT,
    personaje_id INT,
    tecnologia_id INT,
    localizacion_id INT,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id),
    FOREIGN KEY (tecnologia_id) REFERENCES tecnologia(id),
    FOREIGN KEY (localizacion_id) REFERENCES localizaciones(id)
);

CREATE TABLE banda_sonora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista VARCHAR(100),
    album VARCHAR(100),
    duracion TIME,
    pelicula_id INT,
    archivo_audio VARCHAR(255),
    portada_album VARCHAR(255),
    año INT,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

-- Tabla para el juego "Escape de TRON"
CREATE TABLE juego_desafios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_desafio ENUM('puzzle', 'memoria', 'logica', 'velocidad'),
    dificultad ENUM('facil', 'medio', 'dificil'),
    solucion TEXT,
    puntos INT,
    tiempo_limite INT, -- en segundos
    imagen_desafio VARCHAR(255),
    orden INT
);

CREATE TABLE juego_progreso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    desafio_id INT,
    completado BOOLEAN DEFAULT FALSE,
    fecha_completado DATETIME,
    puntuacion INT,
    tiempo_empleado INT, -- en segundos
    intentos INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (desafio_id) REFERENCES juego_desafios(id)
);

-- Tabla de búsquedas (para guardar historial)
CREATE TABLE busquedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    termino_busqueda VARCHAR(255),
    fecha_busqueda DATETIME DEFAULT CURRENT_TIMESTAMP,
    resultados INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO peliculas (titulo, año, director, descripcion, orden_cronologico) VALUES
('TRON', 1982, 'Steven Lisberger', 'Un programador es transportado al mundo digital donde debe luchar por su vida en juegos mortales.', 1),
('TRON: Legacy', 2010, 'Joseph Kosinski', 'El hijo de Kevin Flynn busca a su padre desaparecido en el mundo digital que creó.', 2),
('TRON: Ares', 2025, 'Joachim Rønning', 'Secuela que continúa expandiendo el universo de TRON.', 3);

INSERT INTO personajes (nombre, descripcion, rol, actor_original, primera_aparicion) VALUES ('Kevin Flynn', 'Programador genio y creador del Grid original', 'protagonista', 'Jeff Bridges', 1), ('Sam Flynn', 'Hijo de Kevin Flynn que sigue los pasos de su padre', 'protagonista', 'Garrett Hedlund', 2), ('Quorra', 'Programa ISO que se convierte en aliada clave', 'protagonista', 'Olivia Wilde', 2), ('CLU', 'Programa de control creado por Flynn que se rebela', 'antagonista', 'Jeff Bridges', 2), ('Tron/Rinzler', 'Programa de seguridad que lucha por el usuario', 'secundario', 'Bruce Boxleitner', 1), ('Alan Bradley', 'Amigo y colega de Kevin Flynn', 'usuario', 'Bruce Boxleitner', 1);


INSERT INTO tecnologia (nombre, tipo, descripcion, primera_aparicion) VALUES
('Disco de Identidad', 'herramienta', 'Disco que contiene la esencia de los programas', 1), ('Light Cycle', 'vehiculo', 'Motocicleta de luz que deja un rastro de energía', 1), ('Recognizer', 'vehiculo', 'Nave de reconocimiento y transporte', 1), ('Light Jet', 'vehiculo', 'Aeronave de combate personal', 2), ('Grid', 'sistema', 'Mundo digital creado por Kevin Flynn', 1);


INSERT INTO localizaciones (nombre, tipo, descripcion, primera_aparicion) VALUES
('El Grid', 'grid', 'Mundo digital principal donde ocurre la acción', 1), ('ENCOM', 'mundo_real', 'Compañía de tecnología donde trabajan los protagonistas', 1), ('Arcade', 'mundo_real', 'Sala de juegos que sirve como entrada al Grid', 1), ('El Sea of Simulation', 'grid', 'Mar de datos en los límites del sistema', 1);

-- Insertar desafíos del juego
INSERT INTO juego_desafios (titulo, descripcion, tipo_desafio, dificultad, puntos, tiempo_limite, orden) VALUES ('Reconocimiento de Patrones', 'Identifica el patrón correcto en la secuencia de luz', 'puzzle', 'facil', 100, 60, 1), ('Carrera de Light Cycles', 'Esquiva los rastros de luz y llega a la meta', 'velocidad', 'medio', 200, 90, 2), ('Desactivación del MCP', 'Resuelve el puzzle lógico para desactivar el Control Principal', 'logica', 'dificil', 300, 120, 3),
('Memoria del Disco', 'Memoriza la secuencia de símbolos del disco de identidad', 'memoria', 'medio', 150, 75, 4);
