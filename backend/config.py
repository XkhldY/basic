from decouple import config

class Settings:
    DATABASE_URL: str = config('DATABASE_URL', default='postgresql://user:password@postgres:5432/mydatabase')
    SECRET_KEY: str = config('SECRET_KEY', default='your-secret-key-change-this-in-production')
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config('ACCESS_TOKEN_EXPIRE_MINUTES', default=30, cast=int)
    REFRESH_TOKEN_EXPIRE_DAYS: int = config('REFRESH_TOKEN_EXPIRE_DAYS', default=7, cast=int)

settings = Settings()