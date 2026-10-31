/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone para Docker
  output: 'standalone',

  // Sin la cabecera «x-powered-by: Next.js»: no hace falta decir con qué está hecha
  poweredByHeader: false,

  // Permitir imagenes de WordPress
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'commodoremalacca.club',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Variables de entorno publicas
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
  },
}

module.exports = nextConfig
