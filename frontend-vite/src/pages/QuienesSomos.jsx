import { usePage } from '../hooks/usePage'
import Loading from '../components/common/Loading'
import Error from '../components/common/Error'

export default function QuienesSomos() {
  const { data: page, isLoading, error } = usePage('quienes-somos')

  if (isLoading) return <Loading message="Cargando..." />
  if (error) return <Error message="Error al cargar la pagina" />

  // Si no hay pagina en WordPress, mostrar contenido por defecto
  if (!page) {
    return (
      <div className="page-content">
        <h1>Quienes Somos</h1>
        <p>
          El Commodore Malacca Club es un club dedicado a reunir a entusiastas
          y aficionados en un ambiente de camaraderia y colaboracion.
        </p>
        <p>
          Fundado con la mision de crear un espacio donde compartir experiencias,
          organizar actividades y fomentar el aprendizaje continuo entre nuestros miembros.
        </p>
        <h2>Nuestra Mision</h2>
        <p>
          Promover el intercambio de conocimientos y experiencias entre nuestros miembros,
          organizando actividades que fomenten la participacion activa de la comunidad.
        </p>
        <h2>Contacto</h2>
        <p>
          Para mas informacion sobre como unirte al club o sobre nuestras actividades,
          no dudes en contactarnos.
        </p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <h1>{page.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </div>
  )
}
