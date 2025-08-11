'use client';

import { useState } from 'react';
import { Mail, Lock, User, Briefcase, UserCheck, CheckCircle, Building, Users, Globe, FileText, Award, Code, Upload } from 'lucide-react';
import { UserType, UnifiedFormData, COMPANY_SIZES, EXPERIENCE_LEVELS } from '@/types/auth';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<UserType>('candidate');
  const [formData, setFormData] = useState<UnifiedFormData>({
    name: '',
    email: '',
    password: '',
    userType: 'candidate',
    // Employer fields
    companyName: '',
    companySize: '',
    industry: '',
    companyDescription: '',
    // Candidate fields
    professionalTitle: '',
    experienceLevel: '',
    skills: '',
    portfolioUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Common validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // User type specific validation
    if (userType === 'employer') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }
      if (!formData.companySize) {
        newErrors.companySize = 'Company size is required';
      }
      if (!formData.industry.trim()) {
        newErrors.industry = 'Industry is required';
      }
    } else {
      if (!formData.professionalTitle.trim()) {
        newErrors.professionalTitle = 'Professional title is required';
      }
      if (!formData.experienceLevel) {
        newErrors.experienceLevel = 'Experience level is required';
      }
      if (!formData.skills.trim()) {
        newErrors.skills = 'Skills are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      console.log('Form submitted:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative w-full max-w-md flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="md:w-full p-8 md:p-12 flex justify-center items-center">
          <div className="w-full">
            <div className="flex justify-center mb-8">
              <button
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors duration-300 ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors duration-300 ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>
            {activeTab === 'login' ? (
              <div className="animate-fade-in">
                <div className="mb-6 relative">
                  <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300" 
                  />
                </div>
                <button type="button" className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Login
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-6 relative">
                  <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: ''});
                    }}
                    className={`border-2 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="mb-6 relative">
                  <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                    className={`border-2 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-6 relative">
                  <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({...formData, password: e.target.value});
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    className={`border-2 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="mb-6 relative">
                  <Briefcase className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                  <select 
                    value={userType}
                    onChange={(e) => {
                      const value = e.target.value as UserType;
                      setUserType(value);
                      setFormData({...formData, userType: value});
                    }}
                    className="border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300 appearance-none"
                  >
                    <option value="candidate">Candidate</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>

                {/* Conditional Fields Based on User Type */}
                {userType === 'employer' ? (
                  <>
                    <div className="mb-6 relative">
                      <Building className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <input 
                        type="text" 
                        placeholder="Company Name" 
                        value={formData.companyName}
                        onChange={(e) => {
                          setFormData({...formData, companyName: e.target.value});
                          if (errors.companyName) setErrors({...errors, companyName: ''});
                        }}
                        className={`border-2 ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                      />
                      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <Users className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <select 
                        value={formData.companySize}
                        onChange={(e) => {
                          setFormData({...formData, companySize: e.target.value});
                          if (errors.companySize) setErrors({...errors, companySize: ''});
                        }}
                        className={`border-2 ${errors.companySize ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300 appearance-none`}
                      >
                        <option value="">Company Size</option>
                        {COMPANY_SIZES.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                      {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <Globe className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <input 
                        type="text" 
                        placeholder="Industry" 
                        value={formData.industry}
                        onChange={(e) => {
                          setFormData({...formData, industry: e.target.value});
                          if (errors.industry) setErrors({...errors, industry: ''});
                        }}
                        className={`border-2 ${errors.industry ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                      />
                      {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <FileText className="absolute top-6 left-4 text-gray-400" size={22} />
                      <textarea 
                        placeholder="Company Description" 
                        value={formData.companyDescription}
                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                        rows={3}
                        className="border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300 resize-none" 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 relative">
                      <Award className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <input 
                        type="text" 
                        placeholder="Professional Title" 
                        value={formData.professionalTitle}
                        onChange={(e) => {
                          setFormData({...formData, professionalTitle: e.target.value});
                          if (errors.professionalTitle) setErrors({...errors, professionalTitle: ''});
                        }}
                        className={`border-2 ${errors.professionalTitle ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300`} 
                      />
                      {errors.professionalTitle && <p className="text-red-500 text-sm mt-1">{errors.professionalTitle}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <UserCheck className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <select 
                        value={formData.experienceLevel}
                        onChange={(e) => {
                          setFormData({...formData, experienceLevel: e.target.value});
                          if (errors.experienceLevel) setErrors({...errors, experienceLevel: ''});
                        }}
                        className={`border-2 ${errors.experienceLevel ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300 appearance-none`}
                      >
                        <option value="">Experience Level</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <Code className="absolute top-6 left-4 text-gray-400" size={22} />
                      <textarea 
                        placeholder="Key Skills (e.g., JavaScript, React, Python, etc.)" 
                        value={formData.skills}
                        onChange={(e) => {
                          setFormData({...formData, skills: e.target.value});
                          if (errors.skills) setErrors({...errors, skills: ''});
                        }}
                        rows={3}
                        className={`border-2 ${errors.skills ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300 resize-none`} 
                      />
                      {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                    </div>
                    <div className="mb-6 relative">
                      <Globe className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={22} />
                      <input 
                        type="url" 
                        placeholder="Portfolio URL (optional)" 
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                        className="border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-lg outline-none rounded-xl pl-12 pr-4 py-4 text-base w-full transition-all duration-300 hover:border-gray-300" 
                      />
                    </div>
                  </>
                )}

                <button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full font-bold py-3 px-4 rounded-full shadow-lg transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Registering...' : `Register as ${userType === 'employer' ? 'Employer' : 'Candidate'}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AuthPage;