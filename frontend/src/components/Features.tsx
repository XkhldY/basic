'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Clock, 
  DollarSign, 
  Shield, 
  Zap, 
  Star, 
  CheckCircle, 
  TrendingUp,
  Lock,
  Award,
  Heart,
  Briefcase,
  MessageSquare
} from 'lucide-react'

const Features = () => {
  const benefits = [
    { icon: Users, title: 'Vetted Professionals', description: 'Pre-screened, experienced candidates ready to hit the ground running' },
    { icon: Clock, title: 'Fast Matching', description: 'Get connected with the right opportunities in days, not months' },
    { icon: DollarSign, title: 'Cost-Effective', description: 'Save up to 60% compared to traditional hiring agencies' },
    { icon: Shield, title: 'Quality Guarantee', description: '100% satisfaction or your money back' },
    { icon: Zap, title: 'Smart Matching', description: 'AI-powered job-candidate matching for optimal results' },
    { icon: Star, title: 'Ongoing Support', description: '24/7 support and career guidance included' }
  ]

  const skills = [
    { category: 'Frontend Development', emoji: '🎨', skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'] },
    { category: 'Backend Development', emoji: '⚙️', skills: ['Node.js', 'Python', 'Java', 'Go', 'Ruby on Rails'] },
    { category: 'Mobile Development', emoji: '📱', skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Cross-platform'] },
    { category: 'DevOps & Cloud', emoji: '☁️', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'] },
    { category: 'Data & AI', emoji: '🤖', skills: ['Machine Learning', 'Data Science', 'Python', 'TensorFlow', 'SQL'] },
    { category: 'Design & UX', emoji: '✨', skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'] }
  ]

  const guarantees = [
    '100% satisfaction guarantee',
    '30-day money-back policy',
    'Free replacement if not satisfied',
    'Ongoing support and guidance',
    'Performance monitoring and reporting',
    'Regular check-ins and updates'
  ]

  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-transparent rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent rounded-full opacity-30 blur-3xl animate-float-delayed"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-success-300/20 to-primary-300/20 rounded-xl rotate-12 animate-float-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-accent-300/20 to-purple-300/20 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-warning-300/20 to-success-300/20 rounded-lg rotate-45 animate-bounce-gentle"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Stats Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Jobs Posted', icon: Briefcase, color: 'text-success-600' },
              { number: '1000+', label: 'Active Users', icon: Heart, color: 'text-primary-600' },
              { number: '99%', label: 'Success Rate', icon: Star, color: 'text-warning-600' },
              { number: '24/7', label: 'Support Available', icon: Shield, color: 'text-accent-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-glass rounded-2xl p-6 shadow-xl border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 mb-4 shadow-lg`}>
                  <stat.icon size={32} className={stat.color} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Features */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-6">
              <Star size={16} />
              <span>Why Choose Our Platform</span>
            </div>
            <h2 className="heading-secondary mb-6">
              Smart Job Matching, 
              <span className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600"> Delivered Fast</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve revolutionized how companies hire and candidates find opportunities. 
              No more endless searching, no more expensive agencies, no more waiting months to find the perfect match.
            </p>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-glass rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <benefit.icon size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto mb-16">
            <h3 className="heading-secondary mb-6">
              <span className="text-gradient bg-gradient-to-r from-accent-600 to-purple-600">Comprehensive</span> Skill Coverage
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From frontend to backend, mobile to AI, we have opportunities in every technology stack 
              and industry you can imagine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                className="bg-glass rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{skillGroup.emoji}</div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">{skillGroup.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Assurance Section */}
        <motion.div 
          className="bg-gradient-to-br from-primary-50 via-white to-accent-50 rounded-3xl p-12 shadow-2xl border border-primary-100/50"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 border border-primary-200 rounded-full text-sm font-medium text-primary-700 mb-6">
                <Award size={16} />
                <span>Quality Assurance & Guarantees</span>
              </div>
              <h3 className="heading-secondary mb-6">
                Your Success is Our <span className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600">Priority</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We stand behind every connection made on our platform. Our comprehensive guarantees 
                ensure you get the results you expect, or we make it right.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guarantees.map((guarantee, index) => (
                  <motion.div
                    key={guarantee}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle size={20} className="text-success-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{guarantee}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-glass rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 mb-6">
                    <Shield size={40} className="text-primary-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Trust & Security</h4>
                  <p className="text-gray-600 mb-6">
                    Your data is protected with enterprise-grade security. We use industry-standard 
                    encryption and follow strict privacy guidelines.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Lock size={16} />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center space-x-2">
                      <Shield size={16} />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>

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
                <MessageSquare size={20} className="text-primary-600" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
