'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const CLAVE = 'mcclub_cookie_consent'

function aceptaAnaliticas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || '{}').analytics === true
  } catch {
    return false
  }
}

/**
 * Google Analytics solo si el visitante ha aceptado las cookies analíticas en el
 * aviso (CookieBanner). Hasta entonces no se carga nada de Google. Si las acepta
 * después, se carga en ese momento (evento cookieConsentUpdate).
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const [permiso, setPermiso] = useState(false)

  useEffect(() => {
    setPermiso(aceptaAnaliticas())
    const cambio = (e) => setPermiso(e.detail?.analytics === true)
    window.addEventListener('cookieConsentUpdate', cambio)
    return () => window.removeEventListener('cookieConsentUpdate', cambio)
  }, [])

  if (!gaId || !permiso) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
