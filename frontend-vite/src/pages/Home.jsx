import { Link } from 'react-router-dom'
import { useNoticias } from '../hooks/useNoticias'
import { useProximosEventos } from '../hooks/useEventos'
import Loading from '../components/common/Loading'
import Error from '../components/common/Error'
import NewsList from '../components/features/NewsList'
import EventList from '../components/features/EventList'

export default function Home() {
  const { data: noticiasData, isLoading: loadingNoticias, error: errorNoticias } = useNoticias({ per_page: 3 })
  const { data: eventosData, isLoading: loadingEventos, error: errorEventos } = useProximosEventos(3)

  return (
    <div className="home">
      <section className="hero">
        <h1>Commodore Malacca Club</h1>
        <p>Bienvenidos a nuestro club</p>
      </section>

      <section className="section">
        <h2 className="section-title">Proximos Eventos</h2>
        {loadingEventos && <Loading message="Cargando eventos..." />}
        {errorEventos && <Error message="Error al cargar eventos" />}
        {eventosData && <EventList eventos={eventosData.eventos} />}
        {eventosData?.eventos?.length > 0 && (
          <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/calendario" className="btn btn-secondary">
              Ver todos los eventos
            </Link>
          </p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Ultimas Noticias</h2>
        {loadingNoticias && <Loading message="Cargando noticias..." />}
        {errorNoticias && <Error message="Error al cargar noticias" />}
        {noticiasData && <NewsList noticias={noticiasData} />}
        {noticiasData?.length > 0 && (
          <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/noticias" className="btn btn-secondary">
              Ver todas las noticias
            </Link>
          </p>
        )}
      </section>
    </div>
  )
}
