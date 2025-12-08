/**
 * Hook para paginas de WordPress
 */

import { useQuery } from '@tanstack/react-query'
import { getPage } from '../services/pages'

/**
 * Hook para obtener una pagina por slug
 */
export function usePage(slug) {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPage(slug),
    enabled: !!slug,
  })
}
