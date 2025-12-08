import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { getProximosEventos } from '@/lib/wordpress'
import EventList from '@/components/features/EventList'
import SectionTitle from '@/components/ui/SectionTitle'

export const metadata = {
  title: 'Calendario',
  description: 'Calendario de actividades y eventos del Commodore Malacca Club.',
}

export const revalidate = 60

export default async function CalendarioPage() {
  const eventos = await getProximosEventos(20)

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Calendario de Actividades"
          subtitle="Proximos eventos y actividades del club. Inscribete para participar."
        />
        {eventos.length > 0 ? (
          <EventList eventos={eventos} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            No hay eventos programados por el momento
          </Box>
        )}
      </Container>
    </Box>
  )
}
