'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Send Email',
      href: 'mailto:support@jobplatform.com',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      action: 'Start Chat',
      href: '/auth',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: 'Call Now',
      href: 'tel:+1-555-0123',
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    }
  ]

  const benefits = [
    '24/7 customer support',
    'Expert career guidance',
    'Technical assistance',
    'Account management help',
    'Billing support',
    'Feature requests'
  ]

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-accent-200/30 to-transparent rounded-full opacity-25 blur-3xl animate-float-delayed"></div>
      </div>

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
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-6">
              <MessageSquare size={16} />
              <span>Get in Touch</span>
            </div>
            <h2 className="heading-secondary mb-6">
              Ready to Get <span className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600">Started?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our platform? Need help with your account? 
              Our support team is here to help you succeed.
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${method.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon size={32} className={method.color} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{method.description}</p>
                <Link href={method.href}>
                  <button className="btn-primary w-full group">
                    <span>{method.action}</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl lg:text-5xl font-bold mb-6">
                Start Your Journey Today
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals and companies who have already found success on our platform. 
                Create your account and discover new opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <motion.button 
                    className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
                    </span>
                  </motion.button>
                </Link>
                <Link href="/jobs">
                  <motion.button 
                    className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center space-x-2">
                      <span>Browse Jobs</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Support Benefits */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold text-gray-900 mb-8">What You Can Expect</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center space-x-3 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle size={20} className="text-success-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
