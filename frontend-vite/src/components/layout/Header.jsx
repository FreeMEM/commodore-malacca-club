import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Commodore Malacca Club" height="50" />
        </Link>
        <nav className="nav">
          <NavLink to="/quienes-somos">Quienes Somos</NavLink>
          <NavLink to="/calendario">Calendario</NavLink>
          <NavLink to="/noticias">Noticias</NavLink>
        </nav>
      </div>
    </header>
  )
}
