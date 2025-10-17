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
    tipo ENUM('vehiculo', 'herramienta', 'sistema', 'armamento'),
    descripcion TEXT,
    primera_aparicion INT,
    imagen VARCHAR(255),
    FOREIGN KEY (primera_aparicion) REFERENCES peliculas(id)
);

CREATE TABLE localizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('la red', 'mundo_real'),
    descripcion TEXT,
    primera_aparicion INT,
    imagen VARCHAR(255),
    FOREIGN KEY (primera_aparicion) REFERENCES peliculas(id)
);

CREATE TABLE multimedia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('imagen', 'audio', 'video'),
    titulo VARCHAR(100),
    descripcion TEXT,
    archivo_url VARCHAR(255) NOT NULL,
    categoria VARCHAR(50),
    pelicula_id INT,
    personaje_id INT,
    tecnologia_id INT,
    localizacion_id INT,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id),
    FOREIGN KEY (personaje_id) REFERENCES personajes(id),
    FOREIGN KEY (tecnologia_id) REFERENCES tecnologia(id),
    FOREIGN KEY (localizacion_id) REFERENCES localizaciones(id)
);

CREATE TABLE banda_sonora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    artista VARCHAR(100),
    pelicula_id INT,
    archivo_audio VARCHAR(255),
    año INT,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);

CREATE TABLE juego_desafios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_desafio ENUM('puzzle', 'memoria', 'logica', 'velocidad'),
    dificultad ENUM('facil', 'medio', 'dificil'),
    solucion TEXT,
    puntos INT,
    tiempo_limite INT,
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
    tiempo_empleado INT,
    intentos INT DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (desafio_id) REFERENCES juego_desafios(id)
);

CREATE TABLE busquedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    termino_busqueda VARCHAR(255),
    fecha_busqueda DATETIME DEFAULT CURRENT_TIMESTAMP,
    resultados INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- INSERTAR DATOS --
INSERT INTO peliculas (titulo, año, director, descripcion, duracion, poster, trailer_url, fecha_estreno, orden_cronologico) VALUES
('TRON', 1982, 'Steven Lisberger', 'Kevin Flynn, un programador brillante, es digitalizado y atrapado en el sistema de ENCOM, donde debe sobrevivir a juegos mortales y ayudar al programa Tron a derrotar al tiránico Control Central de Programas (CCP).', 96, 'tron_1982.jpg', 'https://youtu.be/3efV2wqEjEY', '1982-07-09', 1),
('TRON: Legacy', 2010, 'Joseph Kosinski', 'Sam Flynn, hijo de Kevin, se adentra en el Grid para encontrar a su padre desaparecido. Allí descubre un mundo gobernado por CLU, una inteligencia rebelde, y se une a Quorra y Tron para restaurar el equilibrio.', 125, 'tron_legacy.jpg', 'https://youtu.be/L9szn1QQfas', '2010-12-17', 2),
('TRON: Ares', 2025, 'Joachim Rønning', 'Ares, un programa avanzado, es enviado al mundo real en medio de una guerra corporativa entre ENCOM y Dillinger Systems. Al descubrir emociones humanas, desafía su programación y lucha por proteger a Eve Kim y el legado de Flynn.', 130, 'tron_ares.jpg', 'https://youtu.be/tron_ares_trailer', '2025-07-25', 3);

INSERT INTO personajes (nombre, descripcion, rol, actor_original, imagen, primera_aparicion) VALUES
('Kevin Flynn', 'Programador visionario que creó el Grid y desafió al CCP desde dentro del sistema.', 'protagonista', 'Jeff Bridges', 'flynn.jpg', 1),
('Sam Flynn', 'Hijo de Kevin Flynn, aventurero y heredero del legado digital.', 'protagonista', 'Garrett Hedlund', 'sam.jpg', 2),
('Quorra', 'Programa ISO único, aliada de Sam y Kevin en la lucha contra CLU.', 'protagonista', 'Olivia Wilde', 'quorra.jpg', 2),
('CLU', 'Copia digital de Flynn que se convierte en dictador del Grid.', 'antagonista', 'Jeff Bridges', 'clu.jpg', 2),
('Tron/Rinzler', 'Programa de seguridad reprogramado por CLU, que recupera su identidad heroica.', 'secundario', 'Bruce Boxleitner', 'tron.jpg', 1),
('Alan Bradley', 'Programador de Tron y amigo leal de Flynn.', 'usuario', 'Bruce Boxleitner', 'alan.jpg', 1),
('MCP', 'IA autoconsciente que domina el sistema ENCOM en 1982.', 'antagonista', 'David Warner', 'mcp.jpg', 1),
('Yori', 'Programa que ayuda a Flynn y Tron en su misión contra el CCP.', 'secundario', 'Cindy Morgan', 'yori.jpg', 1),
('Ares', 'Programa militar enviado al mundo real, que desarrolla conciencia propia.', 'protagonista', 'Jared Leto', 'ares.jpg', 3),
('Julian Dillinger', 'Nieto de Ed Dillinger, creador de Ares y antagonista corporativo.', 'antagonista', 'Evan Peters', 'dillinger.jpg', 3),
('Eve Kim', 'Científica que perfecciona el código de permanencia y se convierte en aliada de Ares.', 'protagonista', 'Greta Lee', 'eve.jpg', 3),
('Kevin Flynn (programa)', 'Remanente digital de Flynn que guía a Ares en su evolución.', 'secundario', 'Jeff Bridges', 'flynn_program.jpg', 3);

