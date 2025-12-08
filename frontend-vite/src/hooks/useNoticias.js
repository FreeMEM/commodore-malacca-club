/**
 * Hooks para noticias
 */

import { useQuery } from '@tanstack/react-query'
import { getNoticias, getNoticia } from '../services/posts'

/**
 * Hook para listado de noticias
 */
export function useNoticias(params = {}) {
  return useQuery({
    queryKey: ['noticias', params],
    queryFn: () => getNoticias(params),
  })
}

/**
 * Hook para una noticia por slug
 */
export function useNoticia(slug) {
  return useQuery({
    queryKey: ['noticia', slug],
    queryFn: () => getNoticia(slug),
    enabled: !!slug,
  })
}
