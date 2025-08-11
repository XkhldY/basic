export type UserType = 'candidate' | 'employer';

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

export type FormData = EmployerFormData | CandidateFormData;

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