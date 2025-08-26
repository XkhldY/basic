'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Database } from 'lucide-react'
import Link from 'next/link'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    {/* Header */}
       <header className="bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50">
         <div className="container-custom">
           <div className="grid grid-cols-3 items-center h-20">
             {/* Logo */}
             <div className="flex items-center justify-start h-20">
               <Link href="/" className="flex items-center space-x-3 group">
                 <img
                   src="/img/white@2x.png"
                   alt="POM Logo"
                   className="w-24 h-24 object-contain transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                 />
               </Link>
             </div>

             {/* Center - Empty for balance */}
             <div className="flex items-center justify-center h-20">
             </div>

             {/* Back to Home */}
             <div className="flex items-center justify-end h-20">
               <Link 
                 href="/"
                 className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
               >
                 <ArrowLeft size={18} />
                 <span>Go back home</span>
               </Link>
             </div>
           </div>
         </div>
       </header>

      {/* Main Content */}
      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-slate-900 mb-6">
              <Shield size={16} />
              <span>Privacy policy</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Your privacy matters
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We're committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Information We Collect */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Information we collect</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create an account or profile</li>
                  <li>Submit job applications or post job listings</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletters</li>
                  <li>Participate in surveys or feedback</li>
                </ul>
                <p>This may include your name, email address, phone number, professional information, resume, and other relevant details.</p>
              </div>
            </motion.section>

            {/* How We Use Your Information */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How we use your information</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our platform services</li>
                  <li>Match job seekers with relevant opportunities</li>
                  <li>Connect employers with qualified candidates</li>
                  <li>Send important updates and notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </motion.section>

            {/* Information Sharing */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Users className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Information sharing</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>With your consent:</strong> When you explicitly authorize us to share your information</li>
                  <li><strong>For job matching:</strong> To connect job seekers with employers and vice versa</li>
                  <li><strong>Service providers:</strong> With trusted third-party services that help us operate our platform</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety</li>
                </ul>
              </div>
            </motion.section>

            {/* Data Security */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Data security</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>
            </motion.section>

            {/* Your Rights */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Your rights</h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                  <li><strong>Delete:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Object:</strong> Object to certain processing of your data</li>
                  <li><strong>Withdraw consent:</strong> Withdraw consent for data processing</li>
                </ul>
                <p>To exercise these rights, please contact us at <a href="mailto:info@hirewithpom.com" className="text-[#ffc759] hover:underline">info@hirewithpom.com</a></p>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.section 
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Questions about this policy?</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  If you have any questions about this privacy policy or our data practices, please don't hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <a 
                    href="mailto:info@hirewithpom.com"
                    className="flex items-center space-x-2 px-6 py-3 bg-[#ffc759] hover:bg-[#ffb84d] text-slate-900 font-medium rounded-xl transition-colors duration-200"
                  >
                    <span>Email Us</span>
                  </a>
                  <a 
                    href="tel:+12109525741"
                    className="flex items-center space-x-2 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-colors duration-200"
                  >
                    <span>Call Us</span>
                  </a>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Footer Note */}
          <motion.div 
            className="text-center mt-16 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Last updated:</strong> January 2025. This privacy policy may be updated from time to time. 
              We will notify you of any material changes by posting the new privacy policy on this page.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default PrivacyPolicy
