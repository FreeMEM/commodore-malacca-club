'use client'

import { useState, useEffect, useCallback } from 'react'

const COOKIE_CONSENT_KEY = 'mcclub_cookie_consent'

const defaultPreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
}

/**
 * Hook para gestionar y consultar las preferencias de cookies
 * @returns {Object} - { preferences, hasConsent, isAllowed, updatePreferences }
 */
export function useCookieConsent() {
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const loadConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (consent) {
        try {
          const savedPrefs = JSON.parse(consent)
          setPreferences(savedPrefs)
          setHasConsent(true)
        } catch (e) {
          setHasConsent(false)
        }
      }
    }

    loadConsent()

    // Escuchar cambios en las preferencias
    const handleConsentUpdate = (event) => {
      setPreferences(event.detail)
      setHasConsent(true)
    }

    window.addEventListener('cookieConsentUpdate', handleConsentUpdate)

    return () => {
      window.removeEventListener('cookieConsentUpdate', handleConsentUpdate)
    }
  }, [])

  /**
   * Verifica si una categoría de cookies está permitida
   * @param {string} category - 'necessary' | 'analytics' | 'functional' | 'marketing'
   * @returns {boolean}
   */
  const isAllowed = useCallback(
    (category) => {
      return preferences[category] === true
    },
    [preferences]
  )

  /**
   * Actualiza las preferencias de cookies
   * @param {Object} newPreferences
   */
  const updatePreferences = useCallback((newPreferences) => {
    const updated = { ...defaultPreferences, ...newPreferences, necessary: true }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated))
    setPreferences(updated)
    setHasConsent(true)
    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdate', { detail: updated })
    )
  }, [])

  return {
    preferences,
    hasConsent,
    isAllowed,
    updatePreferences,
  }
}

/**
 * Obtiene las preferencias de cookies de forma síncrona (para uso en scripts)
 * @returns {Object|null}
 */
export function getCookieConsent() {
  if (typeof window === 'undefined') return null

  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (!consent) return null

  try {
    return JSON.parse(consent)
  } catch (e) {
    return null
  }
}
