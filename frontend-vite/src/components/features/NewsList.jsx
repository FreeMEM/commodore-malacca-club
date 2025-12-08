import NewsCard from './NewsCard'

export default function NewsList({ noticias }) {
  if (!noticias || noticias.length === 0) {
    return <p>No hay noticias disponibles.</p>
  }

  return (
    <div className="card-grid">
      {noticias.map((noticia) => (
        <NewsCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  )
}
