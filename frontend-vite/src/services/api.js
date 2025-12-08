/**
 * Cliente API base para WordPress REST API
 */

const API_URL = import.meta.env.VITE_API_URL || '/wp-json'

/**
 * Fetch generico con manejo de errores
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error ${response.status}`)
  }

  return response.json()
}

/**
 * Obtener URL de imagen destacada
 */
export function getImageUrl(post, size = 'medium') {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null

  return (
    media.media_details?.sizes?.[size]?.source_url ||
    media.source_url
  )
}

/**
 * Limpiar HTML de WordPress
 */
export function stripHtml(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Formatear fecha
 */
export function formatDate(dateString, options = {}) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}
