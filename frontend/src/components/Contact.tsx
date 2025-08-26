'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@jobplatform.com',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-800'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      action: 'Start Chat',
      href: '/auth',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-800'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: 'Call Now',
      href: 'tel:+1-555-0123',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-800'
    }
  ]

  return (
    <section id="contact" className="pt-12 pb-16 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 relative overflow-hidden">
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
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-slate-900 mb-10 mt-8">
              <MessageSquare size={16} />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl lg:text-5xl text-slate-900 dark:text-white leading-tight mb-10 normal-case font-semibold">
              Ready to find your <span>perfect match?</span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Whether you're hiring top talent or looking for your next opportunity, 
              let's start the conversation that could change everything.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Contact Information */}
              <div className="text-center mb-16 -mt-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#ffc759]" />
                    <a 
                      href="mailto:info@hirewithpom.com" 
                      className="font-medium hover:text-[#ffc759] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      title="Open default email client"
                    >
                      info@hirewithpom.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-[#ffc759]" />
                    <a 
                      href="tel:+12109525741" 
                      className="font-medium hover:text-[#ffc759] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent"
                      style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                    >
                      +1 (210) 952-5741
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Elegant Glass Container */}
              <div className="relative bg-transparent backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                {/* Subtle Glass Effect */}
                <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
                
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/3 rounded-3xl"></div>
                
                <div className="text-center mb-12 relative z-10">
                  <h3 className="text-3xl lg:text-4xl text-white mb-6 normal-case font-light">
                    Send us a message
                  </h3>
                </div>

                <form className="space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-3">
                        Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-3">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-3">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 font-light resize-none transition-all duration-300 focus:outline-none focus:border-white/40 focus:bg-white/15 hover:bg-white/15"
                      placeholder="Tell us about your hiring needs or career goals..."
                      required
                    ></textarea>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      className="relative overflow-hidden group bg-gradient-to-r from-[#ffc759] via-[#ffb84d] to-[#ffa03a] text-slate-900 font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl hover:shadow-[#ffc759]/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1"
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
