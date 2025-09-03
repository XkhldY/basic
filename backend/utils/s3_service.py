import boto3
import os
from botocore.exceptions import ClientError, NoCredentialsError
from typing import Optional, Dict, Any
import logging
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

class S3Service:
    """S3 service for file uploads and management with local fallback"""
    
    def __init__(self):
        self.s3_client = None
        self.bucket_name = os.getenv('S3_BUCKET_NAME', 'job-platform-files-dev-bc30da7b')
        self.region = os.getenv('AWS_REGION', 'us-east-1')
        self.local_upload_dir = os.getenv('LOCAL_UPLOAD_DIR', '/code/local_uploads')
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize S3 client"""
        try:
            self.s3_client = boto3.client('s3', region_name=self.region)
            # Test the connection
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            logger.info(f"S3 client initialized successfully for bucket: {self.bucket_name}")
        except (ClientError, NoCredentialsError) as e:
            logger.warning(f"Failed to initialize S3 client with IAM role/creds: {e}")
            self.s3_client = None

    @property
    def is_available(self) -> bool:
        return self.s3_client is not None
    
    def upload_file(self, file_data: bytes, file_name: str, content_type: str, user_id: int) -> Optional[Dict[str, Any]]:
        """Upload a file to S3"""
        try:
            file_extension = os.path.splitext(file_name)[1]
            unique_filename = f"resumes/{user_id}/{uuid.uuid4()}{file_extension}"

            # Check if S3 client is available
            if self.s3_client is None:
                logger.error("S3 client is not available")
                return None

            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=file_data,
                ContentType=content_type,
                Metadata={
                    'original_filename': file_name,
                    'user_id': str(user_id),
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            )
            download_url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': unique_filename},
                ExpiresIn=3600
            )
            file_key = unique_filename
            
            return {
                'file_key': file_key,
                'file_name': file_name,
                'file_size': len(file_data),
                'content_type': content_type,
                'download_url': download_url,
                'uploaded_at': datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Failed to upload file {file_name}: {e}")
            return None
    
    def delete_file(self, file_key: str) -> bool:
        """Delete a file from S3"""
        try:
            if self.s3_client is None:
                logger.error("S3 client is not available")
                return False
                
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_key)
            logger.info(f"S3 file deleted: {file_key}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete file {file_key}: {e}")
            return False
    
    def get_file_info(self, file_key: str) -> Optional[Dict[str, Any]]:
        try:
            if self.s3_client is None:
                logger.error("S3 client is not available")
                return None
                
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=file_key)
            return {
                'file_key': file_key,
                'file_size': response['ContentLength'],
                'content_type': response.get('ContentType', ''),
                'last_modified': response['LastModified'],
                'metadata': response.get('Metadata', {})
            }
        except Exception as e:
            logger.error(f"Failed to get file info for {file_key}: {e}")
            return None
    
    def generate_download_url(self, file_key: str, expires_in: int = 3600) -> Optional[str]:
        try:
            return self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_key},
                ExpiresIn=expires_in
            )
        except Exception as e:
            logger.error(f"Failed to generate download URL for {file_key}: {e}")
            return None

# Global instance
s3_service = S3Service()

