#!/bin/bash

set -e

echo "🚀 Complete AWS Deployment for Job Platform"
echo "==========================================="
echo ""
echo "This script detects if server setup is needed and runs the appropriate deployment."
echo ""

# Configuration
SSH_KEY="terraform-compute/job-platform-key"
EC2_IP=""
RDS_ENDPOINT=""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check required tools
    command -v terraform >/dev/null 2>&1 || { print_error "terraform is required"; exit 1; }
    command -v docker >/dev/null 2>&1 || { print_error "docker is required"; exit 1; }
    command -v jq >/dev/null 2>&1 || { print_error "jq is required"; exit 1; }
    
    # Check if terraform directories exist
    if [ ! -d "terraform-compute" ]; then
        print_error "terraform-compute directory not found"
        exit 1
    fi
    
    if [ ! -d "terraform-persistent" ]; then
        print_error "terraform-persistent directory not found"
        exit 1
    fi
    
    print_status "✅ Prerequisites check passed"
}

# Get infrastructure info from terraform
get_infrastructure_info() {
    print_status "Getting infrastructure info from terraform..."
    
    # Get EC2 IP from compute terraform
    cd terraform-compute
    
    # Initialize terraform if needed
    if [ ! -d ".terraform" ]; then
        terraform init
    fi
    
    # Get EC2 IP
    EC2_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "")
    
    if [ -z "$EC2_IP" ]; then
        print_error "Could not get EC2 IP. Run 'terraform apply' in terraform-compute first."
        exit 1
    fi
    
    print_status "✅ EC2 IP: $EC2_IP"
    cd ..
    
    # Get database secret ARN from persistent terraform
    cd terraform-persistent
    
    # Initialize terraform if needed
    if [ ! -d ".terraform" ]; then
        terraform init
    fi
    
    # Get database secret ARN and RDS endpoint
    DB_SECRET_ARN=$(terraform output -raw database_secret_arn 2>/dev/null || echo "")
    RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null || echo "")
    
    if [ -z "$DB_SECRET_ARN" ]; then
        print_error "Could not get database secret ARN. Run 'terraform apply' in terraform-persistent first."
        exit 1
    fi
    
    if [ -z "$RDS_ENDPOINT" ]; then
        print_error "Could not get RDS endpoint. Run 'terraform apply' in terraform-persistent first."
        exit 1
    fi
    
    print_status "✅ Database secret ARN: $DB_SECRET_ARN"
    print_status "✅ RDS endpoint: $RDS_ENDPOINT"
    cd ..
}

# Wait for SSH
wait_for_ssh() {
    print_status "Waiting for SSH connection..."
    
    # Set SSH key permissions
    chmod 600 "$SSH_KEY"
    
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ubuntu@$EC2_IP 'echo "SSH ready"' &>/dev/null; then
            print_status "✅ SSH connection established"
            return 0
        fi
        
        attempts=$((attempts + 1))
        print_status "Attempt $attempts/$max_attempts, waiting 10 seconds..."
        sleep 10
    done
    
    print_error "❌ SSH connection failed after $max_attempts attempts"
    exit 1
}

