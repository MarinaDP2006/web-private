CREATE DATABASE IF NOT EXISTS tron_encyclopedia;
USE tron_encyclopedia;

-- Tabla de cuentas registradas
CREATE TABLE cuentas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  cuenta_id INT,
  FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
);

-- Tabla de datos de la enciclopedia
CREATE TABLE enciclopedia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  descripcion TEXT,
  anio_estreno INT
);

-- Tabla de personas involucradas
CREATE TABLE personas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  rol VARCHAR(100),
  descripcion TEXT
);

-- Tabla de vehículos y tecnología
CREATE TABLE tecnologia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT
);

-- Tabla de escape room
CREATE TABLE escape_room (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  puntuacion INT,
  tiempo_segundos INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de preguntas y respuestas
CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pregunta TEXT,
  respuesta TEXT
);

-- Tabla de progreso del usuario en la enciclopedia
CREATE TABLE progreso_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  seccion VARCHAR(100),
  completado BOOLEAN,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_cuenta_email ON cuentas(email);
CREATE INDEX idx_usuario_nombre ON usuarios(nombre);
CREATE INDEX idx_enciclopedia_titulo ON enciclopedia(titulo);
CREATE INDEX idx_personas_nombre ON personas(nombre);
CREATE INDEX idx_tecnologia_nombre ON tecnologia(nombre);
CREATE INDEX idx_preguntas_pregunta ON preguntas(pregunta);
CREATE INDEX idx_progreso_usuario ON progreso_usuario(usuario_id, seccion);

-- Fin del script SQL