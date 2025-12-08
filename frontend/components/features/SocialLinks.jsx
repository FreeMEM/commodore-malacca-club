/**
 * Enlaces a redes sociales
 * TODO: Configurar URLs reales
 */

const socialNetworks = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/malaccaclub',
    icon: 'FB',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/malaccaclub',
    icon: 'IG',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/malaccaclub',
    icon: 'X',
  },
]

export default function SocialLinks() {
  return (
    <div className="social-links">
      {socialNetworks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  )
}
