'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Users, Star, Phone, Sparkles, TrendingUp, Shield, Briefcase, User } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Jobs posted', color: 'text-success-600' },
    { icon: Star, value: '99%', label: 'Success rate', color: 'text-warning-600' },
    { icon: TrendingUp, value: '24/7', label: 'Support available', color: 'text-primary-600' }
  ]

  const features = [
    { icon: Shield, text: 'Vetted professionals', color: 'text-primary-600' },
    { icon: Sparkles, text: 'Fast matching', color: 'text-accent-600' },
    { icon: TrendingUp, text: 'Cost-effective', color: 'text-success-600' }
  ]

  return (
    <section className="pt-32 pb-24 bg-gradient-modern relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-200/40 to-transparent rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-accent-200/40 to-transparent rounded-full opacity-25 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 via-purple-100/20 to-pink-100/20 rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary-300/20 to-accent-300/20 rounded-2xl rotate-12 animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-accent-300/20 to-purple-300/20 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-success-300/20 to-primary-300/20 rounded-lg rotate-45 animate-bounce-gentle"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 border border-primary-200 rounded-full text-sm font-medium text-primary-700 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Sparkles size={16} className="text-accent-600" />
                <span>Modern Job Platform</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  Find Your Dream Job or
                  <br />
                  <span className="text-gradient bg-gradient-to-r from-primary-600 via-accent-500 to-purple-600">
                    Top Talent
                  </span>
                </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <strong>We get it.</strong> Finding the right job or hiring the perfect candidate is challenging.{' '}
                Our platform connects <strong className="text-primary-600">employers</strong> with <strong className="text-accent-600">talented professionals</strong> seamlessly.
              </motion.p>
            </div>

              {/* Features List */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 text-gray-700 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                    <feature.icon size={20} className={feature.color} />
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <Link href="/auth">
                  <motion.button 
                    className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone size={20} />
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
                  </motion.button>
                </Link>
                <Link href="/jobs">
                  <motion.button 
                    className="btn-secondary text-lg px-8 py-4 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Browse Jobs</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {/* Main Card */}
              <div className="bg-glass rounded-3xl p-8 shadow-2xl relative">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                    >
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Platform Features */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl">
                    <Briefcase size={20} className="text-primary-600" />
                    <span className="text-gray-700 font-medium">For Employers</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-accent-50 to-orange-50 rounded-xl">
                    <User size={20} className="text-accent-600" />
                    <span className="text-gray-700 font-medium">For Candidates</span>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp size={24} className="text-accent-600" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Shield size={20} className="text-primary-600" />
                </motion.div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -z-10 inset-0">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-200 to-accent-200 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats Section */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <div className="inline-flex items-center space-x-8 text-gray-600 bg-glass px-8 py-4 rounded-2xl shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Trusted by leading companies</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="font-medium">24/7 support available</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Secure & reliable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
