/**
 * Servicio para paginas de WordPress
 */

import { fetchAPI } from './api'

/**
 * Obtener pagina por slug
 */
export async function getPage(slug) {
  const pages = await fetchAPI(`/wp/v2/pages?slug=${slug}&_embed=true`)
  return pages[0] || null
}

/**
 * Obtener pagina por ID
 */
export function getPageById(id) {
  return fetchAPI(`/wp/v2/pages/${id}?_embed=true`)
}
