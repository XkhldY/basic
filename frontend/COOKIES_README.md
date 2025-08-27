# Cookies Management System

This project includes a comprehensive cookies management system that is GDPR compliant and provides granular control over different types of cookies.

## Features

- **GDPR Compliant**: Follows EU privacy regulations
- **Granular Control**: Users can choose which cookie types to accept
- **Persistent Storage**: Remembers user preferences
- **Easy Integration**: Simple hooks and utilities for components
- **Modern UI**: Beautiful, responsive cookies banner with animations

## Cookie Types

### 1. Necessary Cookies
- **Always enabled** - Cannot be disabled
- Required for basic website functionality
- Examples: Authentication, security, session management

### 2. Analytics Cookies
- **Optional** - User can choose to accept/reject
- Help understand website usage and performance
- Examples: Google Analytics, page view tracking

### 3. Marketing Cookies
- **Optional** - User can choose to accept/reject
- Used for advertising and marketing purposes
- Examples: Ad tracking, remarketing pixels

### 4. Functional Cookies
- **Optional** - User can choose to accept/reject
- Enhance user experience and functionality
- Examples: Language preferences, theme settings

## Components

### CookiesBanner
The main cookies consent banner that appears at the bottom of the page.

```tsx
import CookiesBanner from '@/components/CookiesBanner'

// Add to your main page
<CookiesBanner />
```

### CookieUsageExample
A demo component showing how to use cookies utilities (for development/testing).

## Hooks

### useCookies
A React hook that provides easy access to cookie management functions.

```tsx
import { useCookies } from '@/hooks/useCookies'

const MyComponent = () => {
  const { 
    preferences, 
    canUseAnalytics, 
    canUseMarketing, 
    canUseFunctional,
    updatePreferences,
    acceptAll,
    rejectAll,
    clearConsent 
  } = useCookies()

  // Check if analytics cookies are enabled
  if (canUseAnalytics()) {
    // Initialize analytics
  }

  // Update preferences
  const enableMarketing = () => {
    updatePreferences({ marketing: true })
  }

  return (
    // Your component JSX
  )
}
```

## Utilities

### Direct Cookie Functions
For direct cookie manipulation without React hooks:

```tsx
import { 
  getCookie, 
  setCookie, 
  deleteCookie,
  canUseAnalytics,
  canUseMarketing,
  canUseFunctional,
  saveCookieConsent,
  getCookieConsent
} from '@/utils/cookies'

// Set a cookie
setCookie('user_preference', 'dark_theme', 30)

// Get a cookie
const theme = getCookie('user_preference')

// Check if we can use analytics
if (canUseAnalytics()) {
  // Initialize Google Analytics
  gtag('config', 'GA_MEASUREMENT_ID')
}

// Check if we can use marketing cookies
if (canUseMarketing()) {
  // Load Facebook Pixel
  loadFacebookPixel()
}
```

## Usage Examples

### 1. Analytics Integration
```tsx
import { useCookies } from '@/hooks/useCookies'

const AnalyticsProvider = ({ children }) => {
  const { canUseAnalytics } = useCookies()

  useEffect(() => {
    if (canUseAnalytics()) {
      // Initialize analytics only if user consented
      gtag('config', 'GA_MEASUREMENT_ID')
    }
  }, [canUseAnalytics])

  return children
}
```

### 2. Marketing Tools
```tsx
const MarketingTools = () => {
  const { canUseMarketing } = useCookies()

  useEffect(() => {
    if (canUseMarketing()) {
      // Load marketing tools only with consent
      loadFacebookPixel()
      loadGoogleAds()
    }
  }, [canUseMarketing])

  return null
}
```

### 3. Functional Features
```tsx
const ThemeToggle = () => {
  const { canUseFunctional, updatePreferences } = useCookies()

  const toggleTheme = (theme: string) => {
    if (canUseFunctional()) {
      // Save theme preference
      setCookie('theme', theme, 365)
    }
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', theme)
  }

  return (
    <button onClick={() => toggleTheme('dark')}>
      Dark Theme
    </button>
  )
}
```

## GDPR Compliance

The system automatically handles:
- **Explicit Consent**: Users must actively choose cookie preferences
- **Granular Control**: Separate toggles for different cookie types
- **Persistent Storage**: Remembers user choices
- **Easy Withdrawal**: Users can change preferences anytime
- **Transparent Information**: Clear explanations of what each cookie type does

## Storage

- **LocalStorage**: Stores user consent preferences
- **Cookies**: Sets actual cookies based on user choices
- **Automatic Cleanup**: Removes cookies when consent is withdrawn

## Customization

### Styling
The cookies banner uses Tailwind CSS classes and can be easily customized by modifying the component.

### Cookie Types
Add new cookie types by:
1. Updating the `CookiePreferences` interface in `utils/cookies.ts`
2. Adding the new type to the banner UI
3. Implementing the logic in `saveCookieConsent`

### Text Content
Modify the banner text and descriptions in the `CookiesBanner` component.

## Testing

Use the `CookieUsageExample` component to test different cookie scenarios:
- Accept all cookies
- Reject all cookies
- Toggle individual cookie types
- Clear all cookies

## Browser Support

- Modern browsers with ES6+ support
- LocalStorage support required
- Cookie support required
- SSR/SSG compatible

## Security

- Cookies use `SameSite=Lax` for security
- No sensitive data stored in cookies
- LocalStorage only stores consent preferences
- Automatic cookie expiration (1 year default)
