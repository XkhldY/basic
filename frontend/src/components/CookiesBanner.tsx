'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Cookie, Settings, CheckCircle } from 'lucide-react'
import { useCookies } from '@/hooks/useCookies'
import { CookiePreferences } from '@/utils/cookies'

const CookiesBanner = () => {
  const { 
    consent, 
    preferences, 
    hasConsent, 
    acceptAll, 
    rejectAll, 
    updatePreferences 
  } = useCookies()
  
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasConsent()) {
      setIsVisible(true)
    }
  }, [hasConsent])

  useEffect(() => {
    // Sync local preferences with global preferences
    if (preferences) {
      setLocalPreferences(preferences)
    }
  }, [preferences])

  const handleAcceptAll = () => {
    acceptAll()
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    updatePreferences(localPreferences)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    rejectAll()
    setIsVisible(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
                    <motion.div
         initial={{ opacity: 0, y: 100 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 100 }}
         className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-slate-950 shadow-2xl"
       >
         <div className="ml-2 mr-0">
           {!showPreferences ? (
                           // Main Banner
                                                       <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
               <div className="flex items-center gap-3">
                 <div className="flex-shrink-0">
                   <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                     <Cookie className="w-4 h-4 text-amber-400" />
                   </div>
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="text-base font-semibold text-white inline">
                     We value your privacy.
                   </h3>
                   <span className="text-xs text-gray-300 ml-2">
                     We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept all", you consent to our use of cookies.
                   </span>
                 </div>
               </div>
               
                               <div className="flex gap-2 flex-shrink-0 justify-center sm:justify-end">
                                                                                           <button
                      onClick={() => setShowPreferences(true)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-300 bg-slate-800/40 hover:bg-slate-700/60 rounded-md transition-colors duration-200 backdrop-blur-sm focus:outline-none focus:ring-0"
                    >
                      <Settings className="w-3 h-3" />
                      Preferences
                    </button>
                                       <button
                      onClick={handleRejectAll}
                      className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-slate-800/40 hover:bg-slate-700/60 rounded-md transition-colors duration-200 backdrop-blur-sm focus:outline-none focus:ring-0"
                    >
                      Reject all
                    </button>
                                       <button
                      onClick={handleAcceptAll}
                      className="px-3 py-1.5 text-xs font-medium text-gray-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-md transition-all duration-200 font-semibold shadow-lg focus:outline-none focus:ring-0"
                    >
                      Accept all
                    </button>
              </div>
            </div>
          ) : (
            // Preferences Modal
                         <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="bg-slate-900 rounded-lg p-4 sm:p-6"
             >
              <div className="flex items-center justify-between mb-4">
                                 <h3 className="text-lg font-semibold text-white">
                   Cookie Preferences
                 </h3>
                                 <button
                   onClick={() => setShowPreferences(false)}
                   className="text-gray-400 hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-0 border-0"
                   style={{ outline: 'none', boxShadow: 'none' }}
                 >
                   <X className="w-5 h-5" />
                 </button>
              </div>
              
                             <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                 {/* Necessary Cookies */}
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800 rounded-lg gap-2 sm:gap-0">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <CheckCircle className="w-4 h-4 text-green-400" />
                       <span className="font-medium text-white">Necessary</span>
                     </div>
                     <p className="text-sm text-gray-300">
                       Essential cookies required for the website to function properly. Cannot be disabled.
                     </p>
                   </div>
                   <div className="flex-shrink-0">
                     <input
                       type="checkbox"
                       checked={localPreferences.necessary}
                       disabled
                       className="w-4 h-4 text-amber-400 bg-slate-700 rounded focus:ring-0 focus:outline-none border-0"
                       style={{ outline: 'none', boxShadow: 'none' }}
                     />
                   </div>
                 </div>

                                 {/* Analytics Cookies */}
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800 rounded-lg gap-2 sm:gap-0">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-medium text-white">Analytics</span>
                     </div>
                     <p className="text-sm text-gray-300">
                       Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                     </p>
                   </div>
                   <div className="flex-shrink-0">
                     <input
                       type="checkbox"
                       checked={localPreferences.analytics}
                       onChange={() => togglePreference('analytics')}
                       className="w-4 h-4 text-amber-400 bg-slate-700 rounded focus:ring-0 focus:outline-none border-0"
                       style={{ outline: 'none', boxShadow: 'none' }}
                     />
                   </div>
                 </div>

                                 {/* Marketing Cookies */}
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800 rounded-lg gap-2 sm:gap-0">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-medium text-white">Marketing</span>
                     </div>
                     <p className="text-sm text-gray-300">
                       Used to track visitors across websites to display relevant and engaging advertisements.
                     </p>
                   </div>
                   <div className="flex-shrink-0">
                     <input
                       type="checkbox"
                       checked={localPreferences.marketing}
                       onChange={() => togglePreference('marketing')}
                       className="w-4 h-4 text-amber-400 bg-slate-700 rounded focus:ring-0 focus:outline-none border-0"
                       style={{ outline: 'none', boxShadow: 'none' }}
                     />
                   </div>
                 </div>

                                 {/* Functional Cookies */}
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-800 rounded-lg gap-2 sm:gap-0">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-medium text-white">Functional</span>
                     </div>
                     <p className="text-sm text-gray-300">
                       Enable enhanced functionality and personalization such as remembering your preferences and settings.
                     </p>
                   </div>
                   <div className="flex-shrink-0">
                     <input
                       type="checkbox"
                       checked={localPreferences.functional}
                       onChange={() => togglePreference('functional')}
                       className="w-4 h-4 text-amber-400 bg-slate-700 rounded focus:ring-0 focus:outline-none border-0"
                       style={{ outline: 'none', boxShadow: 'none' }}
                     />
                   </div>
                 </div>
              </div>

                             <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
                 <button
                   onClick={() => setShowPreferences(false)}
                   className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-0 border-0"
                   style={{ outline: 'none', boxShadow: 'none' }}
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleAcceptSelected}
                   className="px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-md transition-all duration-200 font-semibold focus:outline-none focus:ring-0"
                 >
                   Save Preferences
                 </button>
               </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CookiesBanner
