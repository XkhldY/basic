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
  
  // Resume fields
  resume_url?: string;
  resume_file_name?: string;
  resume_uploaded_at?: string;
  resume_file_size?: number;
  
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
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  user_type: 'candidate' | 'employer';
  
  // Candidate registration fields
  professional_title?: string;
  experience_level?: string;
  skills?: string;
  portfolio_url?: string;
  
  // Employer registration fields
  company_name?: string;
  company_size?: string;
  industry?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface BaseFormData {
  name: string;
  email: string;
  password: string;
  userType: UserType;
}

export interface EmployerFormData extends BaseFormData {
  userType: 'employer';
  companyName: string;
  companySize: string;
  industry: string;
  companyDescription: string;
}

export interface CandidateFormData extends BaseFormData {
  userType: 'candidate';
  professionalTitle: string;
  experienceLevel: string;
  skills: string;
  portfolioUrl: string;
}

export interface AdminFormData extends BaseFormData {
  userType: 'admin';
  adminRole: string;
  department: string;
}

export type FormData = EmployerFormData | CandidateFormData | AdminFormData;

export interface UnifiedFormData extends BaseFormData {
  // Employer fields
  companyName: string;
  companySize: string;
  industry: string;
  companyDescription: string;
  // Candidate fields
  professionalTitle: string;
  experienceLevel: string;
  skills: string;
  portfolioUrl: string;
  // Admin fields
  adminRole: string;
  department: string;
}

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-1 years)' },
  { value: 'junior', label: 'Junior (1-3 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
] as const;

export const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'user_manager', label: 'User Manager' },
  { value: 'content_moderator', label: 'Content Moderator' },
  { value: 'analyst', label: 'Analyst' },
] as const;