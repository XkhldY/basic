'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Building, Mail, Globe, Edit, Save, X, Phone, MapPin, Calendar, Users, DollarSign, FileText, Award, Briefcase, Globe2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { TagsInput } from '@/components/forms/TagsInput';
import { ProfileCompletion } from '@/components/ProfileCompletion';

interface ProfileCompletionData {
  completion_percentage: number;
  missing_fields: string[];
  completed_sections: string[];
  total_sections: number;
}

export default function EmployerProfilePage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletionData | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    company_name: '',
    company_size: '',
    industry: '',
    company_description: '',
    company_website: '',
    company_logo_url: '',
    founded_year: '',
    company_type: '',
    revenue_range: '',
    employee_count: '',
    contact_person: '',
    contact_phone: '',
    company_address: '',
    company_city: '',
    company_state: '',
    company_country: '',
    company_postal_code: '',
    tax_id: '',
    registration_number: '',
    business_license: '',
    hiring_frequency: '',
    typical_contract_length: '',
    remote_policy: '',
    benefits_offered: [] as string[]
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'employer') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        company_name: user.company_name || '',
        company_size: user.company_size || '',
        industry: user.industry || '',
        company_description: user.company_description || '',
        company_website: user.company_website || '',
        company_logo_url: user.company_logo_url || '',
        founded_year: user.founded_year || '',
        company_type: user.company_type || '',
        revenue_range: user.revenue_range || '',
        employee_count: user.employee_count || '',
        contact_person: user.contact_person || '',
        contact_phone: user.contact_phone || '',
        company_address: user.company_address || '',
        company_city: user.company_city || '',
        company_state: user.company_state || '',
        company_country: user.company_country || '',
        company_postal_code: user.company_postal_code || '',
        tax_id: user.tax_id || '',
        registration_number: user.registration_number || '',
        business_license: user.business_license || '',
        hiring_frequency: user.hiring_frequency || '',
        typical_contract_length: user.typical_contract_length || '',
        remote_policy: user.remote_policy || '',
        benefits_offered: user.benefits_offered || []
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfileCompletion();
    }
  }, [user]);

  const loadProfileCompletion = async () => {
    try {
      const response = await apiClient.get('/api/auth/profile/completion');
      setProfileCompletion(response.data);
    } catch (error) {
      console.error('Failed to load profile completion:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/api/auth/profile/advanced/employer', profileData);
      updateUser({ ...user, ...profileData });
      setEditing(false);
      loadProfileCompletion(); // Refresh completion data
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        company_name: user.company_name || '',
        company_size: user.company_size || '',
        industry: user.industry || '',
        company_description: user.company_description || '',
        company_website: user.company_website || '',
        company_logo_url: user.company_logo_url || '',
        founded_year: user.founded_year || '',
        company_type: user.company_type || '',
        revenue_range: user.revenue_range || '',
        employee_count: user.employee_count || '',
        contact_person: user.contact_person || '',
        contact_phone: user.contact_phone || '',
        company_address: user.company_address || '',
        company_city: user.company_city || '',
        company_state: user.company_state || '',
        company_country: user.company_country || '',
        company_postal_code: user.company_postal_code || '',
        tax_id: user.tax_id || '',
        registration_number: user.registration_number || '',
        business_license: user.business_license || '',
        hiring_frequency: user.hiring_frequency || '',
        typical_contract_length: user.typical_contract_length || '',
        remote_policy: user.remote_policy || '',
        benefits_offered: user.benefits_offered || []
      });
    }
    setEditing(false);
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
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        {/* Profile Completion */}
        {profileCompletion && (
          <div className="mb-8">
            <ProfileCompletion
              percentage={profileCompletion.completion_percentage}
              missingFields={profileCompletion.missing_fields}
              completedSections={profileCompletion.completed_sections}
              totalSections={profileCompletion.total_sections}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.company_name}
                        onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.company_name || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.industry}
                        onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Technology, Healthcare, Finance"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.industry || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    {editing ? (
                      <select
                        value={profileData.company_size}
                        onChange={(e) => setProfileData({ ...profileData, company_size: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.company_size || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Type
                    </label>
                    {editing ? (
                      <select
                        value={profileData.company_type}
                        onChange={(e) => setProfileData({ ...profileData, company_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select company type</option>
                        <option value="startup">Startup</option>
                        <option value="small_business">Small Business</option>
                        <option value="medium_business">Medium Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="agency">Agency</option>
                        <option value="consulting">Consulting</option>
                        <option value="non_profit">Non-profit</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.company_type || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={profileData.founded_year}
                        onChange={(e) => setProfileData({ ...profileData, founded_year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2020"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.founded_year || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue Range
                    </label>
                    {editing ? (
                      <select
                        value={profileData.revenue_range}
                        onChange={(e) => setProfileData({ ...profileData, revenue_range: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select revenue range</option>
                        <option value="under_1m">Under $1M</option>
                        <option value="1m_10m">$1M - $10M</option>
                        <option value="10m_50m">$10M - $50M</option>
                        <option value="50m_100m">$50M - $100M</option>
                        <option value="100m_500m">$100M - $500M</option>
                        <option value="500m_1b">$500M - $1B</option>
                        <option value="over_1b">Over $1B</option>
                      </select>
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.revenue_range || 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  {editing ? (
                    <textarea
                      value={profileData.company_description}
                      onChange={(e) => setProfileData({ ...profileData, company_description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your company, mission, values, and what makes you unique..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-900 whitespace-pre-wrap">{user?.company_description || 'No company description provided'}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.contact_person}
                        onChange={(e) => setProfileData({ ...profileData, contact_person: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full Name"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.contact_person || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profileData.contact_phone}
                        onChange={(e) => setProfileData({ ...profileData, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.contact_phone || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.company_website}
                        onChange={(e) => setProfileData({ ...profileData, company_website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourcompany.com"
                      />
                    ) : user?.company_website ? (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={user.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.company_website}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">No website specified</p>
                    )}
                  </div>
                </div>

                {/* Company Address */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Company Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                      {editing ? (
                        <textarea
                          value={profileData.company_address}
                          onChange={(e) => setProfileData({ ...profileData, company_address: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Business Street"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.company_address || 'Not specified'}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City</label>
                        {editing ? (
                          <input
                            type="text"
                            value={profileData.company_city}
                            onChange={(e) => setProfileData({ ...profileData, company_city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="City"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.company_city || 'Not specified'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">State/Province</label>
                        {editing ? (
                          <input
                            type="text"
                            value={profileData.company_state}
                            onChange={(e) => setProfileData({ ...profileData, company_state: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="State"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.company_state || 'Not specified'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Country</label>
                        {editing ? (
                          <input
                            type="text"
                            value={profileData.company_country}
                            onChange={(e) => setProfileData({ ...profileData, company_country: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Country"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.company_country || 'Not specified'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                        {editing ? (
                          <input
                            type="text"
                            value={profileData.company_postal_code}
                            onChange={(e) => setProfileData({ ...profileData, company_postal_code: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="12345"
                          />
                        ) : (
                          <p className="text-gray-900">{user?.company_postal_code || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Details */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.tax_id}
                        onChange={(e) => setProfileData({ ...profileData, tax_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tax identification number"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.tax_id || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.registration_number}
                        onChange={(e) => setProfileData({ ...profileData, registration_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Business registration number"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.registration_number || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business License
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.business_license}
                        onChange={(e) => setProfileData({ ...profileData, business_license: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Business license number"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.business_license || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Hiring Preferences */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Hiring Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiring Frequency
                    </label>
                    {editing ? (
                      <select
                        value={profileData.hiring_frequency}
                        onChange={(e) => setProfileData({ ...profileData, hiring_frequency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select hiring frequency</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="biannually">Biannually</option>
                        <option value="annually">Annually</option>
                        <option value="as_needed">As Needed</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.hiring_frequency || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typical Contract Length
                    </label>
                    {editing ? (
                      <select
                        value={profileData.typical_contract_length}
                        onChange={(e) => setProfileData({ ...profileData, typical_contract_length: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select contract length</option>
                        <option value="permanent">Permanent</option>
                        <option value="6_months">6 Months</option>
                        <option value="1_year">1 Year</option>
                        <option value="2_years">2 Years</option>
                        <option value="project_based">Project Based</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.typical_contract_length || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remote Work Policy
                    </label>
                    {editing ? (
                      <select
                        value={profileData.remote_policy}
                        onChange={(e) => setProfileData({ ...profileData, remote_policy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select remote policy</option>
                        <option value="fully_remote">Fully Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="occasional_remote">Occasional Remote</option>
                        <option value="on_site_only">On-site Only</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.remote_policy || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits Offered
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.benefits_offered}
                        onChange={(benefits) => setProfileData({ ...profileData, benefits_offered: benefits })}
                        placeholder="Add benefits..."
                        suggestions={['Health Insurance', 'Dental Insurance', 'Vision Insurance', '401(k)', 'Paid Time Off', 'Flexible Hours', 'Remote Work', 'Professional Development', 'Gym Membership', 'Free Meals']}
                        maxTags={12}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.benefits_offered?.length ? (
                          user.benefits_offered.map((benefit, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {benefit}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No benefits specified</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Account Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Verification
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



