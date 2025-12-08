import { useState } from 'react'
import { useInscripcion } from '../../hooks/useEventos'

export default function InscripcionForm({ eventoId, eventoTitle, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  })

  const { mutate, isPending, isError, error, isSuccess } = useInscripcion()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(
      { eventoId, datos: formData },
      {
        onSuccess: () => {
          setTimeout(onSuccess, 2000)
        },
      }
    )
  }

  if (isSuccess) {
    return (
      <div className="inscripcion-success" style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px' }}>
        <p><strong>Inscripcion realizada correctamente</strong></p>
        <p>Te has inscrito a: {eventoTitle}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre completo *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefono">Telefono</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          disabled={isPending}
        />
      </div>

      {isError && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          {error?.message || 'Error al procesar la inscripcion'}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Confirmar Inscripcion'}
      </button>
    </form>
  )
}
