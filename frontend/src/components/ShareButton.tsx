'use client'

import { Share2 } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  title: string
  excerpt: string
  url: string
}

export default function ShareButton({ title, excerpt, url }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: excerpt,
          url
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url)
        // You could add a toast notification here
        console.log('URL copied to clipboard')
      }
    } catch (err) {
      console.log('Share cancelled or failed')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-gray-800 text-[#ffc759] hover:text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent disabled:opacity-50"
      style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
      aria-label="Share this article"
    >
      <Share2 size={16} className={isSharing ? 'animate-spin' : ''} />
    </button>
  )
}
