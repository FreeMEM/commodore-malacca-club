import { useState } from 'react'
import { formatDate } from '../../services/api'
import InscripcionForm from './InscripcionForm'

export default function EventCard({ evento }) {
  const [showForm, setShowForm] = useState(false)

  const {
    id,
    title,
    excerpt,
    fecha_evento,
    hora_inicio,
    hora_fin,
    ubicacion,
    plazas,
    inscritos,
    plazas_disponibles,
    permite_inscripcion,
    imagen,
  } = evento

  const hayPlazas = plazas === 0 || plazas_disponibles > 0

  return (
    <article className="card event-card">
      {imagen && (
        <img
          src={imagen}
          alt={title}
          className="card-image"
          loading="lazy"
        />
      )}
      <div className="card-content">
        <span className="event-date">
          {formatDate(fecha_evento)}
          {hora_inicio && ` - ${hora_inicio}`}
          {hora_fin && ` a ${hora_fin}`}
        </span>

        <h3 className="card-title">{title}</h3>

        {ubicacion && (
          <p className="event-location">{ubicacion}</p>
        )}

        {excerpt && (
          <p className="card-excerpt">{excerpt}</p>
        )}

        <div className="event-spots">
          {plazas > 0 ? (
            <span>
              Plazas: {inscritos}/{plazas}
              {!hayPlazas && ' (Completo)'}
            </span>
          ) : (
            <span>Plazas ilimitadas</span>
          )}

          {permite_inscripcion && hayPlazas && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : 'Inscribirse'}
            </button>
          )}
        </div>

        {showForm && (
          <InscripcionForm
            eventoId={id}
            eventoTitle={title}
            onSuccess={() => setShowForm(false)}
          />
        )}
      </div>
    </article>
  )
}
