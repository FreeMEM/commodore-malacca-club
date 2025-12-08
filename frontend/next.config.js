/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'cbmmalacca.freemem.space',
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
