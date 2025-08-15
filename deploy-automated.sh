#!/bin/bash

set -e

echo "=== Automated Job Platform Deployment ==="

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/terraform-minimal"
SSH_KEY="$TERRAFORM_DIR/job-platform-key"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if terraform directory exists
    if [ ! -d "$TERRAFORM_DIR" ]; then
        print_error "Terraform directory not found at $TERRAFORM_DIR"
        exit 1
    fi
    
    # Check required tools
    command -v terraform >/dev/null 2>&1 || { print_error "terraform is required but not installed"; exit 1; }
    command -v docker >/dev/null 2>&1 || { print_error "docker is required but not installed"; exit 1; }
    command -v jq >/dev/null 2>&1 || { print_error "jq is required but not installed"; exit 1; }
    
    print_status "Prerequisites check passed"
}

# Function to get terraform outputs
get_terraform_outputs() {
    cd "$TERRAFORM_DIR"
    
    # Check if Terraform is initialized
    if [ ! -d ".terraform" ]; then
        print_status "Initializing Terraform..."
        terraform init
    fi
    
    # Get all outputs
    local outputs=$(terraform output -json 2>/dev/null || echo "{}")
    
    # Extract values with fallback
    PUBLIC_IP=$(echo "$outputs" | jq -r '.ec2_public_ip.value // empty')
    RDS_ENDPOINT=$(echo "$outputs" | jq -r '.rds_endpoint.value // empty')
    DB_SECRET_ARN=$(echo "$outputs" | jq -r '.db_secret_arn.value // empty')
    
    if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" = "null" ]; then
        print_error "Could not get EC2 public IP. Please run 'terraform apply' first."
        exit 1
    fi
    
    print_debug "EC2 Public IP: $PUBLIC_IP"
    print_debug "RDS Endpoint: $RDS_ENDPOINT"
    print_debug "DB Secret ARN: $DB_SECRET_ARN"
    
    cd "$SCRIPT_DIR"
}

# Function to wait for SSH connectivity
wait_for_ssh() {
    local ip=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for SSH connectivity to $ip..."
    
    # Set SSH key permissions
    chmod 600 "$SSH_KEY"
    
    while [ $attempt -le $max_attempts ]; do
        if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ubuntu@$ip 'echo "SSH ready"' &>/dev/null; then
            print_status "SSH connection established"
            return 0
        fi
        
        print_debug "Attempt $attempt/$max_attempts failed, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Could not establish SSH connection after $max_attempts attempts"
    exit 1
}

# Function to generate dynamic environment file
generate_environment_file() {
    local ip=$1
    local rds_endpoint=$2
    
    print_status "Generating dynamic environment configuration..."
    
    # Create environment file template
    cat > "$SCRIPT_DIR/.env.generated" << EOF
# Auto-generated production environment file
# Generated on: $(date)
# EC2 IP: $ip
# RDS Endpoint: $rds_endpoint

# Environment Configuration
NODE_ENV=production
ENVIRONMENT=production
DEBUG=false

# Database Configuration (AWS RDS)
DB_HOST=$rds_endpoint
DB_PORT=5432
DB_NAME=jobplatform
DB_USER=dbadmin
# Note: Password will be retrieved from AWS Secrets Manager
DATABASE_URL=postgresql://dbadmin:PLACEHOLDER_PASSWORD@$rds_endpoint:5432/jobplatform

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application Configuration
APP_NAME=Job Platform
APP_VERSION=1.0.0

# Network Configuration (Dynamic)
NEXT_PUBLIC_API_URL=http://$ip:8000
API_URL=http://backend:8000
CORS_ORIGINS=http://$ip:3000,http://$ip:8000,http://localhost:3000

# AWS Configuration
AWS_REGION=us-east-1

# Logging Configuration
LOG_LEVEL=INFO
LOG_FORMAT=%(asctime)s - %(name)s - %(levelname)s - %(message)s
EOF
    
    print_status "Environment file generated at .env.generated"
}

