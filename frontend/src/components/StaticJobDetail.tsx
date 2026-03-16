'use client';

import Link from 'next/link';
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookiesBanner from '@/components/CookiesBanner';
import type { JobDetail } from '@/data/jobs';

export default function StaticJobDetail({ job }: { job: JobDetail }) {
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
            <Link
              href="/auth"
              className="btn-primary inline-flex items-center justify-center px-8 py-3 text-base font-medium"
            >
              Apply for this job
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <CookiesBanner />
    </main>
  );
}
