'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Globe, Edit, Save, X, Phone, MapPin, Linkedin, Github, Calendar, DollarSign, Briefcase, Award, Languages, Building } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { TagsInput } from '@/components/forms/TagsInput';
import { ProfileCompletion } from '@/components/ProfileCompletion';

// TODO(human): Import the new validation hooks and form components:
// import { useProfileValidation } from '@/hooks/useProfileValidation';
// import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
// import { FormField } from '@/components/forms/FormField';
// Then add validation state, implement real-time validation, and enhance error handling

interface ProfileCompletionData {
  completion_percentage: number;
  missing_fields: string[];
  completed_sections: string[];
  total_sections: number;
}

export default function CandidateProfilePage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletionData | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    professional_title: '',
    experience_level: '',
    skills: '',
    portfolio_url: '',
    phone_number: '',
    date_of_birth: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    education_level: '',
    years_of_experience: '',
    current_salary: '',
    expected_salary: '',
    preferred_work_type: '',
    willing_to_relocate: false,
    notice_period: '',
    technical_skills: [] as string[],
    soft_skills: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
    desired_industries: [] as string[],
    work_schedule_preference: '',
    remote_work_preference: '',
    travel_willingness: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    } else if (!loading && isAuthenticated && user?.user_type !== 'candidate') {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        professional_title: user.professional_title || '',
        experience_level: user.experience_level || '',
        skills: user.skills || '',
        portfolio_url: user.portfolio_url || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        location: user.location || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        education_level: user.education_level || '',
        years_of_experience: user.years_of_experience || '',
        current_salary: user.current_salary?.toString() || '',
        expected_salary: user.expected_salary?.toString() || '',
        preferred_work_type: user.preferred_work_type || '',
        willing_to_relocate: user.willing_to_relocate || false,
        notice_period: user.notice_period || '',
        technical_skills: user.technical_skills || [],
        soft_skills: user.soft_skills || [],
        certifications: user.certifications || [],
        languages: user.languages || [],
        desired_industries: user.desired_industries || [],
        work_schedule_preference: user.work_schedule_preference || '',
        remote_work_preference: user.remote_work_preference || '',
        travel_willingness: user.travel_willingness || ''
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
      await apiClient.put('/api/auth/profile/advanced/candidate', profileData);
      updateUser({ 
        ...user, 
        ...profileData,
        current_salary: profileData.current_salary ? parseFloat(profileData.current_salary) : undefined,
        expected_salary: profileData.expected_salary ? parseFloat(profileData.expected_salary) : undefined
      });
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
        professional_title: user.professional_title || '',
        experience_level: user.experience_level || '',
        skills: user.skills || '',
        portfolio_url: user.portfolio_url || '',
        phone_number: user.phone_number || '',
        date_of_birth: user.date_of_birth || '',
        location: user.location || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        education_level: user.education_level || '',
        years_of_experience: user.years_of_experience || '',
        current_salary: user.current_salary?.toString() || '',
        expected_salary: user.expected_salary?.toString() || '',
        preferred_work_type: user.preferred_work_type || '',
        willing_to_relocate: user.willing_to_relocate || false,
        notice_period: user.notice_period || '',
        technical_skills: user.technical_skills || [],
        soft_skills: user.soft_skills || [],
        certifications: user.certifications || [],
        languages: user.languages || [],
        desired_industries: user.desired_industries || [],
        work_schedule_preference: user.work_schedule_preference || '',
        remote_work_preference: user.remote_work_preference || '',
        travel_willingness: user.travel_willingness || ''
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
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
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
              <h2 className="text-2xl font-bold text-gray-900">Professional Profile</h2>
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
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.name || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.phone_number || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={profileData.date_of_birth}
                        onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="City, State, Country"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.location || 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={profileData.professional_title}
                        onChange={(e) => setProfileData({ ...profileData, professional_title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.professional_title || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Professional Details */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    {editing ? (
                      <select
                        value={profileData.experience_level}
                        onChange={(e) => setProfileData({ ...profileData, experience_level: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select experience level</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (2-5 years)</option>
                        <option value="senior">Senior Level (5-8 years)</option>
                        <option value="lead">Lead Level (8+ years)</option>
                        <option value="executive">Executive Level</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.experience_level || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={profileData.years_of_experience}
                        onChange={(e) => setProfileData({ ...profileData, years_of_experience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5"
                        min="0"
                        max="50"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.years_of_experience || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level
                    </label>
                    {editing ? (
                      <select
                        value={profileData.education_level}
                        onChange={(e) => setProfileData({ ...profileData, education_level: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select education level</option>
                        <option value="high_school">High School</option>
                        <option value="associate">Associate Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.education_level || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Work Type
                    </label>
                    {editing ? (
                      <select
                        value={profileData.preferred_work_type}
                        onChange={(e) => setProfileData({ ...profileData, preferred_work_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select work type</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="on_site">On-site</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.preferred_work_type || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Salary (USD)
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={profileData.current_salary}
                        onChange={(e) => setProfileData({ ...profileData, current_salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="75000"
                        min="0"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.current_salary ? `$${user.current_salary.toLocaleString()}` : 'Not specified'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary (USD)
                    </label>
                    {editing ? (
                      <input
                        type="number"
                        value={profileData.expected_salary}
                        onChange={(e) => setProfileData({ ...profileData, expected_salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="85000"
                        min="0"
                      />
                    ) : (
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        {user?.expected_salary ? `$${user.expected_salary.toLocaleString()}` : 'Not specified'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.willing_to_relocate}
                      onChange={(e) => setProfileData({ ...profileData, willing_to_relocate: e.target.checked })}
                      disabled={!editing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Willing to relocate</span>
                  </label>
                </div>
              </section>

              {/* Skills & Expertise */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Skills & Expertise
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Skills
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.technical_skills}
                        onChange={(skills) => setProfileData({ ...profileData, technical_skills: skills })}
                        placeholder="Add technical skills..."
                        suggestions={['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes']}
                        maxTags={15}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.technical_skills?.length ? (
                          user.technical_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No technical skills specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soft Skills
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.soft_skills}
                        onChange={(skills) => setProfileData({ ...profileData, soft_skills: skills })}
                        placeholder="Add soft skills..."
                        suggestions={['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability']}
                        maxTags={10}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.soft_skills?.length ? (
                          user.soft_skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No soft skills specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.certifications}
                        onChange={(certs) => setProfileData({ ...profileData, certifications: certs })}
                        placeholder="Add certifications..."
                        suggestions={['AWS Certified', 'Google Cloud', 'Microsoft Azure', 'CISSP', 'PMP', 'Scrum Master']}
                        maxTags={10}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.certifications?.length ? (
                          user.certifications.map((cert, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {cert}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No certifications specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.languages}
                        onChange={(langs) => setProfileData({ ...profileData, languages: langs })}
                        placeholder="Add languages..."
                        suggestions={['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic']}
                        maxTags={8}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.languages?.length ? (
                          user.languages.map((lang, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No languages specified</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Work Preferences */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Work Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desired Industries
                    </label>
                    {editing ? (
                      <TagsInput
                        value={profileData.desired_industries}
                        onChange={(industries) => setProfileData({ ...profileData, desired_industries: industries })}
                        placeholder="Add desired industries..."
                        suggestions={['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Consulting']}
                        maxTags={8}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.desired_industries?.length ? (
                          user.desired_industries.map((industry, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                              {industry}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No industries specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Schedule Preference
                    </label>
                    {editing ? (
                      <select
                        value={profileData.work_schedule_preference}
                        onChange={(e) => setProfileData({ ...profileData, work_schedule_preference: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select schedule preference</option>
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.work_schedule_preference || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remote Work Preference
                    </label>
                    {editing ? (
                      <select
                        value={profileData.remote_work_preference}
                        onChange={(e) => setProfileData({ ...profileData, remote_work_preference: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select remote preference</option>
                        <option value="fully_remote">Fully Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="occasional">Occasional Remote</option>
                        <option value="on_site">On-site Only</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.remote_work_preference || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Willingness
                    </label>
                    {editing ? (
                      <select
                        value={profileData.travel_willingness}
                        onChange={(e) => setProfileData({ ...profileData, travel_willingness: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select travel willingness</option>
                        <option value="none">No Travel</option>
                        <option value="occasional">Occasional Travel</option>
                        <option value="frequent">Frequent Travel</option>
                        <option value="extensive">Extensive Travel</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{user?.travel_willingness || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Social & Portfolio */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Social & Portfolio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.linkedin_url}
                        onChange={(e) => setProfileData({ ...profileData, linkedin_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : user?.linkedin_url ? (
                      <div className="flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                        <a
                          href={user.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.linkedin_url}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">No LinkedIn profile specified</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.github_url}
                        onChange={(e) => setProfileData({ ...profileData, github_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://github.com/yourusername"
                      />
                    ) : user?.github_url ? (
                      <div className="flex items-center">
                        <Github className="h-4 w-4 mr-2 text-gray-800" />
                        <a
                          href={user.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:underline"
                        >
                          {user.github_url}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">No GitHub profile specified</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio URL
                    </label>
                    {editing ? (
                      <input
                        type="url"
                        value={profileData.portfolio_url}
                        onChange={(e) => setProfileData({ ...profileData, portfolio_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourportfolio.com"
                      />
                    ) : user?.portfolio_url ? (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={user.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.portfolio_url}
                        </a>
                      </div>
                    ) : (
                      <p className="text-gray-500">No portfolio URL specified</p>
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