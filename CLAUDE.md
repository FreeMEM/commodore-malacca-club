# CLAUDE.md - Guía para desarrollo con IA

Este archivo define las convenciones y mejores prácticas para este proyecto.

## Reglas de Git

### Commits
- **NO incluir** menciones a Claude, Anthropic, IA o asistentes en mensajes de commit
- **NO usar** co-authored-by ni referencias a herramientas de IA
- Mensajes en español, formato: `tipo: descripción breve`
- Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

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
├── docker-compose.yml      # Orquestación de servicios
├── nginx/                  # Configuración Nginx + SSL
├── wordpress/              # WordPress headless
│   ├── themes/
│   └── plugins/
├── frontend/               # App React (Vite)
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── pages/          # Páginas/vistas
│       ├── services/       # Llamadas API
│       ├── hooks/          # Custom hooks
│       └── assets/         # Imágenes, estilos
└── docs/                   # Documentación técnica
```

## Convenciones de Código

### Frontend (React)
- Componentes funcionales con hooks
- Nombres en PascalCase para componentes: `EventCard.jsx`
- Nombres en camelCase para hooks: `useEvents.js`
- CSS Modules o Tailwind (a decidir)
- Fetch con custom hooks, no en componentes directamente

### WordPress
- Custom Post Types en plugin dedicado (no en tema)
- Prefijo para funciones PHP: `mcclub_`
- REST API endpoints personalizados bajo `/wp-json/mcclub/v1/`

## Endpoints API WordPress

| Recurso | Endpoint | Método |
|---------|----------|--------|
| Noticias | `/wp-json/wp/v2/posts` | GET |
| Páginas | `/wp-json/wp/v2/pages` | GET |
| Eventos | `/wp-json/wp/v2/eventos` | GET |
| Inscripciones | `/wp-json/mcclub/v1/inscripciones` | POST |

## Variables de Entorno

### Desarrollo
```env
WORDPRESS_DB_HOST=db
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=<segura>
MYSQL_ROOT_PASSWORD=<segura>
```

### Frontend
```env
VITE_API_URL=http://localhost:8080/wp-json
```

## Docker

- Desarrollo: `docker compose up -d`
- Logs: `docker compose logs -f [servicio]`
- Rebuild: `docker compose build --no-cache`

## Tareas Pendientes por Implementar

- [ ] Configurar docker-compose.yml
- [ ] Crear tema starter WordPress
- [ ] Plugin para Custom Post Type "Eventos"
- [ ] Setup inicial React con Vite
- [ ] Componentes: Header, Footer, EventCard, NewsCard
- [ ] Páginas: Home, QuienesSomos, Calendario, Noticias
- [ ] Sistema de inscripciones a eventos
- [ ] Integración redes sociales (enlaces)
- [ ] Configuración SSL con Certbot
