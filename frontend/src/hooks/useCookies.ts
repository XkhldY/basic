import { useState, useEffect, useCallback } from 'react'
import { 
  CookiePreferences, 
  CookieConsent, 
  getCookieConsent, 
  saveCookieConsent, 
  canUseAnalytics, 
  canUseMarketing, 
  canUseFunctional,
  updateCookieConsent,
  clearAllCookies,
  isGDPRCompliant,
  shouldRenewConsent
} from '@/utils/cookies'

export const useCookies = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load consent on mount
    const loadConsent = () => {
      const savedConsent = getCookieConsent()
      setConsent(savedConsent)
      setIsLoading(false)
    }

    loadConsent()
  }, [])

  const updatePreferences = useCallback((newPreferences: Partial<CookiePreferences>) => {
    if (consent) {
      const updatedPreferences = {
        ...consent.preferences,
        ...newPreferences
      }
      
      const updatedConsent: CookieConsent = {
        ...consent,
        preferences: updatedPreferences,
        timestamp: Date.now()
      }
      
      setConsent(updatedConsent)
      saveCookieConsent(updatedPreferences)
    }
  }, [consent])

  const acceptAll = useCallback(() => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    const newConsent: CookieConsent = {
      preferences: allPreferences,
      timestamp: Date.now(),
      version: '1.0'
    }
    
    setConsent(newConsent)
    saveCookieConsent(allPreferences)
  }, [])

  const rejectAll = useCallback(() => {
    const minimalPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    const newConsent: CookieConsent = {
      preferences: minimalPreferences,
      timestamp: Date.now(),
      version: '1.0'
    }
    
    setConsent(newConsent)
    saveCookieConsent(minimalPreferences)
  }, [])

  const clearConsent = useCallback(() => {
    clearAllCookies()
    setConsent(null)
  }, [])

  const hasConsent = useCallback(() => {
    return consent !== null
  }, [consent])

  const canUseAnalyticsCookies = useCallback(() => {
    return canUseAnalytics()
  }, [])

  const canUseMarketingCookies = useCallback(() => {
    return canUseMarketing()
  }, [])

  const canUseFunctionalCookies = useCallback(() => {
    return canUseFunctional()
  }, [])

  const isCompliant = useCallback(() => {
    return isGDPRCompliant()
  }, [])

  const needsRenewal = useCallback((maxAgeDays: number = 365) => {
    return shouldRenewConsent(maxAgeDays)
  }, [])

  return {
    // State
    consent,
    preferences: consent?.preferences,
    isLoading,
    
    // Actions
    updatePreferences,
    acceptAll,
    rejectAll,
    clearConsent,
    
    // Checks
    hasConsent,
    canUseAnalytics: canUseAnalyticsCookies,
    canUseMarketing: canUseMarketingCookies,
    canUseFunctional: canUseFunctionalCookies,
    isCompliant,
    needsRenewal,
    
    // Utility
    timestamp: consent?.timestamp,
    version: consent?.version
  }
}
