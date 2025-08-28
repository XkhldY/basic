import React, { useState, useEffect } from 'react';
import { File, Download, Trash2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import FileUpload from './forms/FileUpload';
import { UploadService, ResumeInfo } from '@/services/upload';
import { User } from '@/types/auth';

interface ResumeUploadSectionProps {
  user: User | null;
  onResumeUpdate: () => void;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({ user, onResumeUpdate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing resume info on component mount
  useEffect(() => {
    if (user?.resume_url) {
      loadResumeInfo();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadResumeInfo = async () => {
    try {
      const info = await UploadService.getResumeInfo();
      setResumeInfo(info);
    } catch (error) {
      console.error('Failed to load resume info:', error);
      // If resume info can't be loaded, assume no resume exists
      setResumeInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file
    const validation = UploadService.validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file
      const result = await UploadService.uploadResume(selectedFile);
      
      // Complete progress
      setUploadProgress(100);
      clearInterval(progressInterval);

      // Update local state
      setResumeInfo({
        file_name: result.file_name,
        file_size: result.file_size,
        uploaded_at: result.uploaded_at,
        download_url: '' // Will be fetched when needed
      });

      // Clear selected file
      setSelectedFile(null);

      // Notify parent component
      onResumeUpdate();

      // Show success briefly
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);

    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.detail || error.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resumeInfo) return;

    if (!confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }

    try {
      await UploadService.deleteResume();
      setResumeInfo(null);
      onResumeUpdate();
    } catch (error: any) {
      console.error('Delete failed:', error);
      setError(error.response?.data?.detail || error.message || 'Delete failed. Please try again.');
    }
  };

  const handleDownload = async () => {
    if (!resumeInfo) return;

    try {
      await UploadService.downloadResume();
    } catch (error: any) {
      console.error('Download failed:', error);
      setError(error.response?.data?.detail || error.message || 'Download failed. Please try again.');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading resume information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Resume Display */}
      {resumeInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="text-lg font-medium text-green-900">Current Resume</h4>
                <div className="mt-2 space-y-1 text-sm text-green-700">
                  <p><strong>File:</strong> {resumeInfo.file_name}</p>
                  <p><strong>Size:</strong> {formatFileSize(resumeInfo.file_size)}</p>
                  <p><strong>Uploaded:</strong> {formatDate(resumeInfo.uploaded_at)}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-green-300 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {!resumeInfo && (
        <div className="text-center">
          <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Resume Uploaded</h4>
          <p className="text-gray-600 mb-6">
            Upload your resume to improve your profile completion and make it easier for employers to find you.
          </p>
        </div>
      )}

      {/* File Upload Component */}
      <FileUpload
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        selectedFile={selectedFile}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        error={error}
        acceptedFileTypes={['.pdf', '.doc', '.docx']}
        maxFileSize={10}
        className="max-w-2xl"
      />

      {/* Upload Button */}
      {selectedFile && !isUploading && uploadProgress === 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5 mr-2" />
            {resumeInfo ? 'Replace Resume' : 'Upload Resume'}
          </button>
        </div>
      )}

      {/* File Requirements */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">File Requirements</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Accepted formats: PDF, DOC, DOCX</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Ensure your resume is up-to-date and professional</p>
          <p>• File will be securely stored and accessible to employers</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};
