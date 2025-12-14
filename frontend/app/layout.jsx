import { Raleway } from 'next/font/google'
import ThemeRegistry from '@/lib/ThemeRegistry'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/features/CookieBanner'
import Box from '@mui/material/Box'
import './globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata = {
  title: {
    default: 'Commodore Malacca Club',
    template: '%s | Commodore Malacca Club',
  },
  description: 'Sitio web oficial del Commodore Malacca Club',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={raleway.variable}>
      <body className={raleway.className}>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
          <CookieBanner />
        </ThemeRegistry>
      </body>
    </html>
  )
}
