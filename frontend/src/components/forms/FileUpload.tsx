'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isUploading,
  uploadProgress,
  error,
  acceptedFileTypes = ['.pdf', '.doc', '.docx'],
  maxFileSize = 10,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileValidation(files[0]);
    }
  }, []);

  const handleFileValidation = useCallback((file: File) => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      onFileSelect(file); // Let parent handle validation error
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      onFileSelect(file); // Let parent handle validation error
      return;
    }

    onFileSelect(file);
  }, [acceptedFileTypes, maxFileSize, onFileSelect]);

  const handleRemoveFile = useCallback(() => {
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileRemove]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📎';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Area */}
      {!selectedFile && (
        <div
          className={`upload-area relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'drag-over border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag and drop, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  disabled={isUploading}
                >
                  browse files
                </button>
              </p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Accepted formats: {acceptedFileTypes.join(', ')}</p>
              <p>Maximum size: {maxFileSize}MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Status */}
          {!isUploading && uploadProgress === 100 && (
            <div className="mt-4 flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Upload complete!</span>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && uploadProgress === 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Replace File
        </button>
      )}
    </div>
  );
};

export default FileUpload;
