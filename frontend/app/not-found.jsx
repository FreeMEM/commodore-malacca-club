import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'

export default function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        La pagina que buscas no existe.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        size="large"
      >
        Volver al inicio
      </Button>
    </Box>
  )
}
