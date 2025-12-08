import { useNoticias } from '../hooks/useNoticias'
import Loading from '../components/common/Loading'
import Error from '../components/common/Error'
import NewsList from '../components/features/NewsList'

export default function Noticias() {
  const { data: noticias, isLoading, error } = useNoticias({ per_page: 12 })

  return (
    <div className="noticias">
      <h1 className="section-title">Noticias</h1>

      {isLoading && <Loading message="Cargando noticias..." />}
      {error && <Error message="Error al cargar las noticias" />}

      {noticias && (
        <>
          {noticias.length > 0 ? (
            <NewsList noticias={noticias} />
          ) : (
            <p>No hay noticias publicadas.</p>
          )}
        </>
      )}
    </div>
  )
}