# Function to create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Remove old package
    rm -f "$SCRIPT_DIR/job-platform-deploy.tar.gz"
    
    # Create package with all necessary files
    cd "$SCRIPT_DIR"
    tar -czf job-platform-deploy.tar.gz \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='terraform-minimal/.terraform' \
        --exclude='terraform-minimal/terraform.tfstate*' \
        --exclude='terraform-minimal/job-platform-key*' \
        --exclude='*.tar.gz' \
        --exclude='.env.local' \
        --exclude='deploy*.sh' \
        frontend/ backend/ docker-compose.prod.yml .env.generated
    
    print_status "Deployment package created: job-platform-deploy.tar.gz"
}

# Function to deploy application with AWS Secrets Manager integration
deploy_application() {
    local ip=$1
    local rds_endpoint=$2
    local db_secret_arn=$3
    
    print_status "Deploying application to $ip..."
    
    # Upload deployment package
    print_status "Uploading deployment package..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$SCRIPT_DIR/job-platform-deploy.tar.gz" ubuntu@$ip:/tmp/
    
    # Deploy on server with AWS Secrets Manager integration
    print_status "Running deployment on server..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$ip << EOF
set -e

# Install required tools
print_status() {
    echo -e "\033[0;32m[INFO]\033[0m \$1"
}

print_status "Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y docker.io docker-compose-v2 curl jq awscli

# Configure AWS CLI to use instance role
export AWS_DEFAULT_REGION=us-east-1

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Create application directory
sudo mkdir -p /opt/job-platform
sudo chown ubuntu:ubuntu /opt/job-platform
cd /opt/job-platform

# Stop existing containers
if [ -f docker-compose.prod.yml ]; then
    docker compose -f docker-compose.prod.yml down 2>/dev/null || true
fi

# Extract new application
print_status "Extracting application files..."
tar -xzf /tmp/job-platform-deploy.tar.gz

# Use the generated environment file as base
cp .env.generated .env

# Retrieve database password from AWS Secrets Manager (if available)
if [ -n "$db_secret_arn" ] && [ "$db_secret_arn" != "null" ]; then
    print_status "Retrieving database credentials from AWS Secrets Manager..."
    DB_PASSWORD=\$(aws secretsmanager get-secret-value --secret-id "$db_secret_arn" --query 'SecretString' --output text 2>/dev/null | jq -r '.password' 2>/dev/null || echo "")
    
    if [ -n "\$DB_PASSWORD" ]; then
        print_status "Successfully retrieved database password from Secrets Manager"
        # Update the database URL with real password
        sed -i "s/PLACEHOLDER_PASSWORD/\$DB_PASSWORD/g" .env
    else
        print_status "Using fallback database credentials"
        # Use fallback credentials if Secrets Manager is not available
        sed -i "s/PLACEHOLDER_PASSWORD/OJ5.qw4D_|nrI#_km1T9E[3n7J<m/g" .env
    fi
else
    print_status "Using fallback database credentials (no Secrets Manager ARN)"
    sed -i "s/PLACEHOLDER_PASSWORD/OJ5.qw4D_|nrI#_km1T9E[3n7J<m/g" .env
fi

print_status "Final environment configuration:"
echo "NEXT_PUBLIC_API_URL=\$(grep NEXT_PUBLIC_API_URL .env)"
echo "CORS_ORIGINS=\$(grep CORS_ORIGINS .env)"
echo "DB_HOST=\$(grep DB_HOST .env)"

# Build containers with no cache to ensure fresh build
print_status "Building Docker containers..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start containers
print_status "Starting containers..."
docker compose -f docker-compose.prod.yml up -d

# Wait for containers to start
print_status "Waiting for containers to start..."
sleep 30

# Check container status
print_status "Container status:"
docker compose -f docker-compose.prod.yml ps

# Test connectivity
print_status "Testing application connectivity..."
# Test backend health endpoint
timeout 30 bash -c 'until curl -s http://localhost:8000/health | jq . 2>/dev/null; do sleep 2; done' || echo "Backend health check timeout"

# Test frontend
frontend_status=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
echo "Frontend status: \$frontend_status"

print_status "Deployment completed!"
EOF
    
    # Clean up local files
    rm -f "$SCRIPT_DIR/job-platform-deploy.tar.gz"
    rm -f "$SCRIPT_DIR/.env.generated"
    
    print_status "Application deployed successfully"
}

