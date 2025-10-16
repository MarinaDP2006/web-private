# TRON Encyclopedia
Enciclopedia interactiva del universo TRON con base de datos MySQL, sistema de usuarios y juego "Escape de TRON".

## Características
- Base de datos completa del universo TRON
- Sistema de autenticación de usuarios
- Juego interactivo "Escape de TRON"
- Panel de administración
- Búsqueda avanzada
- Galería multimedia

## Instalación
1. Clonar el repositorio
2. Ejecutar `npm install`
3. Configurar la base de datos en `.env`
4. Ejecutar `npm run init-db`
5. Ejecutar `npm start`

## Puerto
La aplicación se ejecuta en el puerto 3000 por defecto.

## Seguridad
- Acceso restringido por clave en URL
- Panel de administración protegido por credenciales

# ESTRUCTURA DE NAVEGACIÓN WEB
- INICIO: 
Timeline del universo 
Contenido destacado
(en caso de registrarse) 
Escapa de Tron - Escape Room
TRON 1982 (/tron-1982)
Submenú:
├── Personajes
├── Tecnología
├── Localizaciones
└── Historia
LEGACY (/tron-legacy)
Submenú:
├── Personajes 
├── El Grid 
├── Tecnología
└── Banda Sonora (Daft Punk)
ARES (/tron-ares)
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
