/**
 * Hooks para eventos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEventos, getProximosEventos, inscribirse } from '../services/eventos'

/**
 * Hook para listado de eventos
 */
export function useEventos(params = {}) {
  return useQuery({
    queryKey: ['eventos', params],
    queryFn: () => getEventos(params),
  })
}

/**
 * Hook para proximos eventos
 */
export function useProximosEventos(limit = 10) {
  return useQuery({
    queryKey: ['eventos', 'proximos', limit],
    queryFn: () => getProximosEventos(limit),
  })
}

/**
 * Hook para inscripcion a evento
 */
export function useInscripcion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventoId, datos }) => inscribirse(eventoId, datos),
    onSuccess: () => {
      // Invalidar cache de eventos para actualizar plazas
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    },
  })
}
