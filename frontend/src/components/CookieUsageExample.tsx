'use client'

import { useCookies } from '@/hooks/useCookies'
import { motion } from 'framer-motion'

const CookieUsageExample = () => {
  const { 
    preferences, 
    canUseAnalytics, 
    canUseMarketing, 
    canUseFunctional,
    updatePreferences,
    clearConsent 
  } = useCookies()

  if (!preferences) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cookie Usage Example
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Analytics Cookies:</span>
          <span className={`text-sm font-medium ${canUseAnalytics() ? 'text-green-600' : 'text-red-600'}`}>
            {canUseAnalytics() ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Marketing Cookies:</span>
          <span className={`text-sm font-medium ${canUseMarketing() ? 'text-green-600' : 'text-red-600'}`}>
            {canUseMarketing() ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Functional Cookies:</span>
          <span className={`text-sm font-medium ${canUseFunctional() ? 'text-green-600' : 'text-red-600'}`}>
            {canUseFunctional() ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => updatePreferences({ analytics: !preferences.analytics })}
          className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
        >
          Toggle Analytics
        </button>
        
        <button
          onClick={() => updatePreferences({ marketing: !preferences.marketing })}
          className="w-full px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors duration-200"
        >
          Toggle Marketing
        </button>
        
        <button
          onClick={() => updatePreferences({ functional: !preferences.functional })}
          className="w-full px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
        >
          Toggle Functional
        </button>
        
        <button
          onClick={clearConsent}
          className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
        >
          Clear All Cookies
        </button>
      </div>
    </motion.div>
  )
}

export default CookieUsageExample
