import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import NewsCard from './NewsCard'

export default function NewsList({ noticias }) {
  if (!noticias || noticias.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay noticias disponibles.
      </Typography>
    )
  }

  return (
    <Grid container spacing={3}>
      {noticias.map((noticia) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={noticia.id}>
          <NewsCard noticia={noticia} />
        </Grid>
      ))}
    </Grid>
  )
}
