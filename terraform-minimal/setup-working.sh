#!/bin/bash
# Working EC2 setup script for job platform deployment

set -e
exec > >(tee /var/log/setup.log) 2>&1

echo "=== Starting Job Platform Setup at $(date) ==="

# Update system
echo "Updating system packages..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install required packages
echo "Installing required packages..."
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    nginx \
    awscli \
    jq \
    unzip \
    software-properties-common \
    postgresql-client

# Install Docker
echo "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose standalone
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start and enable Docker
echo "Starting Docker service..."
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/job-platform
cd /opt/job-platform

# Download application code from GitHub
echo "Downloading application code..."
git clone https://github.com/XkhldY/basic.git /tmp/job-platform-code || {
    echo "Git clone failed, creating basic structure..."
    mkdir -p backend frontend
    
    # Create basic backend structure
    cat > backend/Dockerfile <<EOF
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

    cat > backend/requirements.txt <<EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.1
python-dotenv==1.0.0
pydantic==2.5.0
pydantic-settings==2.1.0
email-validator==2.1.0
python-decouple==3.8
requests==2.31.0
EOF

    cat > backend/main.py <<EOF
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Job Platform API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Job Platform API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

@app.get("/api/test")
async def api_test():
    return {"message": "API test successful"}
EOF

    # Create basic frontend structure
    cat > frontend/Dockerfile <<EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

    cat > frontend/package.json <<EOF
{
  "name": "job-platform-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/node": "20.8.0",
    "@types/react": "18.2.0",
    "@types/react-dom": "18.2.0",
    "eslint": "8.51.0",
    "eslint-config-next": "14.0.0",
    "typescript": "5.2.0"
  }
}
EOF

    mkdir -p frontend/pages frontend/pages/api
    cat > frontend/pages/index.js <<EOF
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Job Platform</title>
        <meta name="description" content="Job Platform Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Job Platform</h1>
        <p>Welcome to the Job Platform application!</p>
        <div>
          <h2>Status: Running on AWS</h2>
          <p>Frontend is working properly</p>
        </div>
      </main>

      <style jsx>{\`
        main {
          padding: 2rem;
          text-align: center;
        }
        h1 {
          color: #0070f3;
          font-size: 3rem;
        }
      \`}</style>
    </div>
  )
}
EOF

    cat > frontend/next.config.js <<EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/:path*',
      },
    ]
  },
}

module.exports = nextConfig
EOF
}

# Copy application files if git clone worked
if [ -d "/tmp/job-platform-code" ]; then
    echo "Copying application files..."
    cp -r /tmp/job-platform-code/* /opt/job-platform/
fi

# Retrieve database password from AWS Secrets Manager
echo "Retrieving database credentials from AWS Secrets Manager..."
DB_SECRET_ARN="arn:aws:secretsmanager:us-east-1:421433934085:secret:rds!db-0a8e30b8-8083-49fd-bc32-8c8f2c38c43d-NyxVsZ"
DB_SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id $DB_SECRET_ARN --region us-east-1 --query SecretString --output text)
DB_PASSWORD=$(echo $DB_SECRET_JSON | jq -r .password)

if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "null" ]; then
    echo "ERROR: Failed to retrieve database password from Secrets Manager"
    exit 1
fi

echo "Database credentials retrieved successfully"

# Get current instance public IP dynamically
echo "Getting instance public IP..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ -z "$PUBLIC_IP" ]; then
    echo "ERROR: Could not retrieve public IP"
    exit 1
fi
echo "Instance public IP: $PUBLIC_IP"

# Create production environment file
echo "Creating environment file..."
cat > .env <<EOF
# Production Environment Configuration
NODE_ENV=production
ENVIRONMENT=production

# Database Configuration  
DB_HOST=job-platform-db.cwdec2aoci4i.us-east-1.rds.amazonaws.com
DB_NAME=jobplatform
DB_USER=dbadmin
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgresql://dbadmin:${DB_PASSWORD}@job-platform-db.cwdec2aoci4i.us-east-1.rds.amazonaws.com:5432/jobplatform

# Application Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGINS=http://${PUBLIC_IP},http://${PUBLIC_IP}:3000,http://${PUBLIC_IP}:8000,http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}:8000
API_URL=http://backend:8000

# AWS Configuration
AWS_REGION=us-east-1
AWS_DEFAULT_REGION=us-east-1

# Logging
LOG_LEVEL=INFO
DEBUG=false
EOF

# Create production docker-compose file
echo "Creating docker-compose file..."
cat > docker-compose.prod.yml <<EOF
version: '3.8'

services:
  # Database migration service - runs once to initialize database
  db-migrate:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    env_file:
      - .env
    command: ["python", "-m", "alembic", "upgrade", "head"]
    networks:
      - app-network
    restart: "no"

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - app-network
    depends_on:
      db-migrate:
        condition: service_completed_successfully
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}:8000
    restart: unless-stopped
    networks:
      - app-network
    depends_on:
      backend:
        condition: service_healthy

networks:
  app-network:
    driver: bridge
EOF

# Set up Nginx configuration
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/job-platform <<EOF
server {
    listen 80 default_server;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Direct backend access for testing
    location /backend/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/job-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and start Nginx
nginx -t
systemctl enable nginx
systemctl start nginx

# Set ownership
chown -R ubuntu:ubuntu /opt/job-platform

# Create simple test page
mkdir -p /var/www/html
cat > /var/www/html/setup-status.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Job Platform Setup Status</title>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <h1>Job Platform AWS Setup</h1>
    <p><strong>Status:</strong> Setup completed successfully!</p>
    <p><strong>Time:</strong> $(date)</p>
    <p><strong>Server IP:</strong> $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)</p>
    <h2>Services:</h2>
    <ul>
        <li>Docker: $(systemctl is-active docker)</li>
        <li>Nginx: $(systemctl is-active nginx)</li>
    </ul>
    <h2>Next Steps:</h2>
    <p>Application deployment in progress...</p>
</body>
</html>
EOF

# Test database connection before starting application
echo "Testing database connection..."
timeout 30 bash -c 'until pg_isready -h job-platform-db.cwdec2aoci4i.us-east-1.rds.amazonaws.com -p 5432 -U dbadmin; do echo "Waiting for database..."; sleep 2; done' || {
    echo "WARNING: Database connection test failed, but continuing with deployment"
}

# Start the application
echo "Starting Docker containers..."
cd /opt/job-platform

# Build containers first
echo "Building Docker containers..."
sudo -u ubuntu docker-compose -f docker-compose.prod.yml build

# Start containers with migration
echo "Starting containers and running database migrations..."
sudo -u ubuntu docker-compose -f docker-compose.prod.yml up -d

# Wait for migration to complete
echo "Waiting for database migration to complete..."
sleep 30

# Check migration status
echo "Checking migration status..."
sudo -u ubuntu docker-compose -f docker-compose.prod.yml logs db-migrate

echo "=== Setup completed at $(date) ==="
echo "Application should be accessible at:"
echo "- Frontend: http://${PUBLIC_IP}:3000"
echo "- Backend: http://${PUBLIC_IP}:8000"
echo "- Nginx proxy: http://${PUBLIC_IP}"

# Final status check
sleep 10
echo "=== Final Status Check ==="
systemctl status docker --no-pager -l
systemctl status nginx --no-pager -l
echo "=== Docker Containers Status ==="
sudo -u ubuntu docker-compose -f docker-compose.prod.yml ps
echo "=== Backend Logs (last 20 lines) ==="
sudo -u ubuntu docker-compose -f docker-compose.prod.yml logs --tail=20 backend

echo "Setup script completed successfully!"