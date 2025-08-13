'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from "next/image";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Platform</h1>
          <a
            href="/auth"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login / Register
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Job or 
            <span className="text-blue-600"> Top Talent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect employers with talented candidates in our modern job platform. 
            Whether you're looking to hire or get hired, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/auth"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/auth"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-12 mt-20">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Image
                src="/briefcase.svg"
                alt="For Employers"
                width={32}
                height={32}
                className="text-blue-600"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Employers</h3>
            <p className="text-gray-600 mb-6">
              Post job openings, manage applications, and find the perfect candidates 
              for your team with our intuitive employer dashboard.
            </p>
            <a
              href="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Hiring
            </a>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Image
                src="/user.svg"
                alt="For Candidates"
                width={32}
                height={32}
                className="text-green-600"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Candidates</h3>
            <p className="text-gray-600 mb-6">
              Showcase your skills, browse job opportunities, and apply to positions 
              that match your experience and career goals.
            </p>
            <a
              href="/auth"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Find Jobs
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
