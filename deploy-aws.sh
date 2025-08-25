#!/bin/bash

set -e

echo "🚀 Simple AWS Deployment for Job Platform"
echo "=========================================="

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
  API_URL: 'http://${EC2_IP}:8000',
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
NEXT_PUBLIC_API_URL=http://${EC2_IP}:8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://frontend:3000,http://${EC2_IP}:3000
EOF
    
    # Create deployment package
    print_status "Creating deployment package..."
    tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='__pycache__' --exclude='.env.local' \
        -czf deploy.tar.gz frontend/ backend/ docker-compose.prod.yml .env
    
    # Restore original config and clean up temporary files
    mv frontend/public/config.js.backup frontend/public/config.js
    rm -f .env
    
    # Upload to EC2
    print_status "Uploading to EC2..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no deploy.tar.gz ubuntu@$EC2_IP:/tmp/
    
    # Deploy on EC2
    print_status "Running deployment on EC2..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$EC2_IP << 'EOF'
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
        DB_USER=\$(echo "\$DB_SECRET_JSON" | jq -r .username)
        DB_PASSWORD=\$(echo "\$DB_SECRET_JSON" | jq -r .password)
        DB_HOST=\$(echo "\$DB_SECRET_JSON" | jq -r .host)
        DB_NAME=\$(echo "\$DB_SECRET_JSON" | jq -r .dbname)
        
        # Create DATABASE_URL from the retrieved credentials
        DATABASE_URL="postgresql://\${DB_USER}:\${DB_PASSWORD}@\${DB_HOST}:5432/\${DB_NAME}"
        
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

# Main deployment function
main() {
    echo ""
    print_status "Starting simple AWS deployment..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Get infrastructure info
    get_infrastructure_info
    
    # Wait for SSH
    wait_for_ssh
    
    # Deploy application
    deploy_app
    
    # Test deployment
    test_deployment
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    echo "Application URLs:"
    echo "  Frontend:  http://$EC2_IP:3000"
    echo "  Backend:   http://$EC2_IP:8000"
    echo "  API Docs:  http://$EC2_IP:8000/docs"
    echo ""
    echo "SSH Access:"
    echo "  ssh -i $SSH_KEY ubuntu@$EC2_IP"
    echo ""
    echo "Container Management:"
    echo "  docker compose -f docker-compose.prod.yml ps"
    echo "  docker compose -f docker-compose.prod.yml logs frontend"
    echo "  docker compose -f docker-compose.prod.yml logs backend"
    echo ""
    print_warning "⚠️ Clear your browser cache to see frontend changes!"
    print_status "🔄 To redeploy: ./deploy-aws.sh"
}

# Show help
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --check       Check prerequisites only"
    echo ""
    echo "This script provides a simple deployment to AWS EC2."
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