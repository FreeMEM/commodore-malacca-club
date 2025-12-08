/**
 * Servicio para noticias (posts de WordPress)
 */

import { fetchAPI } from './api'

/**
 * Obtener listado de noticias
 */
export function getNoticias(params = {}) {
  const query = new URLSearchParams({
    per_page: 10,
    _embed: true,
    ...params,
  })
  return fetchAPI(`/wp/v2/posts?${query}`)
}

/**
 * Obtener una noticia por slug
 */
export async function getNoticia(slug) {
  const posts = await fetchAPI(`/wp/v2/posts?slug=${slug}&_embed=true`)
  return posts[0] || null
}

/**
 * Obtener una noticia por ID
 */
export function getNoticiaById(id) {
  return fetchAPI(`/wp/v2/posts/${id}?_embed=true`)
}
