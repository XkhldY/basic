#!/bin/bash
# EC2 setup script for job platform deployment
# This script installs Docker, clones the repository, and sets up the application

set -e

# Update system
apt-get update
apt-get upgrade -y

# Install required packages
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    awscli \
    jq \
    unzip

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Helper function to retrieve secret from AWS Secrets Manager
get_secret_value() {
    local secret_arn="$1"
    local key="$2"
    aws secretsmanager get-secret-value \
        --region "${aws_region}" \
        --secret-id "$secret_arn" \
        --query SecretString \
        --output text | jq -r ".$key"
}

# Helper function to get entire secret as JSON
get_secret_json() {
    local secret_arn="$1"
    aws secretsmanager get-secret-value \
        --region "${aws_region}" \
        --secret-id "$secret_arn" \
        --query SecretString \
        --output text
}

# Wait for secrets to be available
echo "Waiting for secrets to be available..."
sleep 30

# Retrieve database credentials from Secrets Manager
echo "Retrieving database credentials..."
DB_SECRET_JSON=$(get_secret_json "${db_secret_arn}")
DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r '.password')

# Retrieve application secrets
echo "Retrieving application secrets..."
APP_SECRET_JSON=$(get_secret_json "${app_secret_arn}")
JWT_SECRET=$(echo "$APP_SECRET_JSON" | jq -r '.jwt_secret')
EMAIL_USERNAME=$(echo "$APP_SECRET_JSON" | jq -r '.email_username // ""')
EMAIL_PASSWORD=$(echo "$APP_SECRET_JSON" | jq -r '.email_password // ""')
CORS_ORIGINS=$(echo "$APP_SECRET_JSON" | jq -r '.cors_origins')
FROM_EMAIL=$(echo "$APP_SECRET_JSON" | jq -r '.from_email')

# Create application directory
mkdir -p /opt/job-platform
cd /opt/job-platform

# Clone the repository (assuming it's public or SSH key is configured)
# Note: In production, you might want to use a deployment key or download a specific release
# For now, we'll create the application structure
echo "Setting up application structure..."

# Create environment file for production with retrieved secrets
cat > .env <<EOF
# Database Configuration (retrieved from AWS Secrets Manager)
DB_HOST=${db_host}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://${db_user}:$DB_PASSWORD@${db_host}:5432/${db_name}

# Application Configuration (retrieved from AWS Secrets Manager)
JWT_SECRET=$JWT_SECRET
SECRET_KEY=$JWT_SECRET
CORS_ORIGINS=$CORS_ORIGINS

# Email Configuration (retrieved from AWS Secrets Manager)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USERNAME=$EMAIL_USERNAME
EMAIL_PASSWORD=$EMAIL_PASSWORD
FROM_EMAIL=$FROM_EMAIL
EMAIL_USE_TLS=true
EMAIL_USE_SSL=false

# AWS Configuration
AWS_REGION=${aws_region}
AWS_SECRET_NAME=${project_name}/database

# Production environment
ENVIRONMENT=production
DEBUG=false
APP_NAME=Job Platform
APP_VERSION=1.0.0

# Token Configuration
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# Logging Configuration
LOG_LEVEL=INFO
EOF

# Create production docker-compose file
cat > docker-compose.prod.yml <<EOF
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - frontend
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=/api
    restart: unless-stopped
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  app-network:
    driver: bridge

# Note: PostgreSQL is external (AWS RDS) in production
EOF

# Set up Nginx configuration
cat > /etc/nginx/sites-available/job-platform <<EOF
server {
    listen 80;
    server_name ${domain_name != "" ? domain_name : "_"};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

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
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
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

# Test Nginx configuration
nginx -t

# Start services
systemctl enable nginx
systemctl start nginx

# Set ownership
chown -R ubuntu:ubuntu /opt/job-platform

# Create systemd service for the application
cat > /etc/systemd/system/job-platform.service <<EOF
[Unit]
Description=Job Platform Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/job-platform
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
systemctl daemon-reload
systemctl enable job-platform.service

# Wait for Docker to be ready
sleep 10

# Start the application
systemctl start job-platform.service

# Create log rotation for Docker containers
cat > /etc/logrotate.d/docker-containers <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Setup firewall (UFW)
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'

# Create deployment info file
cat > /opt/job-platform/deployment-info.txt <<EOF
Job Platform Deployment Information
===================================

Deployment Date: $(date)
Server IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
Domain: ${domain_name != "" ? domain_name : "Not configured"}

Database:
- Host: ${db_host}
- Database: ${db_name}
- User: ${db_user}

Application URLs:
- HTTP: http://${domain_name != "" ? domain_name : "$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"}
- HTTPS: https://${domain_name != "" ? domain_name : "Configure SSL after domain setup"}

Management Commands:
- View application logs: sudo docker-compose -f docker-compose.prod.yml logs -f
- Restart application: sudo systemctl restart job-platform
- Check application status: sudo systemctl status job-platform
- Update application: cd /opt/job-platform && git pull && sudo systemctl restart job-platform

SSL Setup (run after domain is configured):
- sudo certbot --nginx -d ${domain_name != "" ? domain_name : "your-domain.com"}

Next Steps:
1. Point your domain to this server's IP address
2. Run SSL certificate setup
3. Update CORS_ORIGINS in .env file if needed
4. Test the application functionality
EOF

echo "Setup completed successfully!"
echo "Check /opt/job-platform/deployment-info.txt for important information"