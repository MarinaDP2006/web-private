# TRON Encyclopedia Web
Enciclopedia interactiva del universo TRON con funcionalidades de juego, galería y administración.

## Requisitos
- Navegador moderno
- Acceso por enlace privado
- Usuario ADMIN para editar contenido

## Base de Datos
Ubicada en `assets/data/database.sql`. Incluye tablas para:
- Cuentas y usuarios
- Escape Room (preguntas, puntuaciones)
- Datos, tecnología y personajes de cada apartado de la enciclopedia interactiva

## Seguridad
- Acceso restringido por clave en URL
- Panel de administración protegido por credenciales

# ESTRUCTURA DE NAVEGACIÓN WEB
- INICIO: 
Timeline del universo 
Contenido destacado
(en caso de registrarse) 
Escapa de Tron - Escape Room
# TRON 1982 (/tron-1982)
Submenú:
├── Personajes
├── Tecnología
├── Localizaciones
└── Historia
# TRON: LEGACY (/tron-legacy)
Submenú:
├── Personajes 
├── El Grid 
├── Tecnología
└── Banda Sonora (Daft Punk)
# TRON: ARES (/tron-ares)
Submenú:
├── Personajes
├── Tecnología
├── Localizaciones (Mundo real, Red de Dillinger Systems, El Grid de 1982)
└── Historia

# BUSCAR (/buscar)
Filtros múltiples e historial personal

# ADMIN (/admin) - (Solo el administrador con User de ADMIN y contraseña de ADMIN)
- CRUD completo
- Gestión de contenido
- Estadísticas de usuarios

# Tabla de Páginas y Propósito
index.html - Página principal con timeline, destacados y acceso al Escape Room

tron-1982.html - Información sobre la película original: personajes, tecnología y  vehiculos e historia

legacy.html	- Sección dedicada a Legacy 2010

ares.html - Sección dedicada a Ares 2025

galeria.html - Galería multimedia con filtros y opción de descarga por contacto

buscar.html	- Buscador con filtros y historial personal

escapeoftron.html - Juego interactivo tipo Escape Room (solo usuarios registrados)

admin.html	- Panel de administración para CRUD y estadísticas (solo usuario ADMIN)