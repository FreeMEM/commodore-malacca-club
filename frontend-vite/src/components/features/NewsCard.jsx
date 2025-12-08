import { Link } from 'react-router-dom'
import { getImageUrl, stripHtml, formatDate } from '../../services/api'

export default function NewsCard({ noticia }) {
  const imageUrl = getImageUrl(noticia)
  const excerpt = stripHtml(noticia.excerpt?.rendered || '')

  return (
    <article className="card news-card">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={noticia.title.rendered}
          className="card-image"
          loading="lazy"
        />
      )}
      <div className="card-content">
        <h3 className="card-title">
          <Link to={`/noticias/${noticia.slug}`}>
            {noticia.title.rendered}
          </Link>
        </h3>
        <div className="card-meta">
          {formatDate(noticia.date)}
        </div>
        <p className="card-excerpt">
          {excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt}
        </p>
        <Link to={`/noticias/${noticia.slug}`} className="btn btn-secondary">
          Leer mas
        </Link>
      </div>
    </article>
  )
}
