'use client';

import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ProfileCompletionProps {
  percentage: number;
  missingFields: string[];
  completedSections: string[];
  totalSections: number;
  className?: string;
}

export const ProfileCompletion = ({ 
  percentage, 
  missingFields, 
  completedSections, 
  totalSections,
  className = ""
}: ProfileCompletionProps) => {
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-600';
    if (percent >= 60) return 'bg-yellow-600';
    if (percent >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getProgressTextColor = (percent: number) => {
    if (percent >= 80) return 'text-green-700';
    if (percent >= 60) return 'text-yellow-700';
    if (percent >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  const getProgressBgColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-50 border-green-200';
    if (percent >= 60) return 'bg-yellow-50 border-yellow-200';
    if (percent >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className={`text-2xl font-bold ${getProgressTextColor(percentage)}`}>
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(percentage)}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-lg border ${getProgressBgColor(percentage)} mb-6`}>
          <div className="flex items-center">
            {percentage === 100 ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : percentage >= 60 ? (
              <Info className="h-5 w-5 text-yellow-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <div>
              <p className={`font-medium ${getProgressTextColor(percentage)}`}>
                {percentage === 100 
                  ? 'Profile Complete!' 
                  : percentage >= 60 
                    ? 'Good Progress' 
                    : 'Profile Needs Attention'
                }
              </p>
              <p className={`text-sm ${getProgressTextColor(percentage)} opacity-80`}>
                {percentage === 100 
                  ? 'Your profile is fully complete and ready for opportunities.'
                  : percentage >= 60 
                    ? 'You\'re making good progress. Complete a few more sections to improve your profile.'
                    : 'Complete more sections to make your profile stand out to employers.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Completed Sections */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Completed Sections</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {completedSections.map((section, index) => (
              <div key={index} className="flex items-center text-sm text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                {section}
              </div>
            ))}
          </div>
        </div>

        {/* Missing Fields */}
        {missingFields.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Complete these fields to improve your profile:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {missingFields.slice(0, 8).map((field, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
              {missingFields.length > 8 && (
                <div className="text-sm text-gray-500 col-span-2">
                  ...and {missingFields.length - 8} more fields
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Progress */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Sections completed: {completedSections.length}/{totalSections}</span>
            <span>{Math.round((completedSections.length / totalSections) * 100)}% sections complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};



