'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import GroupIcon from '@mui/icons-material/Group'
import { formatDate, decodeHtmlEntities } from '@/lib/wordpress'
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
  const plazasText = plazas > 0
    ? `${plazas_disponibles} plazas disponibles`
    : 'Sin limite de plazas'

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Image / Header */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          overflow: 'hidden',
        }}
      >
        {imagen ? (
          <Box
            component="img"
            src={imagen}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #0D5BA8 0%, #3A7FC4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 64, color: 'white', opacity: 0.3 }} />
          </Box>
        )}

        {/* Status Badge */}
        {!hayPlazas && (
          <Chip
            label="Completo"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'secondary.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Date and Time */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />}
            label={formatDate(fecha_evento)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          {hora_inicio && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />}
              label={hora_fin ? `${hora_inicio} - ${hora_fin}` : hora_inicio}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        {/* Location */}
        {ubicacion && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
            <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary">
              {ubicacion}
            </Typography>
          </Box>
        )}

        {/* Excerpt */}
        {excerpt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}
          >
            {decodeHtmlEntities(excerpt)}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Footer: Capacity + Action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GroupIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {plazasText}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Action Button */}
      {permite_inscripcion && (
        <Box sx={{ px: 3, pb: 3 }}>
          <Button
            variant={showForm ? 'outlined' : 'contained'}
            color={hayPlazas ? 'primary' : 'inherit'}
            onClick={() => setShowForm(!showForm)}
            disabled={!hayPlazas}
            fullWidth
            size="large"
          >
            {showForm ? 'Cancelar' : hayPlazas ? 'Inscribirse' : 'Completo'}
          </Button>
        </Box>
      )}

      {/* Inscription Form */}
      <Collapse in={showForm}>
        <Box sx={{ px: 3, pb: 3 }}>
          <InscripcionForm
            eventoId={id}
            eventoTitle={title}
            onSuccess={() => setShowForm(false)}
          />
        </Box>
      </Collapse>
    </Card>
  )
}
