'use client';

import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock, X, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookiesBanner from '@/components/CookiesBanner';
import type { JobDetail } from '@/data/jobs';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaticJobDetail({ job }: { job: JobDetail }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [hasApplied, setHasApplied] = useState(false); // Track if user has applied

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    
    const SERVICE_ID = "service_dibbpv4";
    const TEMPLATE_ID = "template_t0wd279";
    const PUBLIC_KEY = "dGtoCNbwjmMgdKtVW";

    setFormStatus('sending');
    
    import('@emailjs/browser').then((emailjs) => {
      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
        .then(() => {
          setFormStatus('sent');
          // Mark as applied and hide the button permanently for this session
          setHasApplied(true);
          // Reset form after successful submission
          setTimeout(() => {
            form.reset();
            setFormStatus('idle');
            setShowContactModal(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("EmailJS error", error);
          setFormStatus('error');
          
          // Prepare fallback email
          const formData = new FormData(form);
          const name = (formData.get("name") || "").toString();
          const email = (formData.get("email") || "").toString();
          const message = (formData.get("message") || "").toString();
          
          // Use the job title as the subject since we removed the subject field
          const subject = `Application for ${job.title}`;

          const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Message:",
            message,
          ];

          const mailto = `mailto:info@hirewithpom.com?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
          
          // Fallback to opening email client
          window.location.href = mailto;
          // Still mark as applied since the fallback email will be sent
          setHasApplied(true);
          setFormStatus('sent');
          setTimeout(() => {
            form.reset();
            setFormStatus('idle');
            setShowContactModal(false);
          }, 2000);
        });
    });
  };

  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation />

      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to jobs</span>
            </Link>
          </div>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300">
              <span className="inline-flex items-center">
                <Briefcase className="h-4 w-4 mr-1.5 text-blue-400" />
                {job.employmentType}
              </span>
              <span className="inline-flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-blue-400" />
                {job.location}
              </span>
              <span className="inline-flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-blue-400" />
                {job.date}
              </span>
            </div>
          </header>

          <div className="space-y-8 text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">The Role</h2>
              <p className="leading-relaxed">{job.role}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Key Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.keyResponsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {job.preferredQualifications.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">Preferred Qualifications</h2>
                <ul className="list-disc list-inside space-y-2">
                  {job.preferredQualifications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            {!hasApplied && (
              <button
                onClick={() => setShowContactModal(true)}
                className="btn-primary inline-flex items-center justify-center px-8 py-3 text-base font-medium"
              >
                Apply for this job
              </button>
            )}
            {hasApplied && (
              <div className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-green-500 bg-green-500/10 rounded-lg">
                Application Submitted ✓
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 relative"
            >
              {/* Glass Effect Overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-amber-100/20 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl sm:text-3xl text-gray-900 font-semibold">
                    {formStatus === 'sent' ? 'Application Sent!' : 'Send us your application'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    disabled={formStatus === 'sending'}
                    className="text-gray-900 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  {formStatus !== "sent" && (
                    <>
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
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-amber-200/30 rounded-2xl text-gray-900 placeholder-gray-500 font-light resize-none transition-all duration-300 focus:outline-none focus:border-amber-300/50 focus:bg-white hover:bg-white hover:border-amber-200/40"
                          placeholder="Tell us about your interest in this position..."
                          required
                        ></textarea>
                      </div>
                    </>
                  )}

                  {formStatus !== "sent" && (
                    <div className="text-center pt-6 space-y-3">
                      <button
                        type="submit"
                        className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px] mx-auto disabled:opacity-60 disabled:cursor-default"
                        disabled={formStatus === "sending"}
                      >
                        <span>{formStatus === "sending" ? "Sending..." : "Send"}</span>
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
                      </button>
                      {formStatus === "error" && (
                        <p className="text-sm text-red-600">
                          Something went wrong while sending. Please try again or email{" "}
                          <a href="mailto:info@hirewithpom.com" className="underline">
                            info@hirewithpom.com
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  )}

                  {formStatus === "sent" && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-700">Your application has been sent successfully. We'll be in touch shortly.</p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <CookiesBanner />
    </main>
  );
}