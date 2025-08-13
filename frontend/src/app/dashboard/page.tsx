'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Building, Briefcase, Award } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type === 'admin') {
      router.push('/admin');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Job Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.user_type === 'employer' ? (
                        <Building className="h-8 w-8 text-blue-600" />
                      ) : (
                        <User className="h-8 w-8 text-green-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {user.user_type === 'employer' ? 'Employer Profile' : 'Candidate Profile'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user.user_type === 'employer' ? user.company_name : user.professional_title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900">{user.email}</dd>
                      </div>
                      
                      {user.user_type === 'employer' ? (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                            <dd className="text-sm text-gray-900">{user.company_size}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Industry</dt>
                            <dd className="text-sm text-gray-900">{user.industry}</dd>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                            <dd className="text-sm text-gray-900">{user.experience_level}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Skills</dt>
                            <dd className="text-sm text-gray-900">{user.skills}</dd>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {user.user_type === 'employer' ? 'Employer Dashboard' : 'Candidate Dashboard'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.user_type === 'employer' ? (
                      <>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                            <h4 className="ml-2 text-lg font-medium">Post Jobs</h4>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Create and manage job postings
                          </p>
                          <button 
                            onClick={() => router.push('/employer/jobs/create')}
                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                          >
                            Create Job Post
                          </button>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <User className="h-6 w-6 text-green-600" />
                            <h4 className="ml-2 text-lg font-medium">View Applications</h4>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Review candidate applications
                          </p>
                          <button 
                            onClick={() => router.push('/employer/applications')}
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                          >
                            View Applications
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Award className="h-6 w-6 text-blue-600" />
                            <h4 className="ml-2 text-lg font-medium">Browse Jobs</h4>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Find your next opportunity
                          </p>
                          <button 
                            onClick={() => router.push('/jobs')}
                            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                          >
                            Browse Jobs
                          </button>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Briefcase className="h-6 w-6 text-green-600" />
                            <h4 className="ml-2 text-lg font-medium">My Applications</h4>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Track your job applications
                          </p>
                          <button 
                            onClick={() => router.push('/candidate/applications')}
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                          >
                            My Applications
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}