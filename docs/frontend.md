# Frontend React

## Stack Tecnológico

| Herramienta | Propósito |
|-------------|-----------|
| Vite | Build tool y dev server |
| React 18 | UI library |
| React Router | Navegación SPA |
| TanStack Query | Fetching y cache de datos |
| CSS Modules | Estilos (o Tailwind) |

## Estructura de Carpetas

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── global.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Loading.jsx
│   │   └── features/
│   │       ├── EventCard.jsx
│   │       ├── EventList.jsx
│   │       ├── NewsCard.jsx
│   │       ├── NewsList.jsx
│   │       └── SocialLinks.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── QuienesSomos.jsx
│   │   ├── Calendario.jsx
│   │   ├── Noticias.jsx
│   │   ├── NoticiaDetalle.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js           # Cliente base
│   │   ├── posts.js         # Noticias
│   │   ├── pages.js         # Páginas estáticas
│   │   └── eventos.js       # Calendario
│   ├── hooks/
│   │   ├── useNoticias.js
│   │   ├── useEventos.js
│   │   └── usePage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env.example
├── package.json
├── vite.config.js
└── index.html
```

## Configuración Inicial

### package.json
```json
{
  "name": "mcclub-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.8.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  }
}
```

### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/wp-json': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### Variables de Entorno
```env
# .env.development
VITE_API_URL=http://localhost:8080/wp-json

# .env.production
VITE_API_URL=https://cbmmalacca.freemem.space/wp-json
```

## Componentes Principales

### Layout
Estructura base de todas las páginas.

```jsx
// src/components/layout/Layout.jsx
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
```

### Header
Navegación principal con enlaces a secciones.

```jsx
// src/components/layout/Header.jsx
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header>
      <Link to="/" className="logo">
        CBM Malacca Club
      </Link>
      <nav>
        <NavLink to="/quienes-somos">Quiénes Somos</NavLink>
        <NavLink to="/calendario">Calendario</NavLink>
        <NavLink to="/noticias">Noticias</NavLink>
      </nav>
    </header>
  )
}
```

### EventCard
Tarjeta para mostrar un evento del calendario.

```jsx
// src/components/features/EventCard.jsx
export default function EventCard({ evento }) {
  const { title, date, excerpt, plazas, inscritos } = evento

  return (
    <article className="event-card">
      <time>{formatDate(date)}</time>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <div className="event-meta">
        <span>Plazas: {inscritos}/{plazas}</span>
        {plazas > inscritos && (
          <button>Inscribirse</button>
        )}
      </div>
    </article>
  )
}
```

## Servicios API

### Cliente Base
```javascript
// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL

export async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
```

### Servicio de Noticias
```javascript
// src/services/posts.js
import { fetchAPI } from './api'

export function getNoticias(params = {}) {
  const query = new URLSearchParams({
    per_page: 10,
    _embed: true,
    ...params
  })
  return fetchAPI(`/wp/v2/posts?${query}`)
}

export function getNoticia(slug) {
  return fetchAPI(`/wp/v2/posts?slug=${slug}&_embed=true`)
    .then(posts => posts[0])
}
```

### Servicio de Eventos
```javascript
// src/services/eventos.js
import { fetchAPI } from './api'

export function getEventos(params = {}) {
  const query = new URLSearchParams({
    per_page: 20,
    orderby: 'meta_value',
    meta_key: 'fecha_evento',
    order: 'asc',
    ...params
  })
  return fetchAPI(`/wp/v2/eventos?${query}`)
}

export function inscribirse(eventoId, datos) {
  return fetchAPI('/mcclub/v1/inscripciones', {
    method: 'POST',
    body: JSON.stringify({
      evento_id: eventoId,
      ...datos
    })
  })
}
```

## Custom Hooks

### useNoticias
```javascript
// src/hooks/useNoticias.js
import { useQuery } from '@tanstack/react-query'
import { getNoticias, getNoticia } from '../services/posts'

export function useNoticias(params) {
  return useQuery({
    queryKey: ['noticias', params],
    queryFn: () => getNoticias(params)
  })
}

export function useNoticia(slug) {
  return useQuery({
    queryKey: ['noticia', slug],
    queryFn: () => getNoticia(slug),
    enabled: !!slug
  })
}
```

### useEventos
```javascript
// src/hooks/useEventos.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEventos, inscribirse } from '../services/eventos'

export function useEventos(params) {
  return useQuery({
    queryKey: ['eventos', params],
    queryFn: () => getEventos(params)
  })
}

export function useInscripcion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventoId, datos }) => inscribirse(eventoId, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    }
  })
}
```

## Routing

```jsx
// src/router.jsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import QuienesSomos from './pages/QuienesSomos'
import Calendario from './pages/Calendario'
import Noticias from './pages/Noticias'
import NoticiaDetalle from './pages/NoticiaDetalle'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'quienes-somos', element: <QuienesSomos /> },
      { path: 'calendario', element: <Calendario /> },
      { path: 'noticias', element: <Noticias /> },
      { path: 'noticias/:slug', element: <NoticiaDetalle /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])
```

## Páginas

### Home
```jsx
// src/pages/Home.jsx
import { useNoticias } from '../hooks/useNoticias'
import { useEventos } from '../hooks/useEventos'
import NewsList from '../components/features/NewsList'
import EventList from '../components/features/EventList'

export default function Home() {
  const { data: noticias, isLoading: loadingNews } = useNoticias({ per_page: 3 })
  const { data: eventos, isLoading: loadingEvents } = useEventos({ per_page: 3 })

  return (
    <div className="home">
      <section className="hero">
        <h1>CBM Malacca Club</h1>
        <p>Bienvenidos a nuestro club</p>
      </section>

      <section className="upcoming-events">
        <h2>Próximos Eventos</h2>
        {loadingEvents ? <Loading /> : <EventList eventos={eventos} />}
      </section>

      <section className="latest-news">
        <h2>Últimas Noticias</h2>
        {loadingNews ? <Loading /> : <NewsList noticias={noticias} />}
      </section>
    </div>
  )
}
```

## Manejo de Imágenes

WordPress devuelve imágenes en `_embedded['wp:featuredmedia']`:

```javascript
function getImageUrl(post, size = 'medium') {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return '/placeholder.jpg'

  return media.media_details?.sizes?.[size]?.source_url
    || media.source_url
}
```

## SEO y Meta Tags

Para SEO básico usar `react-helmet-async`:

```jsx
import { Helmet } from 'react-helmet-async'

export default function NoticiaDetalle({ noticia }) {
  return (
    <>
      <Helmet>
        <title>{noticia.title.rendered} | CBM Malacca</title>
        <meta name="description" content={noticia.excerpt.rendered} />
      </Helmet>
      {/* contenido */}
    </>
  )
}
```
