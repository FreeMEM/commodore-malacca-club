import SocialLinks from '../features/SocialLinks'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>&copy; {currentYear} Commodore Malacca Club. Todos los derechos reservados.</p>
        <SocialLinks />
      </div>
    </footer>
  )
}
