'use client';

import { AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string | null;
  required?: boolean;
  className?: string;
}

export const FormField = ({ 
  label, 
  children, 
  error, 
  required = false, 
  className = "" 
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};