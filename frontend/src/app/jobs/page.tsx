'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookiesBanner from '@/components/CookiesBanner';
import { JOBS } from '@/data/jobs';

// Use static job list for display; each job links to its detail page on this site.
const MOCK_JOBS = JOBS.map((j) => ({
  id: j.id,
  title: j.title,
  employmentType: j.employmentType,
  location: j.location,
  date: j.date,
  slug: j.slug,
}));

const JOBS_PER_PAGE = 6;

export default function JobsPage() {
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);
  const jobs = MOCK_JOBS.slice(0, visibleCount);
  const hasMore = visibleCount < MOCK_JOBS.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + JOBS_PER_PAGE, MOCK_JOBS.length));
  };

  return (
    <main className="min-h-screen scroll-smooth bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation />

      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl font-semibold text-white text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Browse All Jobs
          </motion.h1>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/jobs/${job.slug}`}
                  className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {job.title}
                      </h2>
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
                    </div>
                    <span className="text-sm font-medium text-blue-400 sm:shrink-0">
                      View details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                onClick={loadMore}
                className="btn-primary px-8 py-3 text-base font-medium"
              >
                Load More
              </button>
            </motion.div>
          )}

          <p className="text-center text-gray-400 text-sm mt-8">
            Apply via the link on each job page.
          </p>
        </div>
      </section>

      <Footer />
      <CookiesBanner />
    </main>
  );
}
