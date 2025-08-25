'use client'

import { motion } from 'framer-motion'
import { Heart, Mail, Phone, MessageSquare, ArrowUp, Linkedin } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    platform: [
      { name: 'For employers', href: '/employer' },
      { name: 'For candidates', href: '/candidate' }
    ],
    support: [
      { name: 'Help Center', href: '/#contact' },
      { name: 'Contact Support', href: '/#contact' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' }
    ]
  }

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/hirewithpom/posts/?feedView=all', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
  ]

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-900/20 to-transparent rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-accent-900/20 to-transparent rounded-full opacity-25 blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 gap-8 py-12">
            {/* Company Info */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Link href="https://www.linkedin.com/company/hirewithpom/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/img/white@2x.png"
                    alt="POM Logo"
                    className="w-16 h-16 object-contain -mt-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                </Link>
              </div>
              <p className="text-gray-300 dark:text-gray-400 mb-2 max-w-md leading-relaxed text-sm -mt-3">
                Connecting talented professionals with amazing opportunities. 
                Our platform makes job hunting and hiring simple, efficient, and successful.
              </p>
            </motion.div>

            {/* Platform Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-base font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 mb-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Social */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-base font-semibold mb-4 text-white">Contact & Social</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300 dark:text-gray-400">
                  <Mail size={14} className="text-[#ffc759]" />
                  <span className="text-sm">info@hirewithpom.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 dark:text-gray-400">
                  <Phone size={14} className="text-[#ffc759]" />
                  <span className="text-sm">+1 (210) 952-5741</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 dark:text-gray-400">
                  <svg className="w-4 h-4 text-[#ffc759]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span className="text-sm">LinkedIn</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 dark:border-gray-700 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <motion.div 
                className="text-gray-400 dark:text-gray-500 text-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <p>
                  © 2025 POM. Made with{' '}
                  <Heart size={12} className="inline text-red-500" />{' '}
                  for job seekers and employers.
                </p>
              </motion.div>

              {/* Legal Links */}
              <motion.div 
                className="flex items-center space-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors duration-200 text-xs"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="#"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors duration-200 text-xs"
                >
                  Terms of Service
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-200" />
      </motion.button>
    </footer>
  )
}

export default Footer