# Function to test deployment
test_deployment() {
    local ip=$1
    print_status "Testing deployment..."
    
    sleep 10
    
    # Test backend
    print_status "Testing backend health..."
    if timeout 30 bash -c "until curl -s http://$ip:8000/health | jq -r '.status' | grep -q 'healthy' 2>/dev/null; do sleep 3; done"; then
        print_status "✅ Backend is healthy"
    else
        print_warning "⚠️  Backend health check failed or timed out"
    fi
    
    # Test frontend
    print_status "Testing frontend accessibility..."
    local frontend_status=$(timeout 10 curl -s -o /dev/null -w "%{http_code}" "http://$ip:3000/" 2>/dev/null || echo "000")
    if [ "$frontend_status" = "200" ]; then
        print_status "✅ Frontend is accessible"
    else
        print_warning "⚠️  Frontend test failed (status: $frontend_status)"
    fi
    
    # Test API endpoints
    print_status "Testing API endpoints..."
    if timeout 10 curl -s "http://$ip:8000/docs" | grep -q "OpenAPI" 2>/dev/null; then
        print_status "✅ API documentation is accessible"
    else
        print_warning "⚠️  API documentation test failed"
    fi
}

# Main deployment function
main() {
    print_status "Starting automated Job Platform deployment..."
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Get infrastructure information
    get_terraform_outputs
    print_status "Deploying to EC2 instance: $PUBLIC_IP"
    print_status "RDS endpoint: ${RDS_ENDPOINT:-"Not available"}"
    echo ""
    
    # Wait for SSH
    wait_for_ssh "$PUBLIC_IP"
    
    # Generate dynamic environment configuration
    generate_environment_file "$PUBLIC_IP" "$RDS_ENDPOINT"
    
    # Create deployment package
    create_deployment_package
    
    # Deploy application
    deploy_application "$PUBLIC_IP" "$RDS_ENDPOINT" "$DB_SECRET_ARN"
    
    # Test deployment
    test_deployment "$PUBLIC_IP"
    
    print_status ""
    print_status "🎉 Automated deployment completed successfully!"
    echo ""
    echo "Application URLs:"
    echo "  Frontend:  http://$PUBLIC_IP:3000"
    echo "  Backend:   http://$PUBLIC_IP:8000"
    echo "  API Docs:  http://$PUBLIC_IP:8000/docs"
    echo ""
    echo "SSH Access:"
    echo "  ssh -i $SSH_KEY ubuntu@$PUBLIC_IP"
    echo ""
    echo "Container Management:"
    echo "  docker compose -f docker-compose.prod.yml ps"
    echo "  docker compose -f docker-compose.prod.yml logs frontend"
    echo "  docker compose -f docker-compose.prod.yml logs backend"
    echo ""
    print_warning "⚠️  Clear your browser cache to see frontend changes!"
    print_status "🔄 To redeploy: ./deploy-automated.sh"
}

# Handle script arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --check       Check prerequisites only"
        echo ""
        echo "This script automatically deploys the Job Platform to AWS with dynamic configuration."
        exit 0
        ;;
    "--check")
        check_prerequisites
        echo "✅ Prerequisites check passed"
        exit 0
        ;;
    "")
        # No arguments, run main deployment
        main "$@"
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac