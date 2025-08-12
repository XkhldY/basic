'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, MapPin, Building, Edit3, Activity, Briefcase } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface UserDetail {
  id: number;
  email: string;
  full_name: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
}

interface JobSummary {
  id: number;
  title: string;
  status: string;
  created_at: string;
  applications_count: number;
}

interface ApplicationSummary {
  id: number;
  job_title: string;
  company_name: string;
  status: string;
  created_at: string;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [userJobs, setUserJobs] = useState<JobSummary[]>([]);
  const [userApplications, setUserApplications] = useState<ApplicationSummary[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'admin') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (params.id && user?.user_type === 'admin') {
      loadUserDetail();
      loadUserActivity();
    }
  }, [params.id, user]);

  const loadUserDetail = async () => {
    setLoadingUser(true);
    try {
      const response = await apiClient.get(`/api/admin/users/${params.id}`);
      setUserDetail(response.data);
    } catch (error) {
      console.error('Failed to load user details:', error);
      router.push('/admin/users');
    } finally {
      setLoadingUser(false);
    }
  };

  const loadUserActivity = async () => {
    try {
      // Load jobs for employers
      if (userDetail?.user_type === 'employer') {
        const jobsResponse = await apiClient.get(`/api/admin/users/${params.id}/jobs`);
        setUserJobs(jobsResponse.data);
      }
      
      // Load applications for candidates
      if (userDetail?.user_type === 'candidate') {
        const applicationsResponse = await apiClient.get(`/api/admin/users/${params.id}/applications`);
        setUserApplications(applicationsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load user activity:', error);
    }
  };

  const toggleUserStatus = async () => {
    if (!userDetail) return;
    
    try {
      await apiClient.put(`/api/admin/users/${params.id}`, {
        is_active: !userDetail.is_active
      });
      setUserDetail(prev => prev ? { ...prev, is_active: !prev.is_active } : null);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUserType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-red-100 text-red-800',
      pending: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      shortlisted: 'bg-indigo-100 text-indigo-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading || loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">User not found</div>
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
                onClick={() => router.push('/admin/users')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleUserStatus}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  userDetail.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {userDetail.is_active ? 'Deactivate' : 'Activate'} User
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userDetail.full_name}</h2>
                <p className="text-gray-600">{formatUserType(userDetail.user_type)}</p>
                <div className="mt-2">
                  {userDetail.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{userDetail.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">
                      Joined {formatDate(userDetail.created_at)}
                    </span>
                  </div>

                  {userDetail.last_login && (
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">
                        Last login {formatDate(userDetail.last_login)}
                      </span>
                    </div>
                  )}

                  {userDetail.company && (
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{userDetail.company}</span>
                    </div>
                  )}

                  {userDetail.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{userDetail.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Activity
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{userDetail.email}</p>
                        </div>
                        {userDetail.phone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="mt-1 text-sm text-gray-900">{userDetail.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {userDetail.bio && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Bio</h3>
                        <p className="text-sm text-gray-900">{userDetail.bio}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">User Type</label>
                          <p className="mt-1 text-sm text-gray-900">{formatUserType(userDetail.user_type)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {userDetail.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Member Since</label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(userDetail.created_at)}</p>
                        </div>
                        {userDetail.last_login && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Login</label>
                            <p className="mt-1 text-sm text-gray-900">{formatDate(userDetail.last_login)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    {userDetail.user_type === 'employer' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Postings</h3>
                        {userJobs.length > 0 ? (
                          <div className="space-y-4">
                            {userJobs.map((job) => (
                              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                                    <p className="text-sm text-gray-600">
                                      Posted {formatDate(job.created_at)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {job.applications_count} applications
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(job.status)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No job postings yet</p>
                        )}
                      </div>
                    )}

                    {userDetail.user_type === 'candidate' && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Applications</h3>
                        {userApplications.length > 0 ? (
                          <div className="space-y-4">
                            {userApplications.map((application) => (
                              <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{application.job_title}</h4>
                                    <p className="text-sm text-gray-600">{application.company_name}</p>
                                    <p className="text-sm text-gray-600">
                                      Applied {formatDate(application.created_at)}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusBadge(application.status)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No applications yet</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}