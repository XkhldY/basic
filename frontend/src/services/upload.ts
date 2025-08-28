import { apiClient } from '@/lib/api';

export interface ResumeInfo {
  file_name: string;
  file_size: number;
  uploaded_at: string;
  download_url: string;
}

export interface UploadResponse {
  message: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

export class UploadService {
  /**
   * Upload a resume file
   */
  static async uploadResume(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/uploads/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Get current resume information
   */
  static async getResumeInfo(): Promise<ResumeInfo> {
    const response = await apiClient.get('/api/uploads/resume');
    return response.data;
  }

  /**
   * Delete current resume
   */
  static async deleteResume(): Promise<{ message: string }> {
    const response = await apiClient.delete('/api/uploads/resume');
    return response.data;
  }

  /**
   * Download resume file
   */
  static async downloadResume(): Promise<void> {
    try {
      const resumeInfo = await this.getResumeInfo();
      
      // Handle different types of download URLs
      if (resumeInfo.download_url.startsWith('http')) {
        // S3 pre-signed URL - direct download
        const link = document.createElement('a');
        link.href = resumeInfo.download_url;
        link.download = resumeInfo.file_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Local URL - fetch and download
        const response = await fetch(resumeInfo.download_url);
        if (!response.ok) {
          throw new Error('Failed to fetch file');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = resumeInfo.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download resume:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const maxSizeMB = 10;

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`
      };
    }

    return { isValid: true };
  }
}

