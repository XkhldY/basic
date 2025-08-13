'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Filter, Eye, Mail, Phone, CheckCircle, XCircle, Clock, Star, MessageSquare } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Application {
  id: number;
  job_id: number;
  candidate_id: number;
  status: string;
  cover_letter: string;
  additional_notes: string | null;
  employer_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  job_title: string;
  company_name: string;
  candidate_name: string;
  candidate_email: string;
}

interface Job {
  id: number;
  title: string;
}

export default function EmployerApplicationsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [bulkSelectedIds, setBulkSelectedIds] = useState<number[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'employer') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.user_type === 'employer') {
      loadApplications();
      loadJobs();
    }
  }, [user, selectedJobId, statusFilter]);

  const loadApplications = async () => {
    setApplicationsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedJobId) params.append('job_id', selectedJobId);
      if (statusFilter) params.append('status_filter', statusFilter);
      
      const response = await apiClient.get(`/api/applications/employer/all?${params.toString()}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await apiClient.get('/api/jobs/employer/my-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, employerNotes?: string) => {
    setUpdating(true);
    try {
      await apiClient.put(`/api/applications/${applicationId}/status`, {
        status,
        employer_notes: employerNotes
      });
      loadApplications(); // Refresh the list
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    if (bulkSelectedIds.length === 0) return;
    
    setUpdating(true);
    try {
      await apiClient.post('/api/applications/bulk-update', {
        application_ids: bulkSelectedIds,
        status
      });
      setBulkSelectedIds([]);
      loadApplications(); // Refresh the list
    } catch (error) {
      console.error('Failed to bulk update applications:', error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleBulkSelection = (applicationId: number) => {
    setBulkSelectedIds(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
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
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/employer/jobs')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Manage Jobs
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
        {/* Filters and Bulk Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Job</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {bulkSelectedIds.length > 0 && (
              <div className="flex space-x-2">
                <span className="text-sm text-gray-600 self-center">
                  {bulkSelectedIds.length} selected
                </span>
                <button
                  onClick={() => bulkUpdateStatus('shortlisted')}
                  disabled={updating}
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => bulkUpdateStatus('rejected')}
                  disabled={updating}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Applications List */}
        {applicationsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Loading applications...</div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-gray-500">Applications will appear here when candidates apply to your jobs</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={bulkSelectedIds.length === applications.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelectedIds(applications.map(app => app.id));
                        } else {
                          setBulkSelectedIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={bulkSelectedIds.includes(application.id)}
                        onChange={() => toggleBulkSelection(application.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.candidate_name}</div>
                        <div className="text-sm text-gray-500">{application.candidate_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {formatStatus(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                          disabled={updating}
                          className="text-purple-600 hover:text-purple-900"
                          title="Shortlist"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          disabled={updating}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Application Details - {selectedApplication.candidate_name}
                  </h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Candidate Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Candidate Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedApplication.candidate_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedApplication.candidate_email}</p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Application Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
                      <p className="text-sm text-gray-900">{selectedApplication.job_title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                      </div>
                    </div>
                    {selectedApplication.additional_notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedApplication.additional_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Management */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Status Management</h4>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'reviewed', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                        disabled={updating}
                        className={`px-3 py-2 text-xs font-medium rounded-md ${
                          selectedApplication.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {formatStatus(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}