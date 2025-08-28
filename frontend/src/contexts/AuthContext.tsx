'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'candidate' | 'employer' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  
  // Basic profile fields
  phone_number?: string;
  date_of_birth?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  
  // Candidate-specific fields
  professional_title?: string;
  experience_level?: string;
  skills?: string;
  portfolio_url?: string;
  education_level?: string;
  years_of_experience?: string;
  current_salary?: number;
  expected_salary?: number;
  preferred_work_type?: string;
  willing_to_relocate?: boolean;
  notice_period?: string;
  technical_skills?: string[];
  soft_skills?: string[];
  certifications?: string[];
  languages?: string[];
  desired_industries?: string[];
  work_schedule_preference?: string;
  remote_work_preference?: string;
  travel_willingness?: string;
  
  // Employer-specific fields
  company_name?: string;
  company_size?: string;
  industry?: string;
  company_description?: string;
  company_website?: string;
  company_logo_url?: string;
  founded_year?: string;
  company_type?: string;
  revenue_range?: string;
  employee_count?: number;
  contact_person?: string;
  contact_phone?: string;
  company_address?: string;
  company_city?: string;
  company_state?: string;
  company_country?: string;
  company_postal_code?: string;
  tax_id?: string;
  registration_number?: string;
  business_license?: string;
  hiring_frequency?: string;
  typical_contract_length?: string;
  remote_policy?: string;
  benefits_offered?: string[];
  
  // Admin fields
  admin_role?: string;
  permissions?: string;
  department?: string;
  
  // Resume fields
  resume_url?: string;
  resume_file_name?: string;
  resume_uploaded_at?: string;
  resume_file_size?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('access_token');
      if (token) {
        const response = await apiClient.get('/api/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      // Store tokens
      Cookies.set('access_token', access_token, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', refresh_token, { expires: 7 }); // 7 days

      // Get user info
      const userResponse = await apiClient.get('/api/auth/me');
      setUser(userResponse.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}