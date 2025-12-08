import { useProximosEventos } from '../hooks/useEventos'
import Loading from '../components/common/Loading'
import Error from '../components/common/Error'
import EventList from '../components/features/EventList'

export default function Calendario() {
  const { data, isLoading, error } = useProximosEventos(20)

  return (
    <div className="calendario">
      <h1 className="section-title">Calendario de Actividades</h1>

      {isLoading && <Loading message="Cargando eventos..." />}
      {error && <Error message="Error al cargar el calendario" />}

      {data && (
        <>
          {data.eventos?.length > 0 ? (
            <EventList eventos={data.eventos} />
          ) : (
            <p>No hay eventos programados proximamente.</p>
          )}
        </>
      )}
    </div>
  )
}
