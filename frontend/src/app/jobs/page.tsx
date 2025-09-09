'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Search, Filter, Building } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string | null;
  location_type: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  status: string;
  created_at: string;
  views_count: number;
  applications_count: number;
}

export default function JobsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [locationTypeFilter, setLocationTypeFilter] = useState('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('');
  const [salaryMinFilter, setSalaryMinFilter] = useState('');
  const [salaryMaxFilter, setSalaryMaxFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    loadJobs();
  }, [searchTerm, locationFilter, employmentTypeFilter, locationTypeFilter, experienceLevelFilter, salaryMinFilter, salaryMaxFilter, industryFilter, companyFilter]);

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (locationFilter) params.append('location', locationFilter);
      if (employmentTypeFilter) params.append('employment_type', employmentTypeFilter);
      if (locationTypeFilter) params.append('location_type', locationTypeFilter);
      if (experienceLevelFilter) params.append('experience_level', experienceLevelFilter);
      if (salaryMinFilter) params.append('salary_min', salaryMinFilter);
      if (salaryMaxFilter) params.append('salary_max', salaryMaxFilter);
      if (industryFilter) params.append('industry', industryFilter);
      if (companyFilter) params.append('company', companyFilter);
      
      const response = await apiClient.get(`/api/jobs?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setJobsLoading(false);
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

  const formatLocationData = (location: string | null, locationType: string) => {
    const typeFormatted = formatEmploymentType(locationType);
    return location ? `${location} (${typeFormatted})` : typeFormatted;
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
              <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
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
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Job title, skills, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="City, state, country..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <select
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              >
                <option value="">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
              <select
                value={locationTypeFilter}
                onChange={(e) => setLocationTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              >
                <option value="">All</option>
                <option value="remote">Remote</option>
                <option value="on_site">On Site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Filters Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={experienceLevelFilter}
                    onChange={(e) => setExperienceLevelFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5-8 years)</option>
                    <option value="lead">Lead Level (8+ years)</option>
                    <option value="executive">Executive Level</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={salaryMinFilter}
                    onChange={(e) => setSalaryMinFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    placeholder="120000"
                    value={salaryMaxFilter}
                    onChange={(e) => setSalaryMaxFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Technology"
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Company name..."
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        {jobsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Loading jobs...</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {jobs.length} Job{jobs.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            
            {jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => router.push(`/jobs/${job.id}`)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                            {job.title}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            job.employment_type === 'full_time' ? 'bg-green-100 text-green-800' :
                            job.employment_type === 'part_time' ? 'bg-blue-100 text-blue-800' :
                            job.employment_type === 'contract' ? 'bg-purple-100 text-purple-800' :
                            job.employment_type === 'internship' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatEmploymentType(job.employment_type)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="font-medium">{job.company_name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {formatLocationData(job.location, job.location_type)}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{job.views_count} views</span>
                          <span>{job.applications_count} applications</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}