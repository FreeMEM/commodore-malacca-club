# Frontend Next.js

## Stack Tecnologico

| Herramienta | Proposito |
|-------------|-----------|
| Next.js 14 | Framework React con SSR/SSG |
| React 19 | UI library |
| MUI (Material UI) | Componentes y estilos |
| Swiper | Carruseles/sliders |
| Three.js | Graficos 3D |

## Estructura de Carpetas

```
frontend/
├── app/                      # App Router (Next.js 14)
│   ├── layout.jsx            # Layout principal
│   ├── page.jsx              # Pagina inicio (/)
│   ├── globals.css           # Estilos globales
│   ├── not-found.jsx         # Pagina 404
│   ├── calendario/
│   │   └── page.jsx          # /calendario
│   ├── noticias/
│   │   ├── page.jsx          # /noticias
│   │   └── [slug]/
│   │       └── page.jsx      # /noticias/:slug
│   └── quienes-somos/
│       └── page.jsx          # /quienes-somos
├── components/
│   ├── features/             # Componentes de funcionalidad
│   │   ├── EventCard.jsx
│   │   ├── EventList.jsx
│   │   ├── EventSlider.jsx
│   │   ├── NewsCard.jsx
│   │   ├── NewsList.jsx
│   │   ├── NewsSlider.jsx
│   │   ├── HeroSlider.jsx
│   │   └── InscripcionForm.jsx
│   ├── layout/               # Componentes de estructura
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── three/                # Componentes Three.js
│   │   ├── DynamicBackground.jsx
│   │   └── WireframeBackground.jsx
│   └── ui/                   # Componentes UI reutilizables
│       └── SectionTitle.jsx
├── lib/
│   ├── wordpress.js          # Cliente API WordPress
│   ├── theme.js              # Configuracion tema MUI
│   └── ThemeRegistry.jsx     # Provider de MUI
├── public/
│   ├── logo.png
│   └── models/
│       └── commodore64.obj   # Modelo 3D
├── jsconfig.json
├── next.config.js
└── package.json
```

## Configuracion

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.freemem.space',
      },
    ],
  },
}

module.exports = nextConfig
```

### Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
```

## Componentes Principales

### Layout (app/layout.jsx)
Layout raiz con Header, Footer y ThemeRegistry de MUI.

```jsx
import ThemeRegistry from '@/lib/ThemeRegistry'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  )
}
```

### Hero con 3D (components/features/HeroSlider.jsx)
Hero section con fondo 3D wireframe de Three.js.

```jsx
'use client'

import DynamicBackground from '@/components/three/DynamicBackground'

export default function HeroSlider() {
  return (
    <Box sx={{ position: 'relative', height: '85vh' }}>
      <DynamicBackground />
      {/* Contenido del hero */}
    </Box>
  )
}
```

### Sliders (Swiper)
Carruseles para noticias y eventos usando Swiper.

```jsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

export default function NewsSlider({ noticias }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
    >
      {noticias.map((noticia) => (
        <SwiperSlide key={noticia.id}>
          <NewsCard noticia={noticia} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
```

## Cliente API WordPress (lib/wordpress.js)

```javascript
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL

export async function getNoticias(limit = 10) {
  const res = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=${limit}&_embed`,
    { next: { revalidate: 60 } }
  )
  return res.json()
}

export async function getEventos(limit = 10) {
  const res = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/eventos?per_page=${limit}&_embed`,
    { next: { revalidate: 60 } }
  )
  return res.json()
}

export async function getPage(slug) {
  const res = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/pages?slug=${slug}&_embed`,
    { next: { revalidate: 60 } }
  )
  const pages = await res.json()
  return pages[0]
}
```

## Tema MUI (lib/theme.js)

Colores del club Commodore Malacca:

```javascript
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D5BA8',      // Azul del logo
      dark: '#063A6E',
    },
    secondary: {
      main: '#E31E24',      // Rojo del logo
    },
  },
  typography: {
    fontFamily: 'var(--font-raleway), sans-serif',
  },
})

export default theme
```

## Three.js - Fondo 3D

### DynamicBackground.jsx
Wrapper con carga dinamica (sin SSR).

```jsx
'use client'

import dynamic from 'next/dynamic'

const WireframeBackground = dynamic(
  () => import('./WireframeBackground'),
  { ssr: false }
)

export default function DynamicBackground() {
  return <WireframeBackground />
}
```

### WireframeBackground.jsx
Renderiza modelo OBJ en wireframe con Three.js vanilla.

- Carga modelo desde `/models/commodore64.obj`
- Material wireframe gris semitransparente
- Rotacion y movimiento suave animado
- Responsive al tamaño del contenedor

## Paginas

### Home (app/page.jsx)
```jsx
import { getNoticias, getEventos } from '@/lib/wordpress'
import HeroSlider from '@/components/features/HeroSlider'
import NewsSlider from '@/components/features/NewsSlider'
import EventSlider from '@/components/features/EventSlider'

export const revalidate = 60

export default async function HomePage() {
  const [noticias, eventos] = await Promise.all([
    getNoticias(6),
    getEventos(6),
  ])

  return (
    <>
      <HeroSlider />
      <EventSlider eventos={eventos} />
      <NewsSlider noticias={noticias} />
    </>
  )
}
```

### Noticias (app/noticias/page.jsx)
```jsx
import { getNoticias } from '@/lib/wordpress'
import NewsList from '@/components/features/NewsList'

export default async function NoticiasPage() {
  const noticias = await getNoticias(20)

  return (
    <Container>
      <NewsList noticias={noticias} />
    </Container>
  )
}
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build produccion
npm run build

# Ejecutar build
npm start

# Linting
npm run lint
```

## Dependencias Principales

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "^19.0.0",
    "@mui/material": "^6.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x",
    "swiper": "^11.x",
    "three": "^0.170.x"
  }
}
```
