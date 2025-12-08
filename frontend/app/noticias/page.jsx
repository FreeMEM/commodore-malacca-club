import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { getNoticias } from '@/lib/wordpress'
import NewsList from '@/components/features/NewsList'
import SectionTitle from '@/components/ui/SectionTitle'

export const metadata = {
  title: 'Noticias',
  description: 'Ultimas noticias y novedades del Commodore Malacca Club.',
}

export const revalidate = 60

export default async function NoticiasPage() {
  const noticias = await getNoticias(12)

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Noticias"
          subtitle="Mantente informado sobre las novedades y actividades del club"
        />
        {noticias.length > 0 ? (
          <NewsList noticias={noticias} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            No hay noticias publicadas
          </Box>
        )}
      </Container>
    </Box>
  )
}
