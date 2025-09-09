'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Users, Send, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface JobDetail {
  id: number;
  title: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  company_name: string;
  employer_id: number;
  location: string | null;
  location_type: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  required_skills: string | null;
  experience_level: string | null;
  application_deadline: string | null;
  application_email: string | null;
  application_url: string | null;
  created_at: string;
  views_count: number;
  applications_count: number;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    additional_notes: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (params.id) {
      loadJobDetail();
    }
  }, [params.id]);

  const loadJobDetail = async () => {
    setJobLoading(true);
    try {
      const response = await apiClient.get(`/api/jobs/${params.id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Failed to load job details:', error);
      router.push('/jobs');
    } finally {
      setJobLoading(false);
    }
  };

  const handleApply = async () => {
    if (!applicationData.cover_letter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setApplying(true);
    try {
      await apiClient.post(`/api/jobs/${params.id}/apply`, {
        job_id: parseInt(params.id),
        cover_letter: applicationData.cover_letter,
        additional_notes: applicationData.additional_notes
      });
      setApplied(true);
      setShowApplicationForm(false);
    } catch (error: unknown) {
      console.error('Failed to apply:', error);
      const errorMessage = error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'detail' in error.response.data
        ? (error.response.data as { detail: string }).detail
        : error instanceof Error
          ? error.message
          : 'Application failed. Please try again.';
      alert(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
    return 'Salary not disclosed';
  };

  const formatEmploymentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading || jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Job Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <Building className="h-5 w-5 mr-2" />
                  <Link href={`/company/${job.employer_id}`} className="font-medium text-blue-600 hover:underline">
                    {job.company_name}
                  </Link>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location ? `${job.location} (${formatEmploymentType(job.location_type)})` : formatEmploymentType(job.location_type)}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatEmploymentType(job.employment_type)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {job.applications_count} applications
                  </div>
                </div>
              </div>
              
              {user?.user_type === 'candidate' && (
                <div className="ml-6">
                  {applied ? (
                    <div className="flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Applied Successfully
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
              </div>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{job.responsibilities}</p>
                </div>
              </section>
            )}

            {/* Requirements */}
            {job.requirements && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">{job.requirements}</p>
                </div>
              </section>
            )}

            {/* Skills and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {job.required_skills && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                  <p className="text-gray-700">{job.required_skills}</p>
                </section>
              )}
              
              {job.experience_level && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Level</h2>
                  <p className="text-gray-700 capitalize">{job.experience_level}</p>
                </section>
              )}
            </div>

            {/* Application Info */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Information</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Posted:</span> {new Date(job.created_at).toLocaleDateString()}</p>
                {job.application_deadline && (
                  <p><span className="font-medium">Application Deadline:</span> {new Date(job.application_deadline).toLocaleDateString()}</p>
                )}
                {job.application_email && (
                  <p><span className="font-medium">Contact Email:</span> {job.application_email}</p>
                )}
                {job.application_url && (
                  <p><span className="font-medium">Application URL:</span> 
                    <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      {job.application_url}
                    </a>
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Apply for {job.title}</h3>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={applicationData.cover_letter}
                    onChange={(e) => setApplicationData({ ...applicationData, cover_letter: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write a compelling cover letter explaining why you're a great fit for this position..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={applicationData.additional_notes}
                    onChange={(e) => setApplicationData({ ...applicationData, additional_notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying || !applicationData.cover_letter.trim()}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}