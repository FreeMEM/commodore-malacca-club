'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import DynamicBackground from '@/components/three/DynamicBackground'

export default function HeroSlider() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', md: '85vh' },
        minHeight: { xs: 500, md: 600 },
        maxHeight: 800,
        overflow: 'hidden',
      }}
    >
      {/* 3D Wireframe Background */}
      <DynamicBackground />

      {/* Semi-transparent overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(13,91,168,0.65) 0%, rgba(6,58,110,0.75) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 700, color: 'white' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Bienvenidos al{' '}
            <Box
              component="span"
              sx={{
                color: '#FF6B6B',
                display: 'block',
              }}
            >
              Commodore Malacca Club
            </Box>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              mb: 4,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              maxWidth: 550,
            }}
          >
            Un espacio para entusiastas de la retroinformatica, donde compartimos
            nuestra pasion por los ordenadores Commodore y organizamos eventos unicos.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <Button
              component={Link}
              href="/calendario"
              variant="contained"
              size="large"
              startIcon={<CalendarMonthIcon />}
              sx={{
                bgcolor: '#E31E24',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#B81A1F',
                },
              }}
            >
              Ver Eventos
            </Button>
            <Button
              component={Link}
              href="/quienes-somos"
              variant="outlined"
              size="large"
              startIcon={<GroupsIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.5)',
                borderWidth: 2,
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'white',
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Conocenos
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Bottom wave decoration */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          zIndex: 3,
          '& svg': {
            display: 'block',
            width: '100%',
            height: 'auto',
          },
        }}
      >
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 100V60C240 20 480 0 720 20C960 40 1200 80 1440 60V100H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </Box>

    </Box>
  )
}
