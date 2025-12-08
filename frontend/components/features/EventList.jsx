import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import EventCard from './EventCard'

export default function EventList({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <Typography color="text.secondary">
        No hay eventos proximos.
      </Typography>
    )
  }

  return (
    <Grid container spacing={3}>
      {eventos.map((evento) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={evento.id}>
          <EventCard evento={evento} />
        </Grid>
      ))}
    </Grid>
  )
}
