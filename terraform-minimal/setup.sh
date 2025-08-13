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
    python3-certbot-nginx

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

# Create application directory
mkdir -p /opt/job-platform
cd /opt/job-platform

# Clone the repository (assuming it's public or SSH key is configured)
# Note: In production, you might want to use a deployment key or download a specific release
git clone https://github.com/your-username/job-platform.git .

# Create environment file for production
cat > .env <<EOF
# Database Configuration
DB_HOST=${db_host}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DATABASE_URL=postgresql://${db_user}:${db_password}@${db_host}:5432/${db_name}

# Application Configuration
JWT_SECRET=${var.app_jwt_secret}
CORS_ORIGINS=http://localhost:3000,https://${domain_name}

# Email Configuration (configure these based on your SMTP provider)
EMAIL_SMTP_SERVER=${var.app_email_smtp_server}
EMAIL_SMTP_PORT=${var.app_email_smtp_port}
EMAIL_USERNAME=${var.app_email_username}
EMAIL_PASSWORD=${var.app_email_password}
FROM_EMAIL=${var.app_from_email}

# Production environment
ENVIRONMENT=production
DEBUG=false
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
    environment:
      - DATABASE_URL=postgresql://${db_user}:${db_password}@${db_host}:5432/${db_name}
      - JWT_SECRET=${var.app_jwt_secret}
      - ENVIRONMENT=production
      - DEBUG=false
    restart: unless-stopped
    depends_on:
      - frontend
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
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