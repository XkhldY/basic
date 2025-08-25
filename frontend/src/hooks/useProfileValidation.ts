import { useState, useCallback } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationRules {
  [key: string]: (value: any) => string | null;
}

export const useProfileValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const candidateValidationRules: ValidationRules = {
    name: (value: string) => {
      if (!value?.trim()) return 'Name is required';
      if (value.length < 2) return 'Name must be at least 2 characters';
      return null;
    },
    professional_title: (value: string) => {
      if (!value?.trim()) return 'Professional title is required';
      return null;
    },
    experience_level: (value: string) => {
      if (!value) return 'Experience level is required';
      return null;
    },
    phone_number: (value: string) => {
      if (value && !/^[\+]?[\d\s\-\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
    linkedin_url: (value: string) => {
      if (value && !value.includes('linkedin.com')) {
        return 'Please enter a valid LinkedIn URL';
      }
      return null;
    },
    github_url: (value: string) => {
      if (value && !value.includes('github.com')) {
        return 'Please enter a valid GitHub URL';
      }
      return null;
    },
    portfolio_url: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'Please enter a valid URL starting with http:// or https://';
      }
      return null;
    },
    current_salary: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        return 'Please enter a valid salary amount';
      }
      return null;
    },
    expected_salary: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0)) {
        return 'Please enter a valid salary amount';
      }
      return null;
    },
    years_of_experience: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 70)) {
        return 'Please enter a valid number of years (0-70)';
      }
      return null;
    },
    date_of_birth: (value: string) => {
      if (value) {
        const date = new Date(value);
        const minDate = new Date('1920-01-01');
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 13); // Minimum age 13
        
        if (isNaN(date.getTime())) {
          return 'Please enter a valid date';
        }
        if (date < minDate || date > maxDate) {
          return 'Please enter a valid birth date';
        }
      }
      return null;
    }
  };

  const employerValidationRules: ValidationRules = {
    company_name: (value: string) => {
      if (!value?.trim()) return 'Company name is required';
      return null;
    },
    industry: (value: string) => {
      if (!value?.trim()) return 'Industry is required';
      return null;
    },
    company_size: (value: string) => {
      if (!value) return 'Company size is required';
      return null;
    },
    contact_person: (value: string) => {
      if (!value?.trim()) return 'Contact person is required';
      return null;
    },
    contact_phone: (value: string) => {
      if (value && !/^[\+]?[\d\s\-\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
    company_website: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'Please enter a valid URL starting with http:// or https://';
      }
      return null;
    },
    founded_year: (value: string) => {
      const year = Number(value);
      const currentYear = new Date().getFullYear();
      if (value && (isNaN(year) || year < 1800 || year > currentYear)) {
        return `Please enter a valid year between 1800 and ${currentYear}`;
      }
      return null;
    },
    employee_count: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 1)) {
        return 'Please enter a valid number of employees';
      }
      return null;
    }
  };

  const validateField = useCallback((field: string, value: any, userType: 'candidate' | 'employer') => {
    const rules = userType === 'candidate' ? candidateValidationRules : employerValidationRules;
    const rule = rules[field];
    
    if (rule) {
      const error = rule(value);
      if (error) {
        setErrors(prev => {
          const filtered = prev.filter(e => e.field !== field);
          return [...filtered, { field, message: error }];
        });
        return error;
      } else {
        setErrors(prev => prev.filter(e => e.field !== field));
        return null;
      }
    }
    return null;
  }, []);

  const validateAllFields = useCallback((data: any, userType: 'candidate' | 'employer') => {
    const rules = userType === 'candidate' ? candidateValidationRules : employerValidationRules;
    const newErrors: ValidationError[] = [];

    Object.keys(rules).forEach(field => {
      const error = rules[field](data[field]);
      if (error) {
        newErrors.push({ field, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors.find(e => e.field === field)?.message || null;
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validateField,
    validateAllFields,
    getFieldError,
    clearErrors
  };
};