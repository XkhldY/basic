"use client";

import { motion } from "framer-motion";
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
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const Features = () => {
  const benefits = [
    {
      icon: Users,
      title: "Handpicked talent",
      description:
        "Expert professionals carefully selected and personally verified for your specific needs",
    },
    {
      icon: Clock,
      title: "Fast matching",
      description:
        "Get connected with the right opportunities in days, not months",
    },
    {
      icon: DollarSign,
      title: "Cost-effective",
      description: "Save up to 60% compared to traditional hiring agencies",
    },
  ];

  const skills = [
    {
      category: "Frontend Development",
      emoji: "🎨",
      skills: [
        "React",
        "Vue.js",
        "Angular",
        "TypeScript",
        "Tailwind CSS",
        "Next.js",
        "Webpack",
        "Redux",
        "GraphQL",
      ],
    },
    {
      category: "Backend Development",
      emoji: "⚙️",
      skills: [
        "Node.js",
        "Python",
        "Java",
        "Go",
        "Ruby on Rails",
        "PHP",
        "C#",
        "Spring Boot",
        "Django",
        "Express.js",
      ],
    },
    {
      category: "Mobile Development",
      emoji: "📱",
      skills: [
        "React Native",
        "Flutter",
        "iOS",
        "Android",
        "Cross-platform",
        "Swift",
        "Kotlin",
        "Ionic",
        "NativeScript",
      ],
    },
    {
      category: "DevOps & Cloud",
      emoji: "☁️",
      skills: [
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Terraform",
        "Jenkins",
        "GitLab",
        "Monitoring",
      ],
    },
    {
      category: "Data & AI",
      emoji: "🤖",
      skills: [
        "Machine Learning",
        "Data Science",
        "Python",
        "TensorFlow",
        "SQL",
        "PyTorch",
        "Big Data",
        "Computer Vision",
      ],
    },
    {
      category: "Design & UX",
      emoji: "✨",
      skills: [
        "UI/UX Design",
        "Figma",
        "Adobe Creative Suite",
        "Prototyping",
        "User Research",
      ],
    },
  ];

  const guarantees = [
    {
      icon: CheckCircle,
      title: "100% Satisfaction Guarantee",
      description:
        "We guarantee you'll be satisfied with our service or your money back.",
    },
    {
      icon: Briefcase,
      title: "30-Day Money-Back Policy",
      description:
        "If you're not satisfied with your results within 30 days, we'll refund your money.",
    },
    {
      icon: Heart,
      title: "Free Replacement if Not Satisfied",
      description:
        "If you're not satisfied with your hire, we'll find you a replacement at no additional cost.",
    },
    {
      icon: Award,
      title: "Ongoing Support and Guidance",
      description:
        "We provide ongoing career guidance and support to ensure your success.",
    },
    {
      icon: Zap,
      title: "Performance Monitoring and Reporting",
      description:
        "We monitor and report on the performance of your hires to ensure they meet your expectations.",
    },
    {
      icon: Star,
      title: "Regular Check-ins and Updates",
      description:
        "We conduct regular check-ins and provide updates on the progress of your hiring process.",
    },
  ];

  const jobs = [
    {
      title: "Senior Frontend Developer",
      type: "Full-time",
      date: "2023-10-27",
      location: "Remote",
      tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    },
    {
      title: "Backend Engineer",
      type: "Full-time",
      date: "2023-10-26",
      location: "Remote",
      tags: ["Node.js", "Express.js", "MongoDB", "AWS"],
    },
    {
      title: "Mobile Developer (React Native)",
      type: "Full-time",
      date: "2023-10-25",
      location: "Remote",
      tags: ["React Native", "Redux", "TypeScript", "Firebase"],
    },
  ];

  return (
    <section
      id="features"
      className="pt-0 sm:pt-12 pb-0 sm:pb-8 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 relative overflow-hidden"
    >
      {/* Background with Subtle Animations */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50" />

      {/* Visible but Elegant Geometric Patterns */}
      <div className="absolute inset-0 opacity-40">
        {/* Clear Grid Pattern - Matching spacing but keeping amber theme */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        />
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
              animationDelay: `${Math.random() * 2.5}s`,
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
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 mb-6 mt-12 sm:mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Shield size={16} />
            <span>Why choose us</span>
          </motion.div>
          <motion.h2
            className="text-4xl lg:text-6xl font-semibold leading-tight mb-6 normal-case text-primary-dark"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Everything you need to succeed
          </motion.h2>
          <motion.p
            className="text-base sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-primary-dark"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Our platform provides comprehensive solutions for both employers and
            job seekers, ensuring successful matches and long-term success.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="bg-white/80 rounded-2xl p-8 shadow-xl border border-amber-200/30 hover:shadow-2xl transition-all duration-200 group hover:-translate-y-1 text-center hover:bg-white hover:border-amber-300/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 mb-6 group-hover:scale-105 transition-all duration-200 mx-auto group-hover:from-amber-100 group-hover:to-amber-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.0 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                <div className="animate-[float_3s_ease-in-out_infinite]">
                  <benefit.icon
                    size={32}
                    className="text-amber-700 transition-all duration-200 group-hover:text-amber-800"
                  />
                </div>
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-gray-900 mb-4 transition-all duration-200 group-hover:text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                {benefit.title}
              </motion.h3>
              <motion.p
                className="text-gray-700 leading-relaxed transition-all duration-200 group-hover:text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.4 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                {benefit.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* First Section CTA Button */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
        >
          {/* Commented out for now - will be replaced with waitlist
          <Link href="/auth">
            <button className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px] mx-auto">
              <span>Get started</span>
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                size={18}
              />
            </button>
          </Link>
          */}
          <button 
            onClick={() => window.location.href = '/waitlist'}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[200px] h-[48px] sm:h-[56px] mx-auto"
          >
            <span>Join waitlist</span>
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
          </button>
        </motion.div>

        {/* Testimonials Section */}
        <div className="mt-16 sm:mt-32">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <motion.h3
              className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Trusted by leading companies
            </motion.h3>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Join companies that trust our platform to find their next great
              hire
            </motion.p>
          </motion.div>

          <motion.div
            className="relative pt-4 pb-8 sm:py-8 max-w-4xl mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
          >
            {/* Left fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-amber-100 to-transparent z-10 pointer-events-none" />

            {/* Right fade effect */}
            <div className="absolute -right-4 top-0 bottom-0 w-44 sm:w-20 bg-gradient-to-l from-amber-100 to-transparent z-10 pointer-events-none" />

            <div className="flex items-center space-x-8 sm:space-x-12 animate-scroll">
              {/* Company Logos - Moving Display */}
              <div className="flex items-center justify-center w-32 h-20 sm:w-48 sm:h-28 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/momentscience_logo.avif"
                  alt="Moment Science"
                  className="max-w-full max-h-full object-contain brightness-0"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/clever_logo.avif"
                  alt="Clever"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-32 h-16 sm:w-44 sm:h-20 p-1 flex-shrink-0">
                <span className="text-lg sm:text-2xl font-bold text-gray-800">
                  Bajaar LLC
                </span>
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/adspostx_logo.svg"
                  alt="AdsPostX"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/blastBucks_logo.webp"
                  alt="BlastBucks"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/enefits_logo.svg"
                  alt="Enefits"
                  className="max-w-full max-h-full object-contain brightness-0"
                />
              </div>

              {/* Duplicate logos for seamless loop */}
              <div className="flex items-center justify-center w-32 h-20 sm:w-48 sm:h-28 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/momentscience_logo.avif"
                  alt="Moment Science"
                  className="max-w-full max-h-full object-contain brightness-0"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/clever_logo.avif"
                  alt="Clever"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-32 h-16 sm:w-44 sm:h-20 p-1 flex-shrink-0">
                <span className="text-lg sm:text-2xl font-bold text-gray-800">
                  Bajaar LLC
                </span>
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/adspostx_logo.svg"
                  alt="AdsPostX"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/blastBucks_logo.webp"
                  alt="BlastBucks"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex items-center justify-center w-28 h-16 sm:w-40 sm:h-24 p-2 sm:p-4 flex-shrink-0">
                <img
                  src="/img/enefits_logo.svg"
                  alt="Enefits"
                  className="max-w-full max-h-full object-contain brightness-0"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Expert Skills Section */}
        <div className="mt-8 sm:mt-16">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <motion.span
              className="bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 px-4 py-2 mb-10 inline-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-center space-x-2">
                <Zap size={16} />
                <span>Expert skills</span>
              </div>
            </motion.span>
            <motion.h3
              className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold text-primary-dark"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Wide range of expertise
            </motion.h3>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              Our platform connects you with professionals across diverse
              industries and skill sets
            </motion.p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                className="flex items-center space-x-2 sm:space-x-3 px-2 py-1 sm:px-4 sm:py-2 bg-white/90 rounded-full border border-amber-200/50 shadow-sm hover:bg-white hover:border-amber-300/70 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <motion.span
                  className="text-base sm:text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 3.4 + index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  {skill.emoji}
                </motion.span>
                <motion.span
                  className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 text-primary-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 3.6 + index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  {skill.category}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Jobs Section */}
        <div
          id="jobs"
          className="mt-12 sm:mt-20 pt-12 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-amber-50 via-white to-amber-50 relative rounded-t-3xl sm:rounded-3xl overflow-hidden"
        >
          <div className="container-custom relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.span
                className="bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-400 rounded-full text-sm font-medium text-gray-900 px-4 py-2 mb-6 inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <Briefcase size={16} />
                  <span>Open positions</span>
                </div>
              </motion.span>
              <motion.h3
                className="text-3xl lg:text-5xl text-gray-900 leading-tight mb-6 normal-case font-semibold text-primary-dark"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Join our team
              </motion.h3>
              <motion.p
                className="text-base sm:text-lg lg:text-xl text-gray-800 max-w-3xl mx-auto mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Discover exciting opportunities and be part of our mission to
                connect top talent with amazing companies
              </motion.p>
            </motion.div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.title}
                  className="bg-white/90 rounded-3xl p-6 shadow-lg border border-amber-200/30 hover:shadow-xl transition-all duration-200 group hover:-translate-y-1 hover:bg-white hover:border-amber-300/50"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 4.8 + index * 0.2,
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -3,
                  }}
                >
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 5.0 + index * 0.2 }}
                  >
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      {job.type}
                    </span>
                    <span className="text-xs text-gray-500">{job.date}</span>
                  </motion.div>
                  <motion.h4
                    className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-200"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 5.2 + index * 0.2 }}
                  >
                    {job.title}
                  </motion.h4>
                  <motion.p
                    className="text-sm text-gray-600 mb-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 5.4 + index * 0.2 }}
                  >
                    {job.location}
                  </motion.p>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 5.6 + index * 0.2 }}
                  >
                    {job.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-xl"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: 5.8 + index * 0.2 + tagIndex * 0.1,
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* See More Jobs Button */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 6.0 }}
            >
              <Link href="/jobs">
                <button className="btn-primary text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-center space-x-2 group w-[180px] sm:w-[240px] h-[48px] sm:h-[56px] mx-auto">
                  <span>See more jobs</span>
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                    size={18}
                  />
                </button>
              </Link>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              className="bg-white/80 rounded-3xl p-8 shadow-lg border border-amber-200/30 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 6.2 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <motion.div
                  className="flex-1 text-center md:text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 6.4 }}
                >
                  <motion.blockquote
                    className="text-lg md:text-xl text-gray-800 italic mb-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 6.6 }}
                  >
                    "Hiring through POM was seamless, smooth process, easy
                    communication, and great support!"
                  </motion.blockquote>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 6.8 }}
                  >
                    <p className="font-semibold text-gray-900">Hassan</p>
                    <p className="text-sm text-gray-600">Product Designer</p>
                  </motion.div>
                </motion.div>
                <motion.div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0"
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 6.3 }}
                >
                  <img
                    src="/img/hassan_productDesigner.avif"
                    alt="Hassan - Product Designer"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
