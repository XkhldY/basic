'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const features = [
    { icon: Shield, text: 'Vetted professionals', color: 'text-white' },
    { icon: Sparkles, text: 'Fast matching', color: 'text-white' },
    { icon: TrendingUp, text: 'Cost-effective', color: 'text-white' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 overflow-hidden">
      <div className="container-custom relative z-10 pt-32">
        <div className="max-w-6xl mx-auto text-center"> 
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center space-y-12">
            {/* Left Column - Text Content */}
            <motion.div 
              className="space-y-12"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1
                  className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight normal-case"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  Find your dream job or
                  <br />
                  <span>top talent</span>
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <strong>We get it.</strong> Finding the right job or hiring the perfect candidate is challenging.{' '}
                  Our platform connects <strong>employers</strong> with <strong>talented professionals</strong> seamlessly.
                </motion.p>
            </div>

              {/* Features List */}
              <motion.div 
                className="flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                    <feature.icon size={20} className={feature.color} />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

                             {/* CTA Buttons */}
               <motion.div 
                 className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center pb-12 sm:pb-0"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.9 }}
               >
                                 {/* Commented out for now - will be replaced with waitlist
                                 <Link href="/auth">
                   <motion.button 
                     className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px]"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                   >
                    <span>Get started</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
                  </motion.button>
                </Link>
                                 */}
                                 <motion.button 
                   onClick={() => window.location.href = '/waitlist'}
                   className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px]"
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                 >
                  <span>Join waitlist</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
                </motion.button>
                                {/* Commented out Browse jobs button
                                <Link href="/jobs">
                  <motion.button 
                    className="btn-secondary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px] border-0 text-gray-900"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                   <span>Browse jobs</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
                  </motion.button>
                </Link>
                                */}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
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
    </section>
  )
}

export default Hero
