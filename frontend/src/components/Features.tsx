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
  Award,
  Heart,
  Briefcase,
  User
} from 'lucide-react'

const Features = () => {
  const benefits = [
    { icon: Users, title: 'Handpicked Talent', description: 'Expert professionals carefully selected and personally verified for your specific needs' },
    { icon: Clock, title: 'Fast Matching', description: 'Get connected with the right opportunities in days, not months' },
    { icon: DollarSign, title: 'Cost-Effective', description: 'Save up to 60% compared to traditional hiring agencies' }
  ]

  const skills = [
    { category: 'Frontend Development', emoji: '🎨', skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Webpack', 'Redux', 'GraphQL'] },
    { category: 'Backend Development', emoji: '⚙️', skills: ['Node.js', 'Python', 'Java', 'Go', 'Ruby on Rails', 'PHP', 'C#', 'Spring Boot', 'Django', 'Express.js'] },
    { category: 'Mobile Development', emoji: '📱', skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Cross-platform', 'Swift', 'Kotlin', 'Ionic', 'NativeScript'] },
    { category: 'DevOps & Cloud', emoji: '☁️', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins', 'GitLab', 'Monitoring'] },
    { category: 'Data & AI', emoji: '🤖', skills: ['Machine Learning', 'Data Science', 'Python', 'TensorFlow', 'SQL', 'PyTorch', 'Big Data', 'Computer Vision'] },
    { category: 'Design & UX', emoji: '✨', skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'] }
  ]

  const guarantees = [
    { icon: CheckCircle, title: '100% Satisfaction Guarantee', description: "We guarantee you'll be satisfied with our service or your money back." },
    { icon: Briefcase, title: '30-Day Money-Back Policy', description: "If you're not satisfied with your results within 30 days, we'll refund your money." },
    { icon: Heart, title: 'Free Replacement if Not Satisfied', description: "If you're not satisfied with your hire, we'll find you a replacement at no additional cost." },
    { icon: Award, title: 'Ongoing Support and Guidance', description: "We provide ongoing career guidance and support to ensure your success." },
    { icon: Zap, title: 'Performance Monitoring and Reporting', description: "We monitor and report on the performance of your hires to ensure they meet your expectations." },
    { icon: Star, title: 'Regular Check-ins and Updates', description: "We conduct regular check-ins and provide updates on the progress of your hiring process." }
  ]

  const jobs = [
    {
      title: 'Senior Frontend Developer',
      type: 'Full-time',
      date: '2023-10-27',
      location: 'Remote',
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL']
    },
    {
      title: 'Backend Engineer',
      type: 'Full-time',
      date: '2023-10-26',
      location: 'Remote',
      tags: ['Node.js', 'Express.js', 'MongoDB', 'AWS']
    },
    {
      title: 'Mobile Developer (React Native)',
      type: 'Full-time',
      date: '2023-10-25',
      location: 'Remote',
      tags: ['React Native', 'Redux', 'TypeScript', 'Firebase']
    }
  ]

  return (
    <section id="features" className="pt-12 pb-8 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden">
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
        {[...Array(30)].map((_, i) => (
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
        {/* Main Features */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-gray-900 mb-10 mt-8">
            <Shield size={16} />
            <span>Why choose us</span>
          </div>
          <motion.h2
            className="text-4xl lg:text-6xl text-gray-900 leading-tight mb-6 normal-case font-semibold"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Everything you need to <span>succeed</span>
          </motion.h2>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto">
            Our platform provides comprehensive solutions for both employers and job seekers, 
            ensuring successful matches and long-term success.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-white/80 rounded-2xl p-8 shadow-xl border border-amber-200/30 hover:shadow-2xl transition-all duration-200 group hover:-translate-y-1 text-center hover:bg-white hover:border-amber-300/50"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 mb-6 group-hover:scale-105 transition-all duration-200 mx-auto group-hover:from-amber-100 group-hover:to-amber-200">
                <div className="animate-[float_3s_ease-in-out_infinite]">
                  <benefit.icon size={32} className="text-amber-700 transition-all duration-200 group-hover:text-amber-800" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 transition-all duration-200 group-hover:text-gray-800">{benefit.title}</h3>
              <p className="text-gray-700 leading-relaxed transition-all duration-200 group-hover:text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Testimonials Section */}
        <div className="mt-32">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold">
              Trusted by leading companies
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Join companies that trust our platform to find their next great hire
            </p>
          </motion.div>
          
          {/* Moving Company Logos Bar */}
          <motion.div
            className="relative overflow-hidden py-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Left Smooth Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-amber-100 via-amber-100/50 to-transparent z-10 pointer-events-none" />
            
            {/* Right Smooth Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-amber-100 via-amber-100/50 to-transparent z-10 pointer-events-none" />
            
            <div className="flex space-x-12 animate-scroll">
              {/* Company Logos - First Set */}
              <div className="flex items-center space-x-12 flex-shrink-0">
                <div className="flex items-center justify-center w-48 h-28 p-4">
                  <img src="/img/momentscience_logo.avif" alt="Moment Science" className="max-w-full max-h-full object-contain brightness-0" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/clever_logo.avif" alt="Clever" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-44 h-20 p-1">
                  <span className="text-2xl font-bold text-gray-800">
                    Bajaar LLC
                  </span>
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/adspostx_logo.svg" alt="AdsPostX" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/blastBucks_logo.webp" alt="BlastBucks" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/enefits_logo.svg" alt="Enefits" className="max-w-full max-h-full object-contain brightness-0" />
                </div>
              </div>
              
              {/* Company Logos - Second Set (for seamless loop) */}
              <div className="flex items-center space-x-12 flex-shrink-0">
                <div className="flex items-center justify-center w-48 h-28 p-4">
                  <img src="/img/momentscience_logo.avif" alt="Moment Science" className="max-w-full max-h-full object-contain brightness-0" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/clever_logo.avif" alt="Clever" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-44 h-20 p-1">
                  <span className="text-2xl font-bold text-gray-800">
                    Bajaar LLC
                  </span>
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/adspostx_logo.svg" alt="AdsPostX" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/blastBucks_logo.webp" alt="BlastBucks" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex items-center justify-center w-40 h-24 p-4">
                  <img src="/img/enefits_logo.svg" alt="Enefits" className="max-w-full max-h-full object-contain brightness-0" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-gray-900 px-4 py-2 mb-10 inline-block">
              <div className="flex items-center space-x-2">
                <Zap size={16} />
                <span>Expert skills</span>
              </div>
            </span>
            <h3 className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold">
              Wide range of <span>expertise</span>
            </h3>
            <p className="text-lg text-gray-800 max-w-3xl mx-auto mb-6">
              Our platform connects you with professionals across diverse industries and skill sets
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                className="flex items-center space-x-3 px-4 py-2 bg-white/90 rounded-full border border-amber-200/50 shadow-sm hover:bg-white hover:border-amber-300/70 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <span className="text-lg">
                  {skill.emoji}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {skill.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Jobs Section */}
        <div className="mt-20 pt-16 pb-16 bg-gradient-to-b from-amber-50 via-white to-amber-50 relative rounded-3xl">
          <div className="container-custom relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <span className="bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-gray-900 px-4 py-2 mb-6 inline-block">
                <div className="flex items-center space-x-2">
                  <Briefcase size={16} />
                  <span>Open positions</span>
                </div>
              </span>
              <h3 className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold">
                Join our <span>team</span>
              </h3>
              <p className="text-lg text-gray-800 max-w-3xl mx-auto mb-10">
                Discover exciting opportunities and be part of our mission to connect top talent with amazing companies
              </p>
            </motion.div>

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  className="bg-white/90 rounded-3xl p-6 shadow-lg border border-amber-200/30 hover:shadow-xl transition-all duration-200 group hover:-translate-y-1 hover:bg-white hover:border-amber-300/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8 + index * 0.1
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -3
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      {job.type}
                    </span>
                    <span className="text-xs text-gray-500">{job.date}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{job.location}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-xl"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See More Jobs Button */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <button className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 group w-full sm:w-auto min-w-[200px] h-[56px] mx-auto">
                <span>See more jobs</span>
                <svg className="ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              className="bg-white/80 rounded-3xl p-8 shadow-lg border border-amber-200/30 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              <div className="flex items-center gap-8">
                <div className="flex-1 text-left">
                  <blockquote className="text-xl text-gray-800 italic mb-4">
                    "Hiring through POM was seamless, smooth process, easy communication, and great support!"
                  </blockquote>
                  <div>
                    <p className="font-semibold text-gray-900">Hassan</p>
                    <p className="text-sm text-gray-600">Product Designer</p>
                  </div>
                </div>
                <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src="/img/hassan_productDesigner.avif" 
                    alt="Hassan - Product Designer" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