INSERT INTO tecnologia (nombre, tipo, descripcion, primera_aparicion, imagen) VALUES
('Disco de Identidad', 'herramienta', 'Contiene la esencia de cada programa y sirve como arma y memoria.', 1, 'disco.jpg'),
('Light Cycle', 'vehiculo', 'Motocicleta digital que deja un rastro de energía letal.', 1, 'light_cycle.jpg'),
('Recognizer', 'vehiculo', 'Nave de patrullaje y transporte en el Grid.', 1, 'recognizer.jpg'),
('Light Jet', 'vehiculo', 'Aeronave de combate usada en TRON: Legacy.', 2, 'light_jet.jpg'),
('Grid', 'sistema', 'Universo digital creado por Flynn como campo de experimentación y utopía.', 1, 'grid.jpg');

INSERT INTO localizaciones (nombre, tipo, descripcion, primera_aparicion, imagen) VALUES
('El Grid', 'la red', 'Sistema digital creado por Kevin Flynn, gobernado por CLU hasta su caída.', 1, 'grid.jpg'),
('ENCOM', 'mundo_real', 'Corporación tecnológica donde se originan los eventos del universo TRON.', 1, 'encom.jpg'),
('Arcade Flynns', 'mundo_real', 'Sala de juegos que oculta el acceso al sistema Tron.', 1, 'arcade.jpg'),
('Sea of Simulation', 'la red', 'Mar de datos en los límites del Grid, donde Tron/Rinzler encuentra su redención.', 2, 'sea_of_simulation.jpg');

INSERT INTO banda_sonora (titulo, artista, pelicula_id, archivo_audio, año) VALUES
('TRON Theme', 'Wendy Carlos', 1, 'tron_theme.mp3', 1982),
('The Grid', 'Daft Punk', 2, 'the_grid.mp3', 2010),
('Derezzed', 'Daft Punk', 2, 'derezzed.mp3', 2010),
('Son of Flynn', 'Daft Punk', 2, 'son_of_flynn.mp3', 2010),
('Ares Awakens', 'Joseph Trapanese', 3, 'ares_awakens.mp3', 2025),
('Digital Rebellion', 'Joseph Trapanese', 3, 'digital_rebellion.mp3', 2025);

INSERT INTO multimedia (tipo, titulo, descripcion, archivo_url, categoria, pelicula_id, personaje_id, tecnologia_id, localizacion_id) VALUES
('imagen', 'Poster TRON', 'Póster original de la película TRON (1982)', 'poster_tron.jpg', 'promocional', 1, NULL, NULL, NULL),
('video', 'Trailer TRON: Legacy', 'Avance oficial de TRON: Legacy', 'https://youtu.be/L9szn1QQfas', 'trailer', 2, NULL, NULL, NULL),
('audio', 'Derezzed', 'Tema musical de TRON: Legacy', 'derezzed.mp3', 'banda_sonora', 2, NULL, NULL, NULL),
('imagen', 'Light Cycle en acción', 'Escena de persecución con Light Cycles', 'light_cycle_scene.jpg', 'vehiculo', 2, NULL, 2, NULL),
('imagen', 'El Grid', 'Visualización del sistema digital creado por Flynn', 'grid_visual.jpg', 'entorno', 2, NULL, 5, 1);

INSERT INTO juego_desafios (titulo, descripcion, tipo_desafio, dificultad, solucion, puntos, tiempo_limite, imagen_desafio, orden) VALUES
('Reconocimiento de Patrones', 'Identifica el patrón correcto en la secuencia de luz', 'puzzle', 'facil', 'patron_3', 100, 60, 'patron_luz.jpg', 1),
('Carrera de Light Cycles', 'Esquiva los rastros de luz y llega a la meta', 'velocidad', 'medio', 'ruta_optima', 200, 90, 'light_cycle_race.jpg', 2),
('Desactivación del MCP', 'Resuelve el puzzle lógico para desactivar el Control Principal', 'logica', 'dificil', 'clave_binaria', 300, 120, 'mcp_core.jpg', 3),
('Memoria del Disco', 'Memoriza la secuencia de símbolos del disco de identidad', 'memoria', 'medio', 'secuencia_azul_rojo_verde', 150, 75, 'disco_memoria.jpg', 4),
('Escape del Recognizer', 'Encuentra la salida antes de ser capturado', 'logica', 'dificil', 'salida_norte', 250, 100, 'recognizer_escape.jpg', 5),
('Código ISO', 'Descifra el código genético de Quorra', 'logica', 'dificil', 'iso_42', 300, 120, 'quorra_code.jpg', 6);
