/**
 * Servicio para eventos (CPT)
 */

import { fetchAPI } from './api'

/**
 * Obtener listado de eventos
 */
export function getEventos(params = {}) {
  const query = new URLSearchParams({
    per_page: 20,
    _embed: true,
    ...params,
  })
  return fetchAPI(`/wp/v2/eventos?${query}`)
}

/**
 * Obtener proximos eventos (endpoint personalizado)
 */
export function getProximosEventos(limit = 10) {
  return fetchAPI(`/mcclub/v1/eventos/proximos?limit=${limit}`)
}

/**
 * Obtener evento por slug
 */
export async function getEvento(slug) {
  const eventos = await fetchAPI(`/wp/v2/eventos?slug=${slug}&_embed=true`)
  return eventos[0] || null
}

/**
 * Inscribirse a un evento
 */
export function inscribirse(eventoId, datos) {
  return fetchAPI('/mcclub/v1/inscripciones', {
    method: 'POST',
    body: JSON.stringify({
      evento_id: eventoId,
      ...datos,
    }),
  })
}
