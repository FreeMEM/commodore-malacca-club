import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { getPageBySlug, sanitizeHtml, fixContentUrls } from '@/lib/wordpress'
import SectionTitle from '@/components/ui/SectionTitle'

export const metadata = {
  title: 'Quienes Somos',
  description: 'Conoce al Commodore Malacca Club, nuestra historia y mision.',
}

export const revalidate = 300

export default async function QuienesSomosPage() {
  const page = await getPageBySlug('quienes-somos')

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Quienes Somos"
          subtitle="Conoce nuestra historia, mision y valores"
        />

        <Paper sx={{ p: { xs: 3, md: 5 }, maxWidth: 900, mx: 'auto' }}>
          {page ? (
            <Box
              sx={{
                '& p': { mb: 2, lineHeight: 1.8 },
                '& h2': { mt: 4, mb: 2, fontWeight: 600 },
                '& h3': { mt: 3, mb: 1.5, fontWeight: 600 },
                '& a': { color: 'primary.main' },
                '& ul, & ol': { pl: 3, mb: 2 },
                '& li': { mb: 0.5 },
                '& img': { maxWidth: '100%', borderRadius: 2, my: 2 },
              }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(fixContentUrls(page.content.rendered)) }}
            />
          ) : (
            <>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                El Commodore Malacca Club es un club dedicado a reunir a entusiastas
                y aficionados en un ambiente de camaraderia y colaboracion.
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                Fundado con la mision de crear un espacio donde compartir experiencias,
                organizar actividades y fomentar el aprendizaje continuo entre nuestros miembros.
              </Typography>

              <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                Nuestra Mision
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                Promover el intercambio de conocimientos y experiencias entre nuestros miembros,
                organizando actividades que fomenten la participacion activa de la comunidad.
              </Typography>

              <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                Contacto
              </Typography>
              <Typography paragraph sx={{ lineHeight: 1.8 }}>
                Para mas informacion sobre como unirte al club o sobre nuestras actividades,
                no dudes en contactarnos.
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
