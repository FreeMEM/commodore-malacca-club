# CLAUDE.md - Guia para desarrollo

Este archivo define las convenciones y mejores practicas para este proyecto.

## Reglas de Git

### Commits
- **NO incluir** menciones a Claude, Anthropic, IA o asistentes en mensajes de commit
- **NO usar** co-authored-by ni referencias a herramientas de IA
- Mensajes en español, formato: `tipo: descripcion breve`
- Tipos validos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Ejemplo correcto:
```
feat: agregar endpoint para eventos del calendario
```

Ejemplo incorrecto:
```
feat: agregar endpoint (generado con Claude)
```

## Estructura del Proyecto

```
cbm-malacca-club/
├── docker-compose.yml      # Orquestacion de servicios
├── nginx/                  # Configuracion Nginx + SSL
├── wordpress/              # WordPress headless
│   └── plugins/
│       └── mcclub-core/    # Plugin con CPTs y REST API
├── frontend/               # App Next.js 14
│   ├── app/                # App Router (paginas)
│   ├── components/         # Componentes React
│   │   ├── features/       # EventCard, NewsCard, Sliders
│   │   ├── layout/         # Header, Footer
│   │   ├── three/          # Componentes Three.js
│   │   └── ui/             # Componentes UI
│   ├── lib/                # Utilidades y configuracion
│   └── public/             # Assets estaticos
└── docs/                   # Documentacion tecnica
```

## Convenciones de Codigo

### Frontend (Next.js)
- Componentes funcionales con hooks
- Nombres en PascalCase para componentes: `EventCard.jsx`
- App Router de Next.js 14 (carpeta `app/`)
- Server Components por defecto, `'use client'` solo cuando sea necesario
- Material UI (MUI) para estilos y componentes
- Fetching de datos en Server Components con funciones async

### WordPress
- Custom Post Types en plugin dedicado (no en tema)
- Prefijo para funciones PHP: `mcclub_`
- REST API endpoints personalizados bajo `/wp-json/mcclub/v1/`

## Endpoints API WordPress

| Recurso | Endpoint | Metodo |
|---------|----------|--------|
| Noticias | `/wp-json/wp/v2/posts` | GET |
| Paginas | `/wp-json/wp/v2/pages` | GET |
| Eventos | `/wp-json/wp/v2/eventos` | GET |
| Inscripciones | `/wp-json/mcclub/v1/inscripciones` | POST |

## Variables de Entorno

### WordPress (Docker)
```env
WORDPRESS_DB_HOST=db
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=<segura>
MYSQL_ROOT_PASSWORD=<segura>
```

### Frontend (Next.js)
```env
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
```

## Comandos

### Docker
- Desarrollo: `docker compose up -d`
- Logs: `docker compose logs -f [servicio]`
- Rebuild: `docker compose build --no-cache`

### Frontend
- Desarrollo: `npm run dev`
- Build: `npm run build`
- Produccion: `npm start`

## Tareas Completadas

- [x] Configurar docker-compose.yml
- [x] Plugin para Custom Post Type "Eventos"
- [x] Setup inicial Next.js 14
- [x] Componentes: Header, Footer, EventCard, NewsCard
- [x] Paginas: Home, QuienesSomos, Calendario, Noticias
- [x] Hero con fondo 3D wireframe (Three.js)
- [x] Sliders de noticias y eventos (Swiper)
- [x] Integracion con WordPress REST API

## Tareas Pendientes

- [ ] Sistema de inscripciones a eventos
- [ ] Configuracion SSL con Certbot
- [ ] Despliegue en produccion