# Deploy application
deploy_app() {
    print_status "Deploying application to $EC2_IP..."
    
    # Update frontend config for production
    print_status "Updating frontend config for production..."
    
    # Backup original config
    cp frontend/public/config.js frontend/public/config.js.backup
    
    # Create production config
    cat > frontend/public/config.js << EOF
// Production configuration - automatically generated during deployment
window.APP_CONFIG = {
  API_URL: 'https://api.pom100.com',
  ENVIRONMENT: 'production'
};
EOF
    
    # Create production environment file for backend
    print_status "Creating production environment file..."
    cat > .env << EOF
# Production environment variables - automatically generated during deployment
# Database credentials are retrieved from AWS Secrets Manager on the EC2 instance
DB_HOST=$RDS_ENDPOINT
DB_PORT=5432
DB_NAME=jobplatform  
DB_SECRET_ARN=$DB_SECRET_ARN
ENVIRONMENT=production
DEBUG=false
NEXT_PUBLIC_API_URL=https://api.pom100.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000,http://pom100.com,http://www.pom100.com,https://pom100.com,https://www.pom100.com
EOF
    
    # Fix backend CORS configuration for production
    print_status "Fixing backend CORS configuration..."
    cp backend/config.py backend/config.py.backup
    sed -i 's|default='\''http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000'\''|default='\''http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000,https://pom100.com,https://www.pom100.com'\''|' backend/config.py
    
    # Create deployment package
    print_status "Creating deployment package..."
    tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='frontend/test-results' --exclude='frontend/tests' --exclude='__pycache__' --exclude='.env.local' \
        -czf deploy.tar.gz frontend/ backend/ docker-compose.prod.yml .env
    
    # Restore original config and clean up temporary files
    mv frontend/public/config.js.backup frontend/public/config.js
    mv backend/config.py.backup backend/config.py
    rm -f .env
    
    # Upload to EC2
    print_status "Uploading to EC2..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no deploy.tar.gz ubuntu@$EC2_IP:/tmp/
    
    # Deploy on EC2
    print_status "Running deployment on EC2..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << EOF
set -e

# echo "📦 Installing dependencies..."
# sudo apt-get update -y

# # Clean up any conflicting Docker packages
# echo "🧹 Removing conflicting Docker packages..."
# sudo apt-get remove -y docker docker-engine docker.io containerd runc containerd.io 2>/dev/null || true

# # Install prerequisites
# sudo apt-get install -y ca-certificates curl gnupg lsb-release

# # Add Docker's official GPG key and repository
# echo "🔑 Adding Docker repository..."
# sudo install -m 0755 -d /etc/apt/keyrings
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --batch --yes -o /etc/apt/keyrings/docker.gpg
# sudo chmod a+r /etc/apt/keyrings/docker.gpg

# echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# # Update and install Docker from official repository
# echo "🐳 Installing Docker from official repository..."
# sudo apt-get update -y
# sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin


echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

echo "🌐 Installing and configuring Nginx..."
sudo apt-get update -y
sudo apt-get install -y nginx

# Create Nginx configuration for the job platform
sudo tee /etc/nginx/sites-available/job-platform > /dev/null << 'NGINX_CONFIG'
# Main site - pom100.com
server {
    listen 80;
    server_name pom100.com www.pom100.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Frontend proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}

# API subdomain - api.pom100.com
server {
    listen 80;
    server_name api.pom100.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # API proxy
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Enable CORS for API
    location ~* ^/(api|docs|openapi\.json) {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_CONFIG

# Enable the site and disable default
sudo ln -sf /etc/nginx/sites-available/job-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration and start Nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "✅ Nginx configured for pom100.com → :3000 and api.pom100.com → :8000"

echo "🔒 Setting up SSL certificates with Let's Encrypt..."
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Check if domains resolve to this server before attempting SSL
echo "⏳ Waiting for DNS propagation (checking if domains resolve to this server)..."
PUBLIC_IP=\$(curl -s http://checkip.amazonaws.com/)
POM100_IP=\$(dig +short pom100.com || echo "")
API_POM100_IP=\$(dig +short api.pom100.com || echo "")

if [ "\$POM100_IP" = "\$PUBLIC_IP" ] && [ "\$API_POM100_IP" = "\$PUBLIC_IP" ]; then
    echo "✅ DNS records are correctly configured, obtaining SSL certificates..."
    
    # Obtain SSL certificates for both domains
    sudo certbot --nginx -d pom100.com -d www.pom100.com -d api.pom100.com --non-interactive --agree-tos --email admin@pom100.com --no-eff-email
    
    # Set up auto-renewal
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    echo "✅ SSL certificates installed and auto-renewal configured"
    echo "🔒 Your sites are now available at:"
    echo "  https://pom100.com"
    echo "  https://www.pom100.com" 
    echo "  https://api.pom100.com"
else
    echo "⚠️ DNS records not yet pointing to this server (\$PUBLIC_IP)"
    echo "   pom100.com resolves to: \$POM100_IP"
    echo "   api.pom100.com resolves to: \$API_POM100_IP"
    echo ""
    echo "📋 To enable SSL later, run these commands on the server:"
    echo "   sudo certbot --nginx -d pom100.com -d www.pom100.com -d api.pom100.com"
    echo ""
    echo "🌐 DNS Configuration needed:"
    echo "   pom100.com     A  \$PUBLIC_IP"
    echo "   www.pom100.com A  \$PUBLIC_IP"  
    echo "   api.pom100.com A  \$PUBLIC_IP"
fi

echo "📁 Setting up application..."
sudo mkdir -p /opt/job-platform
sudo chown ubuntu:ubuntu /opt/job-platform
cd /opt/job-platform

echo "🔄 Stopping existing containers..."
sudo docker compose -f docker-compose.prod.yml down 2>/dev/null || true
sudo docker system prune -f

echo "📂 Extracting application..."
rm -rf frontend backend docker-compose.prod.yml 2>/dev/null || true
tar -xzf /tmp/deploy.tar.gz
rm -f /tmp/deploy.tar.gz

echo "🔐 Retrieving database credentials from AWS Secrets Manager..."
# Get database credentials from Secrets Manager
DB_SECRET_ARN=\$(grep "DB_SECRET_ARN=" .env | cut -d'=' -f2)
if [ -n "\$DB_SECRET_ARN" ]; then
    DB_SECRET_JSON=\$(aws secretsmanager get-secret-value --secret-id "\$DB_SECRET_ARN" --query SecretString --output text 2>/dev/null || echo "")
    
    if [ -n "\$DB_SECRET_JSON" ]; then
        # AWS-managed RDS secrets only contain username and password
        # Host and database name come from terraform outputs and variables
        DB_USER=\$(echo "\$DB_SECRET_JSON" | jq -r .username)
        DB_PASSWORD=\$(echo "\$DB_SECRET_JSON" | jq -r .password)
        DB_HOST=\$(grep "DB_HOST=" .env | cut -d'=' -f2)  # From terraform output (RDS endpoint)
        DB_PORT=\$(grep "DB_PORT=" .env | cut -d'=' -f2)  # Port from .env
        DB_NAME="jobplatform"  # From terraform variables (var.db_name)
        
        echo "✅ Database credentials assembled:"
        echo "  DB_USER: \$DB_USER"
        echo "  DB_HOST: \$DB_HOST"
        echo "  DB_PORT: \$DB_PORT"
        echo "  DB_NAME: \$DB_NAME"
        
        # Create DATABASE_URL from the retrieved credentials
        # Remove any existing port from DB_HOST to avoid duplication
        DB_HOST_CLEAN=\$(echo "\$DB_HOST" | cut -d':' -f1)
        DATABASE_URL="postgresql://\$DB_USER:\$DB_PASSWORD@\$DB_HOST_CLEAN:\$DB_PORT/\$DB_NAME"
        
        echo "🔍 Final DATABASE_URL format: postgresql://[user]:[password]@\$DB_HOST_CLEAN:\$DB_PORT/\$DB_NAME"
        
        # Update .env file with actual credentials
        echo "DATABASE_URL=\$DATABASE_URL" >> .env
        echo "DB_USER=\$DB_USER" >> .env  
        echo "DB_PASSWORD=\$DB_PASSWORD" >> .env
        
        echo "✅ Database credentials retrieved from Secrets Manager"
    else
        echo "❌ Failed to retrieve database secret from Secrets Manager"
        exit 1
    fi
else
    echo "❌ DB_SECRET_ARN not found in .env file"
    exit 1
fi

echo "🏗️ Building and starting containers..."
sudo docker compose -f docker-compose.prod.yml build --no-cache
sudo docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for containers to start..."
sleep 30

echo "📊 Container status:"
sudo docker compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
EOF
    
    # Clean up local files
    rm -f deploy.tar.gz
    
    print_status "✅ Application deployed successfully"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    sleep 10
    
    # Test frontend
    print_status "Testing frontend..."
    if curl -s -o /dev/null -w "%{http_code}" "http://$EC2_IP:3000/" | grep -q "200"; then
        print_status "✅ Frontend is accessible"
    else
        print_warning "⚠️ Frontend test failed"
    fi
    
    # Test backend
    print_status "Testing backend..."
    if curl -s "http://$EC2_IP:8000/health" | grep -q "healthy" 2>/dev/null; then
        print_status "✅ Backend is healthy"
    else
        print_warning "⚠️ Backend health check failed"
    fi
}

# Check if server setup is needed
check_server_setup() {
    print_status "Checking if server setup is needed..."
    
    # Check if Nginx is configured on the server
    if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ubuntu@$EC2_IP 'test -f /etc/nginx/sites-enabled/job-platform' 2>/dev/null; then
        print_status "✅ Server is already configured"
        return 0
    else
        print_status "🔧 Server setup required"
        return 1
    fi
}

# Main deployment function
main() {
    echo ""
    print_status "Starting complete AWS deployment..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Get infrastructure info
    get_infrastructure_info
    
    # Basic SSH check
    chmod 600 "$SSH_KEY"
    
    # Check if server setup is needed
    if ! check_server_setup; then
        echo ""
        print_warning "🔧 Server setup required. Running setup-server.sh first..."
        echo ""
        
        if [ -f "./setup-server.sh" ]; then
            chmod +x ./setup-server.sh
            ./setup-server.sh
            
            echo ""
            print_status "✅ Server setup completed. Now deploying application..."
            echo ""
        else
            print_error "setup-server.sh not found. Please create it or run manual setup."
            exit 1
        fi
    fi
    
    # Run application deployment
    if [ -f "./deploy-app.sh" ]; then
        chmod +x ./deploy-app.sh
        ./deploy-app.sh
    else
        print_error "deploy-app.sh not found. Please create it or run manual deployment."
        exit 1
    fi
    
    echo ""
    print_status "🎉 Complete deployment finished successfully!"
    echo ""
    print_status "📋 Available deployment options:"
    echo "  ./deploy-aws.sh     - Complete deployment (detects setup needs)"
    echo "  ./setup-server.sh   - One-time server setup only"
    echo "  ./deploy-app.sh     - Fast application deployment only"
    echo ""
}

# Show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --check       Check prerequisites only"
    echo ""
    echo "This script provides intelligent deployment to AWS EC2."
    echo "It detects if server setup is needed and runs the appropriate scripts."
    echo ""
    echo "Available Scripts:"
    echo "  ./deploy-aws.sh     - Complete deployment (auto-detects setup needs)"
    echo "  ./setup-server.sh   - One-time server setup (Docker, Nginx, SSL)"
    echo "  ./deploy-app.sh     - Fast application deployment (containers only)"
    echo ""
    echo "Prerequisites:"
    echo "  1. Run terraform-persistent/terraform apply"
    echo "  2. Run terraform-compute/terraform apply"
    echo "  3. Ensure SSH key exists at terraform-compute/job-platform-key"
}

# Parse arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --check)
        check_prerequisites
        echo "✅ Prerequisites check passed"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
