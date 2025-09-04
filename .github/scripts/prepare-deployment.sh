#!/bin/bash
set -e

EC2_IP="$1"
DB_SECRET_ARN="$2"
RDS_ENDPOINT="$3"

echo "Deploying application to $EC2_IP..."

# Update frontend config for production
echo "Updating frontend config for production..."

# Backup original config
cp frontend/public/config.js frontend/public/config.js.backup

# Create production config
cat > frontend/public/config.js << 'CONFIG_EOF'
// Production configuration - automatically generated during deployment
window.APP_CONFIG = {
  API_URL: 'https://api.pom100.com',
  ENVIRONMENT: 'production'
};
CONFIG_EOF

# Create production environment file for backend
echo "Creating production environment file..."
cat > .env << 'ENV_EOF'
# Production environment variables - automatically generated during deployment
# Database credentials are retrieved from AWS Secrets Manager on the EC2 instance
DB_HOST=$RDS_ENDPOINT
DB_PORT=5432
DB_NAME=jobplatform  
DB_SECRET_ARN=$DB_SECRET_ARN
ENVIRONMENT=production
DEBUG=false
NEXT_PUBLIC_API_URL=https://api.pom100.com
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000,http://pom100.com,http://www.pom100.com,https://pom100.com,https://www.pom100.com
ENV_EOF

# Create deployment package
echo "Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='frontend/test-results' --exclude='frontend/tests' --exclude='__pycache__' --exclude='.env.local' \
    -czf deploy.tar.gz frontend/ backend/ docker-compose.prod.yml .env

# Restore original config and clean up temporary files
mv frontend/public/config.js.backup frontend/public/config.js
rm -f .env

echo "✅ Deployment package created successfully"
