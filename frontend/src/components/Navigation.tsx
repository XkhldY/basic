'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Check which section the navbar is currently over
      const sections = [
        { id: 'hero', element: document.querySelector('section:first-of-type') },
        { id: 'features', element: document.getElementById('features') },
        { id: 'contact', element: document.getElementById('contact') }
      ]
      
      let activeSection = 'hero'
      
      sections.forEach(({ id, element }) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom >= 80) {
            activeSection = id
          }
        }
      })
      
      setCurrentSection(activeSection)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
      isMounted && currentSection === 'features' 
        ? 'bg-amber-100 border-b border-amber-200/50' 
        : isMounted && currentSection === 'contact'
          ? 'bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50'
          : isMounted && isScrolled 
            ? 'bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50' 
            : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="container-custom">
        <div className="grid grid-cols-3 items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-start h-20"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
              >
                <img
                  src={isMounted && currentSection === 'features' ? "/img/black@2x.png" : "/img/white@2x.png"} // Dynamic logo
                  alt="POM Logo"
                  className="w-24 h-24 object-contain transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <motion.div 
            className="hidden md:flex items-center justify-center h-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center space-x-8">
              <Link href="/#features" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('features');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                isMounted && currentSection === 'features'
                  ? 'text-gray-800 hover:text-gray-900' 
                  : isMounted && currentSection === 'contact'
                    ? 'text-gray-300 hover:text-white'
                    : isMounted && isScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-white hover:text-gray-200'
              }`} style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                Features
              </Link>
              <Link href="/#jobs" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('jobs');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                isMounted && currentSection === 'features'
                  ? 'text-gray-800 hover:text-gray-900' 
                  : isMounted && currentSection === 'contact'
                    ? 'text-gray-300 hover:text-white'
                    : isMounted && isScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-white hover:text-gray-200'
              }`} style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                Jobs
              </Link>
              <Link href="/#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                isMounted && currentSection === 'features'
                  ? 'text-gray-800 hover:text-gray-900' 
                  : isMounted && currentSection === 'contact'
                    ? 'text-gray-300 hover:text-white'
                    : isMounted && isScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-white hover:text-gray-200'
              }`} style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                Contact
              </Link>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="hidden md:flex items-center justify-end space-x-4 h-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/auth">
              <button className={`font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                isMounted && currentSection === 'features'
                  ? 'text-gray-800 hover:text-gray-900' 
                  : isMounted && currentSection === 'contact'
                    ? 'text-gray-300 hover:text-white'
                    : isMounted && isScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-white hover:text-gray-200'
              }`}>
                Sign in
              </button>
            </Link>
            <Link href="/auth">
              <button className="btn-primary">
                Get started
              </button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            onClick={toggleMenu}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-6 border-t border-slate-800 bg-slate-950"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/#features" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('features');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                Features
              </Link>
              <Link 
                href="/#jobs" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('jobs');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                Jobs
              </Link>
              <Link 
                href="/#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    const offset = 80; // Exact navbar height for perfect fit
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/auth">
                  <button className="w-full text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors duration-200 mb-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="btn-primary w-full">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}

export default Navigation
