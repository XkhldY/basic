'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, Clock, Eye, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Application {
  id: number;
  job_id: number;
  status: string;
  cover_letter: string;
  additional_notes: string | null;
  created_at: string;
  job_title: string;
  company_name: string;
}

export default function CandidateApplicationsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'candidate') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.user_type === 'candidate') {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    setApplicationsLoading(true);
    try {
      // This endpoint doesn't exist yet, but we'll create it in Phase 2
      // For now, we'll show a placeholder
      setApplications([]);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800';
      case 'interviewed': return 'bg-cyan-100 text-cyan-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-green-200 text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
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
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/jobs')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => ['reviewed', 'shortlisted', 'interview_scheduled', 'interviewed'].includes(app.status)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => ['offered', 'accepted'].includes(app.status)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applicationsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-gray-500">Start your job search by browsing available positions</p>
            <button
              onClick={() => router.push('/jobs')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.job_title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {formatStatus(application.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building className="h-4 w-4 mr-1" />
                      <span className="font-medium">{application.company_name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {application.cover_letter && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          <span className="font-medium">Cover Letter:</span> {application.cover_letter}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => router.push(`/jobs/${application.job_id}`)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Job"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}