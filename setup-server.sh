#!/bin/bash

set -e

echo "🚀 One-Time Server Setup for Job Platform"
echo "========================================="

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

# Setup server infrastructure
setup_server() {
    print_status "Setting up server infrastructure on $EC2_IP..."
    
    # Setup on EC2
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << EOF
set -e

echo "📦 Installing system dependencies..."
sudo apt-get update -y

# Clean up any conflicting Docker packages
echo "🧹 Removing conflicting Docker packages..."
sudo apt-get remove -y docker docker-engine docker.io containerd runc containerd.io 2>/dev/null || true

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key and repository
echo "🔑 Adding Docker repository..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --batch --yes -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update and install Docker from official repository
echo "🐳 Installing Docker from official repository..."
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

echo "🌐 Installing and configuring Nginx..."
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
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
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

echo "📦 Installing AWS CLI and jq (for deploy Secrets Manager)..."
sudo apt-get install -y jq unzip 2>/dev/null || true
if ! command -v aws >/dev/null 2>&1; then
  (cd /tmp && curl -sSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip && unzip -q -o awscliv2.zip && sudo ./aws/install -i /usr/local/aws-cli -b /usr/local/bin)
  rm -rf /tmp/awscliv2.zip /tmp/aws 2>/dev/null || true
fi
echo "✅ AWS CLI and jq ready"

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
    echo "🔒 Your sites will be available at:"
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

echo "📁 Setting up application directory..."
sudo mkdir -p /opt/job-platform
sudo chown ubuntu:ubuntu /opt/job-platform

echo "✅ Server setup completed!"
EOF
    
    print_status "✅ Server infrastructure setup completed"
}

# Main function
main() {
    echo ""
    print_status "Starting one-time server setup..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Get infrastructure info
    get_infrastructure_info
    
    # Wait for SSH
    wait_for_ssh
    
    # Setup server
    setup_server
    
    echo ""
    print_status "🎉 Server setup completed successfully!"
    echo ""
    echo "🌐 Server is now configured with:"
    echo "  ✅ Docker and Docker Compose"
    echo "  ✅ Nginx reverse proxy (pom100.com → :3000, api.pom100.com → :8000)"
    echo "  ✅ SSL certificates (if DNS was configured)"
    echo "  ✅ Application directory (/opt/job-platform)"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Configure DNS records to point to $EC2_IP"
    echo "  2. Run SSL setup if not done: ssh to server and run 'sudo certbot --nginx -d pom100.com -d www.pom100.com -d api.pom100.com'"
    echo "  3. Deploy your application with: ./deploy-app.sh"
    echo ""
    print_warning "⚠️ This setup only needs to be run ONCE per server"
    print_status "🔄 For application deployments, use: ./deploy-app.sh"
}

# Show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --check       Check prerequisites only"
    echo ""
    echo "This script sets up the server infrastructure (Docker, Nginx, SSL) - RUN ONCE ONLY."
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
