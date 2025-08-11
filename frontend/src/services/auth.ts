import { apiClient } from '@/lib/api';
import { UnifiedFormData } from '@/types/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegistrationResponse {
  message: string;
  user_id: number;
}

export const authService = {
  // Login
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  // Register candidate
  async registerCandidate(data: UnifiedFormData): Promise<RegistrationResponse> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      user_type: 'candidate',
      professional_title: data.professionalTitle,
      experience_level: data.experienceLevel,
      skills: data.skills,
      portfolio_url: data.portfolioUrl || null,
    };

    const response = await apiClient.post('/api/auth/register/candidate', payload);
    return response.data;
  },

  // Register employer
  async registerEmployer(data: UnifiedFormData): Promise<RegistrationResponse> {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      user_type: 'employer',
      company_name: data.companyName,
      company_size: data.companySize,
      industry: data.industry,
      company_description: data.companyDescription || null,
    };

    const response = await apiClient.post('/api/auth/register/employer', payload);
    return response.data;
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },
};