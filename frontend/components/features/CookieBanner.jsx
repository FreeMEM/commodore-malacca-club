'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CookieIcon from '@mui/icons-material/Cookie'

const COOKIE_CONSENT_KEY = 'mcclub_cookie_consent'

const defaultPreferences = {
  necessary: true, // Siempre activas
  analytics: false,
  functional: false,
  marketing: false,
}

const cookieCategories = [
  {
    id: 'necessary',
    title: 'Cookies necesarias',
    description:
      'Estas cookies son esenciales para el funcionamiento del sitio web. Sin ellas, el sitio no funcionaría correctamente.',
    required: true,
  },
  {
    id: 'analytics',
    title: 'Cookies analíticas',
    description:
      'Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información de forma anónima.',
    required: false,
  },
  {
    id: 'functional',
    title: 'Cookies funcionales',
    description:
      'Permiten funcionalidades adicionales como recordar preferencias de usuario y personalizar la experiencia.',
    required: false,
  },
  {
    id: 'marketing',
    title: 'Cookies de marketing',
    description:
      'Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas publicitarias.',
    required: false,
  },
]

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState(defaultPreferences)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Pequeño delay para evitar flash en la carga inicial
      const timer = setTimeout(() => setShowBanner(true), 500)
      return () => clearTimeout(timer)
    } else {
      try {
        const savedPrefs = JSON.parse(consent)
        setPreferences(savedPrefs)
      } catch (e) {
        setShowBanner(true)
      }
    }
  }, [])

  const saveConsent = (prefs) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowPreferences(false)

    // Disparar evento personalizado para que otros scripts puedan reaccionar
    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdate', { detail: prefs })
    )
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
    }
    saveConsent(allAccepted)
  }

  const handleRejectNonEssential = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
    }
    saveConsent(onlyNecessary)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const handlePreferenceChange = (category) => (event) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: event.target.checked,
    }))
  }

  if (!showBanner && !showPreferences) return null

  return (
    <>
      {/* Banner principal */}
      <Slide direction="up" in={showBanner && !showPreferences} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            p: { xs: 2, sm: 3 },
            borderRadius: 0,
            borderTop: `3px solid ${theme.palette.primary.main}`,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
              <CookieIcon color="primary" sx={{ fontSize: 28, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Utilizamos cookies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este sitio web utiliza cookies para mejorar tu experiencia de navegación.
                  Puedes aceptar todas las cookies, rechazar las no esenciales o personalizar
                  tus preferencias. Consulta nuestra{' '}
                  <Typography
                    component="a"
                    href="/politica-cookies"
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: 'underline' }}
                  >
                    política de cookies
                  </Typography>{' '}
                  para más información.
                </Typography>
              </Box>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{
                flexShrink: 0,
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                size={isMobile ? 'medium' : 'small'}
                onClick={() => setShowPreferences(true)}
                fullWidth={isMobile}
              >
                Personalizar
              </Button>
              <Button
                variant="outlined"
                size={isMobile ? 'medium' : 'small'}
                onClick={handleRejectNonEssential}
                fullWidth={isMobile}
              >
                Rechazar
              </Button>
              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'small'}
                onClick={handleAcceptAll}
                fullWidth={isMobile}
              >
                Aceptar todas
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Slide>

      {/* Modal de preferencias */}
      <Dialog
        open={showPreferences}
        onClose={() => setShowPreferences(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CookieIcon color="primary" />
            <Typography variant="h6">Preferencias de cookies</Typography>
          </Box>
          <IconButton
            onClick={() => setShowPreferences(false)}
            size="small"
            aria-label="cerrar"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            Gestiona tus preferencias de cookies. Las cookies necesarias no pueden
            desactivarse ya que son esenciales para el funcionamiento del sitio.
          </Typography>

          <Stack spacing={2} divider={<Divider />}>
            {cookieCategories.map((category) => (
              <Box key={category.id}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences[category.id]}
                      onChange={handlePreferenceChange(category.id)}
                      disabled={category.required}
                      color="primary"
                    />
                  }
                  label={
                    <Typography fontWeight={500}>
                      {category.title}
                      {category.required && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ ml: 1, color: 'text.secondary' }}
                        >
                          (siempre activas)
                        </Typography>
                      )}
                    </Typography>
                  }
                  sx={{ mb: 0.5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                  {category.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleRejectNonEssential} variant="outlined">
            Solo necesarias
          </Button>
          <Button onClick={handleSavePreferences} variant="contained">
            Guardar preferencias
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
