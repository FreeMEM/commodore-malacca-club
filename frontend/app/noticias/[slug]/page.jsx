import Link from 'next/link'
import { notFound } from 'next/navigation'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { getNoticiaBySlug, getAllNoticiasSlugs, getImageUrl, formatDate, removeFirstImage, fixContentUrls } from '@/lib/wordpress'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllNoticiasSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const noticia = await getNoticiaBySlug(params.slug)

  if (!noticia) {
    return {
      title: 'Noticia no encontrada',
    }
  }

  return {
    title: noticia.title.rendered,
    description: noticia.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160),
  }
}

export default async function NoticiaDetallePage({ params }) {
  const noticia = await getNoticiaBySlug(params.slug)

  if (!noticia) {
    notFound()
  }

  const imageUrl = getImageUrl(noticia, 'large')
  // Si hay imagen de cabecera, eliminar la primera imagen del contenido para evitar duplicados
  // También arreglar URLs de localhost para acceso desde otros dispositivos
  const rawContent = imageUrl
    ? removeFirstImage(noticia.content.rendered)
    : noticia.content.rendered
  const content = fixContentUrls(rawContent)

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Button
          component={Link}
          href="/noticias"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Volver a noticias
        </Button>

        <Paper component="article" sx={{ overflow: 'hidden' }}>
          {/* Featured Image */}
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={noticia.title.rendered}
              sx={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'cover',
              }}
            />
          )}

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Date */}
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />}
              label={formatDate(noticia.date)}
              size="small"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 4,
                lineHeight: 1.3,
              }}
            >
              {noticia.title.rendered}
            </Typography>

            {/* Content */}
            <Box
              sx={{
                '& p': { mb: 2, lineHeight: 1.8 },
                '& h2': { mt: 4, mb: 2, fontWeight: 600 },
                '& h3': { mt: 3, mb: 1.5, fontWeight: 600 },
                '& a': { color: 'primary.main' },
                '& ul, & ol': { pl: 3, mb: 2 },
                '& li': { mb: 0.5 },
                '& img': { maxWidth: '100%', borderRadius: 2, my: 2 },
                '& blockquote': {
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  pl: 3,
                  py: 1,
                  my: 3,
                  bgcolor: 'grey.50',
                  fontStyle: 'italic',
                },
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
