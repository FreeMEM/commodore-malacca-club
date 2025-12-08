'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { crearInscripcion } from '@/lib/wordpress'

export default function InscripcionForm({ eventoId, eventoTitle, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      await crearInscripcion(eventoId, formData)
      setStatus('success')
      setTimeout(onSuccess, 2000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Error al procesar la inscripcion')
    }
  }

  if (status === 'success') {
    return (
      <Alert severity="success">
        Inscripcion realizada correctamente para: <strong>{eventoTitle}</strong>
      </Alert>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        required
        label="Nombre completo"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        disabled={status === 'loading'}
        size="small"
        margin="dense"
      />

      <TextField
        fullWidth
        required
        type="email"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={status === 'loading'}
        size="small"
        margin="dense"
      />

      <TextField
        fullWidth
        type="tel"
        label="Telefono (opcional)"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        disabled={status === 'loading'}
        size="small"
        margin="dense"
      />

      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={status === 'loading'}
        sx={{ mt: 2 }}
      >
        {status === 'loading' ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Confirmar Inscripcion'
        )}
      </Button>
    </Box>
  )
}
