'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const Contact = () => {
  const [showEmailFallback, setShowEmailFallback] = useState(false)

  return (
    <section id="contact" className="pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden">
      {/* Background with Subtle Animations */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50" />
      
      {/* Visible but Elegant Geometric Patterns */}
      <div className="absolute inset-0 opacity-40">
        {/* Clear Grid Pattern - Matching spacing but keeping amber theme */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Visible Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-300/25 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2.5}s`
            }}
          />
            ))}
          </div>
      
      {/* Visible Mesh Flow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent animate-mesh-flow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-200/20 to-transparent animate-mesh-flow-reverse" />

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-10 mt-12 sm:mt-8">
              <MessageSquare size={16} />
              <span>Get in touch</span>
            </div>
            <h2 className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 sm:mb-10 normal-case font-semibold">
              Ready to find your <span>perfect match?</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto">
              Whether you're hiring top talent or looking for your next opportunity, 
              let's start the conversation that could change everything.
            </p>
          </motion.div>

          {/* Contact Information */}
              <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Contact Information */}
              <div className="hidden sm:block text-center mb-20 sm:mb-20 -mt-8 relative z-10">
                <div className="flex items-center justify-center text-gray-700">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div className="relative">
                      <a 
                        href="mailto:info@hirewithpom.com" 
                        className="font-medium hover:text-amber-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                        title="Open default email client"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Email link clicked - opening Gmail...');
                          
                          // Open Gmail with pre-filled email
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@hirewithpom.com&su=Contact%20Request&body=Hello,%0D%0A%0D%0AI%20would%20like%20to%20get%20in%20touch%20with%20you.%0D%0A%0D%0ABest%20regards`;
                          
                          // Open in new tab
                          window.open(gmailUrl, '_blank');
                          
                          // Show success message briefly
                          setShowEmailFallback(true);
                          setTimeout(() => setShowEmailFallback(false), 3000);
                        }}
                      >
                        info@hirewithpom.com
                      </a>
                      
                                             {/* Success message */}
                       {showEmailFallback && (
                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                           <div className="flex items-center space-x-2">
                             <span>✅</span>
                             <span>Gmail opened! Email pre-filled with info@hirewithpom.com</span>
                           </div>
                           <div className="text-center mt-1">
                             <button
                               onClick={() => {
                                 navigator.clipboard.writeText('info@hirewithpom.com');
                                 setShowEmailFallback(false);
                               }}
                               className="text-green-200 hover:text-white text-xs underline"
                             >
                               Copy email to clipboard
                             </button>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
            </div>

              {/* Elegant Glass Container */}
              <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/20 -mt-2 sm:-mt-8">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl"></div>
                
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-amber-100/20 rounded-3xl"></div>
                
                {/* Glass Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-3xl"></div>
                
                <div className="text-center mb-8 sm:mb-12 relative z-10">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-4 sm:mb-6 normal-case font-semibold">
                    Send us a message
                  </h3>
                </div>

                <form className="space-y-6 sm:space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-amber-200/30 rounded-2xl text-gray-900 placeholder-gray-500 font-light transition-all duration-300 focus:outline-none focus:border-amber-300/50 focus:bg-white hover:bg-white hover:border-amber-200/40"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-amber-200/30 rounded-2xl text-gray-900 placeholder-gray-500 font-light transition-all duration-300 focus:outline-none focus:border-amber-300/50 focus:bg-white hover:bg-white hover:border-amber-200/40"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-amber-200/30 rounded-2xl text-gray-900 placeholder-gray-500 font-light transition-all duration-300 focus:outline-none focus:border-amber-300/50 focus:bg-white hover:bg-white hover:border-amber-200/40"
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-amber-200/30 rounded-2xl text-gray-900 placeholder-gray-500 font-light resize-none transition-all duration-300 focus:outline-none focus:border-amber-300/50 focus:bg-white hover:bg-white hover:border-amber-200/40"
                      placeholder="Tell us about your hiring needs or career goals..."
                      required
                    ></textarea>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px] mx-auto"
                    >
                      <span>Send</span>
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
