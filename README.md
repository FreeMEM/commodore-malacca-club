# CBM Malacca Club

Sistema web para el club Malacca usando WordPress como CMS headless y React como frontend.

**Dominio:** `cbmmalacca.freemem.space` (provisional)

## Arquitectura

```
                              PRODUCCIÓN
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Internet ──► Nginx (:443) ──┬── /wp-admin, /wp-json ─► WP    │
│                    │          │                          │      │
│               Certbot         └── /* ─► React (estático) │      │
│            (Let's Encrypt)                               ▼      │
│                                                       MariaDB   │
└─────────────────────────────────────────────────────────────────┘

                              DESARROLLO
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   localhost ──► Nginx (:80) ──┬── /wp-admin, /wp-json ─► WP    │
│                               │                          │      │
│                               └── /* ─► Vite (:5173)     │      │
│                                                          ▼      │
│                                                       MariaDB   │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes

| Componente | Tecnología | Puerto | Descripción |
|------------|------------|--------|-------------|
| Proxy/SSL | Nginx + Certbot | 80/443 | Enrutamiento, SSL, caché |
| CMS | WordPress + PHP-FPM | 9000 | Gestión de contenido |
| Base de datos | MariaDB | 3306 | Almacenamiento |
| Frontend | React + Vite | 5173 (dev) | Interfaz de usuario |
| SSL | Certbot | - | Certificados Let's Encrypt |

## Estructura del Proyecto

```
cbm-malacca-club/
├── docker-compose.yml        # Orquestación base
├── docker-compose.dev.yml    # Overrides desarrollo (sin SSL)
├── docker-compose.prod.yml   # Overrides producción (con SSL)
├── .env.example              # Variables de entorno (plantilla)
├── README.md
│
├── docs/                     # Documentación detallada
│   ├── arquitectura.md
│   ├── desarrollo.md
│   ├── despliegue.md
│   └── api.md
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.dev.conf
│       └── default.prod.conf
│
├── wordpress/
│   ├── themes/
│   │   └── malacca-starter/  # Tema que registra CPTs
│   └── plugins/
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        ├── pages/
        ├── services/
        ├── hooks/
        └── assets/
```

## Funcionalidades

| Sección | Ruta | Tipo WP | Descripción |
|---------|------|---------|-------------|
| Inicio | `/` | - | Landing |
| Quiénes somos | `/quienes-somos` | Page | Info del club |
| Noticias | `/noticias` | Post | Artículos |
| Calendario | `/calendario` | CPT: evento | Actividades |
| Evento | `/evento/:slug` | CPT: evento | Detalle + inscripción |

### Custom Post Type: Evento

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `fecha_inicio` | datetime | Inicio del evento |
| `fecha_fin` | datetime | Fin (opcional) |
| `lugar` | text | Ubicación |
| `limite_inscripciones` | number | Plazas (0 = ilimitado) |

## Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (desarrollo)

## Inicio Rápido

### Desarrollo

```bash
# Clonar y configurar
git clone <url-del-repo>
cd cbm-malacca-club
cp .env.example .env

# Levantar infraestructura
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Configurar WordPress: http://localhost/wp-admin/install.php

# Frontend
cd frontend
npm install
npm run dev
# Acceder a http://localhost:5173
```

### Producción

```bash
# Obtener certificado SSL
docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d cbmmalacca.freemem.space

# Levantar servicios
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## URLs

| Entorno | Frontend | Admin | API |
|---------|----------|-------|-----|
| Dev | localhost:5173 | localhost/wp-admin | localhost/wp-json/wp/v2/ |
| Prod | cbmmalacca.freemem.space | .../wp-admin | .../wp-json/wp/v2/ |

## Stack

**Backend:** WordPress 6.x, PHP 8.2, MariaDB 10.x, Nginx, Certbot
**Frontend:** React 18, Vite, React Router

## Documentación

- [docs/arquitectura.md](docs/arquitectura.md) - Diseño del sistema
- [docs/desarrollo.md](docs/desarrollo.md) - Guía de desarrollo
- [docs/api.md](docs/api.md) - Referencia API
- [docs/despliegue.md](docs/despliegue.md) - Guía de despliegue

## Licencia

Este proyecto está licenciado bajo **GPL-2.0-or-later** (GNU General Public License v2 o posterior), la misma licencia que WordPress.

Ver [LICENSE](LICENSE) para más detalles.
