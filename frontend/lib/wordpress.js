/**
 * Cliente para WordPress REST API
 * Se ejecuta en el servidor (SSR/SSG)
 */

import DOMPurify from 'isomorphic-dompurify'

const API_URL = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json'
const WP_HOST = process.env.WORDPRESS_HOST || 'localhost:8080'

/**
 * Sanitizar HTML para prevenir XSS
 */
export function sanitizeHtml(html) {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img', 'figure', 'figcaption', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'width', 'height'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Reemplazar localhost en URLs para acceso desde otros dispositivos
 */
export function fixImageUrl(url) {
  if (!url) return null
  // Reemplazar localhost:8080 por el host configurado
  return url.replace(/localhost:8080/g, WP_HOST)
}

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
 * Obtener URL de imagen destacada o primera imagen del contenido
 */
export function getImageUrl(post, size = 'medium') {
  let url = null

  // Primero intentar obtener la imagen destacada
  const media = post?._embedded?.['wp:featuredmedia']?.[0]
  if (media) {
    url = media.media_details?.sizes?.[size]?.source_url || media.source_url
  }

  // Fallback: extraer primera imagen del contenido
  if (!url) {
    const content = post?.content?.rendered || ''
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
    if (imgMatch && imgMatch[1]) {
      url = imgMatch[1]
    }
  }

  return fixImageUrl(url)
}

/**
 * Arreglar URLs de imagenes en contenido HTML
 */
export function fixContentUrls(html) {
  if (!html) return ''
  return html.replace(/localhost:8080/g, WP_HOST)
}

/**
 * Limpiar HTML
 */
export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Decodificar entidades HTML
 */
export function decodeHtmlEntities(text) {
  if (!text) return ''
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
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

/**
 * Eliminar primera imagen del contenido (para evitar duplicados con imagen destacada)
 */
export function removeFirstImage(html) {
  if (!html) return ''
  // Eliminar la primera etiqueta img y su contenedor figure si existe
  return html
    .replace(/<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>/, '')
    .replace(/^[\s]*<img[^>]*>/, '')
    .trim()
}
