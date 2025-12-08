# CBM Malacca Club

Sistema web para el club Malacca usando WordPress como CMS headless y Next.js como frontend.

**Dominio:** `cbmmalacca.freemem.space` (provisional)

## Arquitectura

```
                              PRODUCCION
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Internet ──► Nginx (:443) ──┬── /wp-admin, /wp-json ─► WP    │
│                    │          │                          │      │
│               Certbot         └── /* ─► Next.js (SSR)    │      │
│            (Let's Encrypt)                               ▼      │
│                                                       MariaDB   │
└─────────────────────────────────────────────────────────────────┘

                              DESARROLLO
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   localhost ──► Nginx (:80) ──┬── /wp-admin, /wp-json ─► WP    │
│                               │                          │      │
│                               └── /* ─► Next.js (:3000)  │      │
│                                                          ▼      │
│                                                       MariaDB   │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes

| Componente | Tecnologia | Puerto | Descripcion |
|------------|------------|--------|-------------|
| Proxy/SSL | Nginx + Certbot | 80/443 | Enrutamiento, SSL, cache |
| CMS | WordPress + PHP-FPM | 9000 | Gestion de contenido |
| Base de datos | MariaDB | 3306 | Almacenamiento |
| Frontend | Next.js 14 | 3000 | Interfaz de usuario (SSR/SSG) |
| SSL | Certbot | - | Certificados Let's Encrypt |

## Estructura del Proyecto

```
cbm-malacca-club/
├── docker-compose.yml        # Orquestacion base
├── docker-compose.override.yml # Overrides desarrollo
├── docker-compose.prod.yml   # Overrides produccion (con SSL)
├── .env.example              # Variables de entorno (plantilla)
├── README.md
│
├── docs/                     # Documentacion detallada
│   ├── docker-compose.md
│   ├── frontend.md
│   └── wordpress-cpt.md
│
├── nginx/
│   ├── dev.conf
│   └── prod.conf
│
├── wordpress/
│   └── plugins/
│       └── mcclub-core/      # Plugin con CPTs y REST API
│
└── frontend/                 # App Next.js 14
    ├── app/                  # App Router
    │   ├── layout.jsx
    │   ├── page.jsx
    │   ├── globals.css
    │   ├── calendario/
    │   ├── noticias/
    │   └── quienes-somos/
    ├── components/
    │   ├── features/         # EventCard, NewsCard, Sliders...
    │   ├── layout/           # Header, Footer
    │   ├── three/            # Componentes Three.js
    │   └── ui/               # Componentes UI reutilizables
    ├── lib/
    │   ├── wordpress.js      # Cliente API WordPress
    │   ├── theme.js          # Configuracion MUI
    │   └── ThemeRegistry.jsx
    └── public/
        ├── logo.png
        └── models/           # Modelos 3D
```

## Funcionalidades

| Seccion | Ruta | Tipo WP | Descripcion |
|---------|------|---------|-------------|
| Inicio | `/` | - | Landing con hero 3D, sliders |
| Quienes somos | `/quienes-somos` | Page | Info del club |
| Noticias | `/noticias` | Post | Articulos |
| Noticia | `/noticias/:slug` | Post | Detalle noticia |
| Calendario | `/calendario` | CPT: evento | Actividades |

### Custom Post Type: Evento

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `fecha_inicio` | datetime | Inicio del evento |
| `fecha_fin` | datetime | Fin (opcional) |
| `lugar` | text | Ubicacion |
| `limite_inscripciones` | number | Plazas (0 = ilimitado) |

## Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18

## Inicio Rapido

### Desarrollo

```bash
# Clonar y configurar
git clone git@github.com:FreeMEM/commodore-malacca-club.git
cd cbm-malacca-club
cp .env.example .env

# Levantar infraestructura WordPress
docker compose up -d

# Configurar WordPress: http://localhost:8080/wp-admin/install.php

# Frontend
cd frontend
npm install
npm run dev
# Acceder a http://localhost:3000
```

### Produccion

```bash
# Build del frontend
cd frontend
npm run build

# Levantar con Docker
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## URLs

| Entorno | Frontend | Admin | API |
|---------|----------|-------|-----|
| Dev | localhost:3000 | localhost:8080/wp-admin | localhost:8080/wp-json/wp/v2/ |
| Prod | cbmmalacca.freemem.space | .../wp-admin | .../wp-json/wp/v2/ |

## Stack

**Backend:** WordPress 6.x, PHP 8.2, MariaDB 10.x, Nginx, Certbot
**Frontend:** Next.js 14, React 19, MUI (Material UI), Swiper, Three.js

## Caracteristicas del Frontend

- **SSR/SSG**: Renderizado del lado del servidor con Next.js App Router
- **Hero 3D**: Fondo wireframe animado con Three.js (modelo Commodore 64)
- **Sliders**: Carruseles de noticias y eventos con Swiper
- **Material UI**: Componentes con tema personalizado (colores del club)
- **Responsive**: Diseno adaptativo para movil y escritorio

## Documentacion

- [docs/docker-compose.md](docs/docker-compose.md) - Configuracion Docker
- [docs/frontend.md](docs/frontend.md) - Guia del frontend Next.js
- [docs/wordpress-cpt.md](docs/wordpress-cpt.md) - Custom Post Types

## Licencia

Este proyecto esta licenciado bajo **GPL-2.0-or-later** (GNU General Public License v2 o posterior), la misma licencia que WordPress.
