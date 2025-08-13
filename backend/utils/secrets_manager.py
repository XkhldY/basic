"""
AWS Secrets Manager utility for retrieving database credentials and application secrets.
This module provides functions to safely retrieve secrets from AWS Secrets Manager
in production environments while falling back to environment variables in development.
"""

import json
import os
import boto3
from typing import Optional, Dict, Any
from botocore.exceptions import ClientError, NoCredentialsError
import logging

logger = logging.getLogger(__name__)

class SecretsManager:
    """AWS Secrets Manager client wrapper"""
    
    def __init__(self, region_name: str = None):
        self.region_name = region_name or os.getenv('AWS_REGION', 'us-east-1')
        self._client = None
        self._is_aws_available = None
    
    @property
    def client(self):
        """Lazy initialization of boto3 client"""
        if self._client is None:
            try:
                self._client = boto3.client('secretsmanager', region_name=self.region_name)
            except Exception as e:
                logger.warning(f"Failed to initialize AWS Secrets Manager client: {e}")
                raise
        return self._client
    
    @property
    def is_aws_available(self) -> bool:
        """Check if AWS credentials and services are available"""
        if self._is_aws_available is None:
            try:
                # Test AWS credentials by calling STS get-caller-identity
                sts = boto3.client('sts', region_name=self.region_name)
                sts.get_caller_identity()
                self._is_aws_available = True
            except (NoCredentialsError, ClientError, Exception) as e:
                logger.info(f"AWS not available, falling back to environment variables: {e}")
                self._is_aws_available = False
        return self._is_aws_available
    
    def get_secret(self, secret_arn: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve secret from AWS Secrets Manager
        
        Args:
            secret_arn: ARN of the secret to retrieve
            
        Returns:
            Dictionary containing the secret values, or None if not available
        """
        if not self.is_aws_available:
            return None
            
        try:
            response = self.client.get_secret_value(SecretId=secret_arn)
            return json.loads(response['SecretString'])
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'ResourceNotFoundException':
                logger.error(f"Secret not found: {secret_arn}")
            elif error_code == 'InvalidRequestException':
                logger.error(f"Invalid request for secret: {secret_arn}")
            elif error_code == 'InvalidParameterException':
                logger.error(f"Invalid parameter for secret: {secret_arn}")
            elif error_code == 'DecryptionFailureException':
                logger.error(f"Decryption failed for secret: {secret_arn}")
            else:
                logger.error(f"Error retrieving secret {secret_arn}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error retrieving secret {secret_arn}: {e}")
            return None

class DatabaseCredentials:
    """Database credentials with fallback to environment variables"""
    
    def __init__(self, secrets_manager: SecretsManager, secret_arn: str = None):
        self.secrets_manager = secrets_manager
        self.secret_arn = secret_arn or os.getenv('AWS_DB_SECRET_ARN')
        self._credentials = None
    
    def _load_credentials(self) -> Dict[str, str]:
        """Load credentials from Secrets Manager or environment variables"""
        if self._credentials is not None:
            return self._credentials
        
        # Try to load from Secrets Manager first
        if self.secret_arn and self.secrets_manager.is_aws_available:
            secret_data = self.secrets_manager.get_secret(self.secret_arn)
            if secret_data:
                self._credentials = {
                    'host': os.getenv('DB_HOST', secret_data.get('host')),
                    'port': int(os.getenv('DB_PORT', secret_data.get('port', 5432))),
                    'database': os.getenv('DB_NAME', secret_data.get('dbname')),
                    'username': os.getenv('DB_USER', secret_data.get('username')),
                    'password': secret_data.get('password')
                }
                logger.info("Database credentials loaded from AWS Secrets Manager")
                return self._credentials
        
        # Fallback to environment variables
        self._credentials = {
            'host': os.getenv('DB_HOST', 'postgres'),
            'port': int(os.getenv('DB_PORT', '5432')),
            'database': os.getenv('DB_NAME', 'mydatabase'),
            'username': os.getenv('DB_USER', 'user'),
            'password': os.getenv('DB_PASSWORD', 'password')
        }
        logger.info("Database credentials loaded from environment variables")
        return self._credentials
    
    @property
    def host(self) -> str:
        return self._load_credentials()['host']
    
    @property
    def port(self) -> int:
        return self._load_credentials()['port']
    
    @property
    def database(self) -> str:
        return self._load_credentials()['database']
    
    @property
    def username(self) -> str:
        return self._load_credentials()['username']
    
    @property
    def password(self) -> str:
        return self._load_credentials()['password']
    
    @property
    def database_url(self) -> str:
        """Construct PostgreSQL connection URL"""
        creds = self._load_credentials()
        return f"postgresql://{creds['username']}:{creds['password']}@{creds['host']}:{creds['port']}/{creds['database']}"

class ApplicationSecrets:
    """Application secrets with fallback to environment variables"""
    
    def __init__(self, secrets_manager: SecretsManager, secret_arn: str = None):
        self.secrets_manager = secrets_manager
        self.secret_arn = secret_arn or os.getenv('AWS_APP_SECRET_ARN')
        self._secrets = None
    
    def _load_secrets(self) -> Dict[str, str]:
        """Load secrets from Secrets Manager or environment variables"""
        if self._secrets is not None:
            return self._secrets
        
        # Try to load from Secrets Manager first
        if self.secret_arn and self.secrets_manager.is_aws_available:
            secret_data = self.secrets_manager.get_secret(self.secret_arn)
            if secret_data:
                self._secrets = {
                    'jwt_secret': secret_data.get('jwt_secret', os.getenv('JWT_SECRET')),
                    'email_username': secret_data.get('email_username', os.getenv('EMAIL_USERNAME', '')),
                    'email_password': secret_data.get('email_password', os.getenv('EMAIL_PASSWORD', '')),
                    'cors_origins': secret_data.get('cors_origins', os.getenv('CORS_ORIGINS', 'http://localhost:3000')),
                    'from_email': secret_data.get('from_email', os.getenv('FROM_EMAIL', 'noreply@jobplatform.com'))
                }
                logger.info("Application secrets loaded from AWS Secrets Manager")
                return self._secrets
        
        # Fallback to environment variables
        self._secrets = {
            'jwt_secret': os.getenv('JWT_SECRET', 'dev-jwt-secret'),
            'email_username': os.getenv('EMAIL_USERNAME', ''),
            'email_password': os.getenv('EMAIL_PASSWORD', ''),
            'cors_origins': os.getenv('CORS_ORIGINS', 'http://localhost:3000'),
            'from_email': os.getenv('FROM_EMAIL', 'noreply@jobplatform.local')
        }
        logger.info("Application secrets loaded from environment variables")
        return self._secrets
    
    @property
    def jwt_secret(self) -> str:
        return self._load_secrets()['jwt_secret']
    
    @property
    def email_username(self) -> str:
        return self._load_secrets()['email_username']
    
    @property
    def email_password(self) -> str:
        return self._load_secrets()['email_password']
    
    @property
    def cors_origins(self) -> str:
        return self._load_secrets()['cors_origins']
    
    @property
    def from_email(self) -> str:
        return self._load_secrets()['from_email']

# Global instances for easy import
secrets_manager = SecretsManager()
db_credentials = DatabaseCredentials(secrets_manager)
app_secrets = ApplicationSecrets(secrets_manager)

def get_database_url() -> str:
    """Get database URL with automatic fallback"""
    return db_credentials.database_url

def get_jwt_secret() -> str:
    """Get JWT secret with automatic fallback"""
    return app_secrets.jwt_secret