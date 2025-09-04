'use client'

import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const Contact = () => {
  const [showEmailFallback, setShowEmailFallback] = useState(false)

  return (
    <section id="contact" className="pt-0 sm:pt-12 pb-12 sm:pb-16 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 relative overflow-hidden">
      {/* Background with Modern 2025 Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 animate-gradient-shift" />
      
      {/* Modern Texture Layers */}
      <div className="absolute inset-0 opacity-40">
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
      </div>
      
      {/* Animated Mesh Flow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent animate-mesh-flow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-400/15 to-transparent animate-mesh-flow-reverse" />

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
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-slate-900 mb-10 mt-12 sm:mt-8">
              <MessageSquare size={16} />
                              <span>Get in touch</span>
            </div>
                         <h2 className="text-3xl lg:text-5xl text-white leading-tight mb-6 sm:mb-10 normal-case font-semibold">
              Ready to find your <span>perfect match?</span>
            </h2>
            <p className="text-base text-gray-200 max-w-3xl mx-auto">
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
                <div className="flex items-center justify-center text-white/90">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#ffc759]" />
                    <div className="relative">
                      <a 
                        href="mailto:info@hirewithpom.com" 
                        className="font-medium hover:text-[#ffc759] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
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
              <div className="relative bg-transparent backdrop-blur-xl rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/20 -mt-2 sm:-mt-8">
                {/* Subtle Glass Effect */}
                <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
                
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/3 rounded-3xl"></div>
                
                <div className="text-center mb-8 sm:mb-12 relative z-10">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-4 sm:mb-6 normal-case font-light">
                    Send us a message
              </h3>
                </div>

                <form className="space-y-6 sm:space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2 sm:mb-3">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2 sm:mb-3">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2 sm:mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2 sm:mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light resize-none transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                      placeholder="Tell us about your hiring needs or career goals..."
                      required
                    ></textarea>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      className="relative overflow-hidden group bg-gradient-to-r from-[#ffc759] via-[#ffb84d] to-[#ffa03a] text-slate-900 font-bold text-base sm:text-lg px-4 sm:px-16 py-3 sm:py-4 rounded-2xl shadow-2xl hover:shadow-[#ffc759]/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 w-[180px] sm:w-auto min-w-[200px] mx-auto sm:mx-0"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-3">
                        <span>Send</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ffb84d] via-[#ffa03a] to-[#ffc759] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
