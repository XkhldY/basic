export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export interface CookieConsent {
  preferences: CookiePreferences
  timestamp: number
  version: string
}

// Cookie utility functions
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

export const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const hasCookieConsent = (): boolean => {
  if (typeof localStorage === 'undefined') return false
  
  const consent = localStorage.getItem('cookieConsent')
  return consent !== null
}

export const getCookieConsent = (): CookieConsent | null => {
  if (typeof localStorage === 'undefined') return null
  
  try {
    const consent = localStorage.getItem('cookieConsent')
    if (consent) {
      const parsed = JSON.parse(consent)
      // Handle legacy format (just preferences object)
      if (parsed.preferences) {
        return parsed
      } else {
        // Convert legacy format to new format
        return {
          preferences: parsed,
          timestamp: Date.now(),
          version: '1.0'
        }
      }
    }
  } catch (error) {
    console.error('Error parsing cookie consent:', error)
  }
  
  return null
}

export const saveCookieConsent = (preferences: CookiePreferences): void => {
  if (typeof localStorage === 'undefined') return
  
  const consent: CookieConsent = {
    preferences,
    timestamp: Date.now(),
    version: '1.0'
  }
  
  localStorage.setItem('cookieConsent', JSON.stringify(consent))
  
  // Set actual cookies based on preferences
  if (preferences.analytics) {
    setCookie('analytics', 'true', 365)
  } else {
    deleteCookie('analytics')
  }
  
  if (preferences.marketing) {
    setCookie('marketing', 'true', 365)
  } else {
    deleteCookie('marketing')
  }
  
  if (preferences.functional) {
    setCookie('functional', 'true', 365)
  } else {
    deleteCookie('functional')
  }
  
  // Always set necessary cookies
  setCookie('necessary', 'true', 365)
}

export const canUseAnalytics = (): boolean => {
  const consent = getCookieConsent()
  return consent?.preferences.analytics || false
}

export const canUseMarketing = (): boolean => {
  const consent = getCookieConsent()
  return consent?.preferences.marketing || false
}

export const canUseFunctional = (): boolean => {
  const consent = getCookieConsent()
  return consent?.preferences.functional || false
}

export const clearAllCookies = (): void => {
  if (typeof document === 'undefined') return
  
  // Get all cookies and delete them
  const cookies = document.cookie.split(';')
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    if (name && name !== 'necessary') {
      deleteCookie(name)
    }
  })
  
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('cookieConsent')
  }
}

export const updateCookieConsent = (newPreferences: Partial<CookiePreferences>): void => {
  const currentConsent = getCookieConsent()
  if (currentConsent) {
    const updatedPreferences = {
      ...currentConsent.preferences,
      ...newPreferences
    }
    saveCookieConsent(updatedPreferences)
  }
}

// GDPR compliance helpers
export const isGDPRCompliant = (): boolean => {
  const consent = getCookieConsent()
  return consent !== null && consent.timestamp > 0
}

export const getConsentAge = (): number | null => {
  const consent = getCookieConsent()
  if (!consent) return null
  
  return Date.now() - consent.timestamp
}

export const shouldRenewConsent = (maxAgeDays: number = 365): boolean => {
  const consentAge = getConsentAge()
  if (!consentAge) return true
  
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000
  return consentAge > maxAgeMs
}
