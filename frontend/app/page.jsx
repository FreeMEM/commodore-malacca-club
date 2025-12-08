import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getNoticias, getProximosEventos } from '@/lib/wordpress'
import HeroSlider from '@/components/features/HeroSlider'
import NewsSlider from '@/components/features/NewsSlider'
import EventSlider from '@/components/features/EventSlider'
import SectionTitle from '@/components/ui/SectionTitle'

export const revalidate = 60

export default async function HomePage() {
  const [noticias, eventos] = await Promise.all([
    getNoticias(6),
    getProximosEventos(6),
  ])

  return (
    <Box>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Ultimas Noticias Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <SectionTitle
            title="Ultimas Noticias"
            subtitle="Mantente informado sobre las novedades del mundo Commodore y del club"
          />

          <NewsSlider noticias={noticias} />

          {noticias.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                href="/noticias"
                variant="outlined"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Ver todas las noticias
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Proximos Eventos Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: 'white',
        }}
      >
        <Container maxWidth="lg">
          <SectionTitle
            title="Proximos Eventos"
            subtitle="Participa en nuestras actividades y conoce a otros entusiastas del Commodore"
          />

          <EventSlider eventos={eventos} />

          {eventos.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                href="/calendario"
                variant="outlined"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Ver todos los eventos
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0D5BA8 0%, #063A6E 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, fontWeight: 700, mb: 2 }}>
            Unete al Commodore Malacca Club
          </Box>
          <Box sx={{ opacity: 0.85, mb: 4, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.7 }}>
            Forma parte de nuestra comunidad de entusiastas de la retroinformatica.
            Comparte tu pasion por los ordenadores Commodore con otros aficionados.
          </Box>
          <Button
            component={Link}
            href="/quienes-somos"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#E31E24',
              color: 'white',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#B81A1F',
              },
            }}
          >
            Conoce mas sobre nosotros
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
