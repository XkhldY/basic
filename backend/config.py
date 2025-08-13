import os
from decouple import config
from typing import List, Optional

# Optional AWS Secrets Manager integration
try:
    from .utils.secrets_manager import db_credentials, app_secrets, secrets_manager
    AWS_SECRETS_AVAILABLE = secrets_manager.is_aws_available
except ImportError:
    AWS_SECRETS_AVAILABLE = False

class DatabaseConfig:
    """Database configuration settings"""
    
    def __init__(self):
        # Use AWS Secrets Manager if available, otherwise fallback to env vars
        if AWS_SECRETS_AVAILABLE:
            self.HOST = config('DB_HOST', default=db_credentials.host)
            self.PORT = config('DB_PORT', default=db_credentials.port, cast=int)
            self.NAME = config('DB_NAME', default=db_credentials.database)
            self.USER = config('DB_USER', default=db_credentials.username)
            self.PASSWORD = db_credentials.password  # Always from Secrets Manager when available
        else:
            self.HOST = config('DB_HOST', default='postgres')
            self.PORT = config('DB_PORT', default=5432, cast=int)
            self.NAME = config('DB_NAME', default='mydatabase')
            self.USER = config('DB_USER', default='user')
            self.PASSWORD = config('DB_PASSWORD', default='password')
    
    @property
    def DATABASE_URL(self) -> str:
        """Construct database URL from components"""
        if AWS_SECRETS_AVAILABLE:
            return config('DATABASE_URL', default=db_credentials.database_url)
        else:
            return config(
                'DATABASE_URL',
                default=f'postgresql://{self.USER}:{self.PASSWORD}@{self.HOST}:{self.PORT}/{self.NAME}'
            )

class SecurityConfig:
    """Security and authentication settings"""
    
    def __init__(self):
        # Use AWS Secrets Manager if available, otherwise fallback to env vars
        if AWS_SECRETS_AVAILABLE:
            self.JWT_SECRET = config('JWT_SECRET', default=app_secrets.jwt_secret)
            self.SECRET_KEY = config('SECRET_KEY', default=app_secrets.jwt_secret)  # Use JWT secret as fallback
        else:
            self.JWT_SECRET = config('JWT_SECRET', default='your-super-secret-jwt-key-change-this-in-production')
            self.SECRET_KEY = config('SECRET_KEY', default='your-secret-key-change-this-in-production')
        
        self.ALGORITHM = config('ALGORITHM', default='HS256')
        self.ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', default=30, cast=int)
        self.REFRESH_TOKEN_EXPIRE_DAYS = config('REFRESH_TOKEN_EXPIRE_DAYS', default=7, cast=int)

class EmailConfig:
    """Email configuration settings"""
    SMTP_SERVER: str = config('EMAIL_SMTP_SERVER', default='localhost')
    SMTP_PORT: int = config('EMAIL_SMTP_PORT', default=587, cast=int)
    USERNAME: str = config('EMAIL_USERNAME', default='')
    PASSWORD: str = config('EMAIL_PASSWORD', default='')
    FROM_EMAIL: str = config('FROM_EMAIL', default='noreply@jobplatform.local')
    USE_TLS: bool = config('EMAIL_USE_TLS', default=True, cast=bool)
    USE_SSL: bool = config('EMAIL_USE_SSL', default=False, cast=bool)
    
    @property
    def is_configured(self) -> bool:
        """Check if email is properly configured"""
        return bool(self.USERNAME and self.PASSWORD and self.SMTP_SERVER != 'localhost')

class AWSConfig:
    """AWS configuration settings"""
    REGION: str = config('AWS_REGION', default='us-east-1')
    SECRET_NAME: str = config('AWS_SECRET_NAME', default='job-platform/database')
    ACCESS_KEY_ID: Optional[str] = config('AWS_ACCESS_KEY_ID', default=None)
    SECRET_ACCESS_KEY: Optional[str] = config('AWS_SECRET_ACCESS_KEY', default=None)
    
    @property
    def is_configured(self) -> bool:
        """Check if running in AWS environment"""
        # Check for EC2 instance metadata or IAM roles
        return (
            os.path.exists('/opt/aws/bin/ec2-metadata') or  # EC2 instance
            bool(self.ACCESS_KEY_ID and self.SECRET_ACCESS_KEY) or  # Explicit credentials
            os.environ.get('AWS_EXECUTION_ENV') is not None  # Lambda/ECS
        )

class Settings:
    """Main application settings"""
    
    # Environment
    ENVIRONMENT: str = config('ENVIRONMENT', default='development')
    DEBUG: bool = config('DEBUG', default=True, cast=bool)
    
    # Application
    APP_NAME: str = config('APP_NAME', default='Job Platform')
    APP_VERSION: str = config('APP_VERSION', default='1.0.0')
    
    # CORS
    CORS_ORIGINS: List[str] = config(
        'CORS_ORIGINS',
        default='http://localhost:3000,http://127.0.0.1:3000',
        cast=lambda v: [s.strip() for s in v.split(',')]
    )
    
    # Logging
    LOG_LEVEL: str = config('LOG_LEVEL', default='INFO')
    LOG_FORMAT: str = config('LOG_FORMAT', default='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Configuration sections
    database = DatabaseConfig()
    security = SecurityConfig()
    email = EmailConfig()
    aws = AWSConfig()
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.ENVIRONMENT.lower() in ('production', 'prod')
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.ENVIRONMENT.lower() in ('development', 'dev', 'local')
    
    # Backward compatibility properties
    @property
    def DATABASE_URL(self) -> str:
        return self.database.DATABASE_URL
    
    @property
    def SECRET_KEY(self) -> str:
        return self.security.SECRET_KEY
    
    @property
    def ALGORITHM(self) -> str:
        return self.security.ALGORITHM
    
    @property
    def ACCESS_TOKEN_EXPIRE_MINUTES(self) -> int:
        return self.security.ACCESS_TOKEN_EXPIRE_MINUTES
    
    @property
    def REFRESH_TOKEN_EXPIRE_DAYS(self) -> int:
        return self.security.REFRESH_TOKEN_EXPIRE_DAYS

settings = Settings()