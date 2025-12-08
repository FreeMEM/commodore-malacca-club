/**
 * Cliente para WordPress REST API
 * Se ejecuta en el servidor (SSR/SSG)
 */

const API_URL = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'

/**
 * Fetch generico con cache de Next.js
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      ...options,
    })

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${url}`)
      return null
    }

    const text = await res.text()
    if (!text) return null

    return JSON.parse(text)
  } catch (error) {
    console.error(`Fetch Error: ${error.message} - ${url}`)
    return null
  }
}

// ============ NOTICIAS (Posts) ============

/**
 * Obtener listado de noticias
 */
export async function getNoticias(limit = 10) {
  const posts = await fetchAPI(`/wp/v2/posts?per_page=${limit}&_embed=true`, {
    next: { revalidate: 60 }, // Revalidar cada 60 segundos
  })
  return posts || []
}

/**
 * Obtener noticia por slug
 */
export async function getNoticiaBySlug(slug) {
  const posts = await fetchAPI(`/wp/v2/posts?slug=${slug}&_embed=true`, {
    next: { revalidate: 60 },
  })
  return posts?.[0] || null
}

/**
 * Obtener todos los slugs de noticias (para generateStaticParams)
 */
export async function getAllNoticiasSlugs() {
  const posts = await fetchAPI('/wp/v2/posts?per_page=100&_fields=slug', {
    next: { revalidate: 3600 },
  })
  return posts?.map(p => p.slug) || []
}

// ============ PAGINAS ============

/**
 * Obtener pagina por slug
 */
export async function getPageBySlug(slug) {
  const pages = await fetchAPI(`/wp/v2/pages?slug=${slug}&_embed=true`, {
    next: { revalidate: 300 }, // Revalidar cada 5 minutos
  })
  return pages?.[0] || null
}

// ============ EVENTOS ============

/**
 * Obtener proximos eventos (endpoint personalizado)
 */
export async function getProximosEventos(limit = 10) {
  const data = await fetchAPI(`/mcclub/v1/eventos/proximos?limit=${limit}`, {
    next: { revalidate: 60 },
  })
  return data?.eventos || []
}

/**
 * Obtener todos los eventos
 */
export async function getEventos(limit = 20) {
  const eventos = await fetchAPI(`/wp/v2/eventos?per_page=${limit}&_embed=true`, {
    next: { revalidate: 60 },
  })
  return eventos || []
}

// ============ INSCRIPCIONES ============

/**
 * Crear inscripcion (se llama desde el cliente)
 */
export async function crearInscripcion(eventoId, datos) {
  const res = await fetch(`${API_URL}/mcclub/v1/inscripciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      evento_id: eventoId,
      ...datos,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Error al procesar la inscripcion')
  }

  return data
}

// ============ UTILIDADES ============

/**
 * Obtener URL de imagen destacada
 */
export function getImageUrl(post, size = 'medium') {
  const media = post?._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null

  return (
    media.media_details?.sizes?.[size]?.source_url ||
    media.source_url
  )
}

/**
 * Limpiar HTML
 */
export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Formatear fecha
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
