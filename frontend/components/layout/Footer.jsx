import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X'
import EmailIcon from '@mui/icons-material/Email'
import PlaceIcon from '@mui/icons-material/Place'

const socialLinks = [
  { name: 'Facebook', url: 'https://facebook.com/malaccaclub', icon: FacebookIcon },
  { name: 'Instagram', url: 'https://instagram.com/malaccaclub', icon: InstagramIcon },
  { name: 'Twitter', url: 'https://twitter.com/malaccaclub', icon: XIcon },
]

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Quienes Somos', href: '/quienes-somos' },
  { label: 'Calendario', href: '/calendario' },
  { label: 'Noticias', href: '/noticias' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0A1628',
        color: 'white',
        mt: 'auto',
      }}
    >
      {/* Main Footer */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Logo & Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Image
                src="/logo.png"
                alt="Commodore Malacca Club"
                width={48}
                height={48}
              />
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Commodore
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, letterSpacing: '0.05em' }}>
                  MALACCA CLUB
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, mb: 3 }}>
              Un espacio para entusiastas y aficionados, donde compartimos experiencias
              y organizamos actividades en un ambiente de camaraderia.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  }}
                >
                  <social.icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Enlaces
            </Typography>
            <Stack spacing={1.5}>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: 'white' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Contacto
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <PlaceIcon sx={{ fontSize: 20, opacity: 0.7, mt: 0.3 }} />
                <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>
                  Club Commodore Malacca
                  <br />
                  Málaga, España
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20, opacity: 0.7 }} />
                <Typography
                  variant="body2"
                  component="a"
                  href="mailto:info@malaccaclub.com"
                  sx={{
                    opacity: 0.7,
                    color: 'inherit',
                    textDecoration: 'none',
                    '&:hover': { opacity: 1 },
                  }}
                >
                  info@malaccaclub.com
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            &copy; {currentYear} Commodore Malacca Club. Todos los derechos reservados.
          </Typography>
          <Typography
            variant="body2"
            component="a"
            href="https://freemem.space"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              opacity: 0.5,
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { opacity: 0.8 },
            }}
          >
            Developed by FreeMEM
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
