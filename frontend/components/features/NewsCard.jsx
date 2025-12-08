import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getImageUrl, stripHtml, formatDate } from '@/lib/wordpress'

export default function NewsCard({ noticia }) {
  const imageUrl = getImageUrl(noticia, 'medium_large')
  const excerpt = stripHtml(noticia.excerpt?.rendered || '')

  return (
    <Card
      component={Link}
      href={`/noticias/${noticia.slug}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          height: 220,
          overflow: 'hidden',
          bgcolor: 'grey.100',
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={noticia.title.rendered}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.08)',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0D5BA8 0%, #084A8A 100%)',
            }}
          >
            <Typography variant="h4" sx={{ color: 'white', opacity: 0.3, fontWeight: 700 }}>
              CMC
            </Typography>
          </Box>
        )}

        {/* Date Badge */}
        <Chip
          label={formatDate(noticia.date)}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />

        {/* Hover Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(13, 91, 168, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            '.MuiCard-root:hover &': {
              opacity: 1,
            },
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowForwardIcon sx={{ color: 'primary.main' }} />
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            color: 'text.primary',
            transition: 'color 0.2s ease',
            '.MuiCard-root:hover &': {
              color: 'primary.main',
            },
          }}
        >
          {noticia.title.rendered}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.7,
          }}
        >
          {excerpt}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            color: 'primary.main',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Leer mas
          <ArrowForwardIcon sx={{ fontSize: 18, ml: 0.5 }} />
        </Box>
      </CardContent>
    </Card>
  )
}
