import { useParams, Link } from 'react-router-dom'
import { useNoticia } from '../hooks/useNoticias'
import { getImageUrl, formatDate } from '../services/api'
import Loading from '../components/common/Loading'
import Error from '../components/common/Error'

export default function NoticiaDetalle() {
  const { slug } = useParams()
  const { data: noticia, isLoading, error } = useNoticia(slug)

  if (isLoading) return <Loading message="Cargando noticia..." />
  if (error) return <Error message="Error al cargar la noticia" />
  if (!noticia) return <Error message="Noticia no encontrada" />

  const imageUrl = getImageUrl(noticia, 'large')

  return (
    <article className="noticia-detalle page-content">
      <Link to="/noticias" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        &larr; Volver a noticias
      </Link>

      <h1>{noticia.title.rendered}</h1>

      <p className="card-meta" style={{ marginBottom: '1.5rem' }}>
        Publicado el {formatDate(noticia.date)}
      </p>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={noticia.title.rendered}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem' }}
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: noticia.content.rendered }} />
    </article>
  )
}
