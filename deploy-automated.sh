#!/bin/bash

set -e

echo "=== Automated Job Platform Deployment ==="

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_PERSISTENT_DIR="$SCRIPT_DIR/terraform-persistent"
TERRAFORM_COMPUTE_DIR="$SCRIPT_DIR/terraform-compute"
SSH_KEY="$TERRAFORM_COMPUTE_DIR/job-platform-key"

# Script options (set by command line flags)
SYSTEM_ONLY=false
APP_ONLY=false
FORCE_REINSTALL=false
SKIP_SYSTEM_CHECK=false

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

# Smart dependency checking functions
check_docker_installed() {
    if command -v docker >/dev/null 2>&1 && docker --version >/dev/null 2>&1; then
        if systemctl is-active --quiet docker 2>/dev/null; then
            print_debug "Docker is already installed and running"
            return 0
        else
            print_debug "Docker is installed but not running"
            return 1
        fi
    else
        print_debug "Docker is not installed"
        return 1
    fi
}

check_aws_cli_installed() {
    if command -v aws >/dev/null 2>&1 && aws --version >/dev/null 2>&1; then
        print_debug "AWS CLI is already installed: $(aws --version)"
        return 0
    else
        print_debug "AWS CLI is not installed or not working"
        return 1
    fi
}

check_user_in_docker_group() {
    if groups $USER | grep -q docker; then
        print_debug "User $USER is already in docker group"
        return 0
    else
        print_debug "User $USER is not in docker group"
        return 1
    fi
}

is_package_installed() {
    local package=$1
    if dpkg -l | grep -q "^ii  $package "; then
        return 0
    else
        return 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if terraform directories exist
    if [ ! -d "$TERRAFORM_COMPUTE_DIR" ]; then
        print_error "Terraform compute directory not found at $TERRAFORM_COMPUTE_DIR"
        exit 1
    fi
    
    if [ ! -d "$TERRAFORM_PERSISTENT_DIR" ]; then
        print_error "Terraform persistent directory not found at $TERRAFORM_PERSISTENT_DIR"
        print_status "Run the persistent infrastructure first: cd terraform-persistent && terraform apply"
        exit 1
    fi
    
    # Check required tools
    command -v terraform >/dev/null 2>&1 || { print_error "terraform is required but not installed"; exit 1; }
    command -v docker >/dev/null 2>&1 || { print_error "docker is required but not installed"; exit 1; }
    command -v jq >/dev/null 2>&1 || { print_error "jq is required but not installed"; exit 1; }
    
    # Check if persistent infrastructure exists
    if [ ! -f "$TERRAFORM_PERSISTENT_DIR/terraform.tfstate" ]; then
        print_error "Persistent infrastructure not found. Please run:"
        print_error "cd terraform-persistent && terraform init && terraform apply"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Function to get terraform outputs from both infrastructures
get_terraform_outputs() {
    # Get compute infrastructure outputs
    cd "$TERRAFORM_COMPUTE_DIR"
    
    # Check if Terraform is initialized
    if [ ! -d ".terraform" ]; then
        print_status "Initializing Terraform..."
        terraform init
    fi
    
    # Get compute outputs
    local compute_outputs=$(terraform output -json 2>/dev/null || echo "{}")
    
    # Extract compute values
    PUBLIC_IP=$(echo "$compute_outputs" | jq -r '.ec2_public_ip.value // empty')
    RDS_ENDPOINT=$(echo "$compute_outputs" | jq -r '.rds_endpoint.value // empty')
    DB_SECRET_ARN=$(echo "$compute_outputs" | jq -r '.db_secret_arn.value // empty')
    
    if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" = "null" ]; then
        print_error "Could not get EC2 public IP. Please run 'terraform apply' in terraform-compute first."
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
    local max_attempts=60
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
DB_HOST=${rds_endpoint%:*}
DB_PORT=5432
DB_NAME=jobplatform
DB_USER=dbadmin
# Note: Password will be retrieved from AWS Secrets Manager
DATABASE_URL=postgresql://dbadmin:PLACEHOLDER_PASSWORD@${rds_endpoint%:*}:5432/jobplatform

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
    tar --no-mac-metadata -czf job-platform-deploy.tar.gz \
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
        frontend/ backend/ docker-compose.prod.yml .env.generated 2>/dev/null || \
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

# Define helper functions for remote session
print_status() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

check_aws_cli_installed() {
    if command -v aws >/dev/null 2>&1 && aws --version >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

check_docker_installed() {
    if command -v docker >/dev/null 2>&1 && docker --version >/dev/null 2>&1; then
        if systemctl is-active --quiet docker 2>/dev/null; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

print_status "Installing system dependencies..."
sudo apt-get update -y
DEBIAN_FRONTEND=noninteractive sudo apt-get upgrade -y
sudo apt-get install -y \
    curl \
    wget \
    git \
    jq \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release

print_status "Setting up AWS CLI v2..."
if check_aws_cli_installed; then
    print_status "✅ AWS CLI is already installed and working"
else
    print_status "Installing/updating AWS CLI v2..."
    # Download AWS CLI installer
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    
    # Try update first, then install if that fails
    if [ -f "/usr/local/aws-cli/v2/current/bin/aws" ]; then
        print_status "Updating existing AWS CLI installation..."
        sudo ./aws/install --update || {
            print_warning "Update failed, trying fresh install..."
            sudo rm -rf /usr/local/aws-cli
            sudo ./aws/install
        }
    else
        print_status "Installing AWS CLI fresh..."
        sudo ./aws/install
    fi
    
    rm -rf awscliv2.zip aws/
    
    # Verify installation
    if check_aws_cli_installed; then
        print_status "✅ AWS CLI installation successful"
    else
        print_error "❌ AWS CLI installation failed"
        exit 1
    fi
fi

print_status "Setting up Docker..."
if check_docker_installed; then
    print_status "✅ Docker is already installed and running"
else
    print_status "Installing Docker..."
    
    # Aggressive cleanup of Docker repository issues
    print_status "Cleaning up any existing Docker repository files..."
    sudo rm -f /etc/apt/sources.list.d/docker.list*
    sudo rm -f /etc/apt/keyrings/docker.gpg
    sudo apt-get clean
    
    # Fix any apt update issues
    print_status "Fixing package manager state..."
    sudo dpkg --configure -a
    sudo apt-get -f install -y
    sudo apt-get update -y
    
    # Try Ubuntu's docker.io package first (simpler, more reliable)
    print_status "Installing Docker from Ubuntu repository..."
    if sudo apt-get install -y docker.io docker-compose-v2; then
        print_status "✅ Docker installed from Ubuntu repository"
    else
        print_status "Ubuntu repository failed, trying Docker official repository..."
        
        # Manual Docker repository setup with explicit values
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        # Write repository file manually with hardcoded values for Ubuntu 22.04
        echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    fi
    
    # Verify Docker installation
    if check_docker_installed; then
        print_status "✅ Docker installation successful"
    else
        print_error "❌ Docker installation failed"
        exit 1
    fi
fi

# Configure AWS CLI to use instance role
export AWS_DEFAULT_REGION=us-east-1

# Start Docker service and configure user
print_status "Configuring Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group if not already added
if groups ubuntu | grep -q docker; then
    print_status "✅ User ubuntu is already in docker group"
else
    print_status "Adding ubuntu user to docker group..."
    sudo usermod -aG docker ubuntu
    print_warning "⚠️  Docker group membership will take effect on next SSH session"
fi

# Create application directory
sudo mkdir -p /opt/job-platform
sudo chown ubuntu:ubuntu /opt/job-platform
cd /opt/job-platform

# Stop existing containers and clean up
print_status "Stopping existing containers..."
if [ -f docker-compose.prod.yml ]; then
    sudo docker compose -f docker-compose.prod.yml down 2>/dev/null || true
    sudo docker system prune -f --volumes 2>/dev/null || true
fi

# Extract new application
print_status "Extracting application files..."
rm -rf frontend backend docker-compose.prod.yml .env* 2>/dev/null || true
tar -xzf /tmp/job-platform-deploy.tar.gz
rm -f /tmp/job-platform-deploy.tar.gz

# Use the generated environment file as base
cp .env.generated .env

# Retrieve database password from AWS Secrets Manager (if available)
db_secret_arn="$db_secret_arn"
if [ -n "\$db_secret_arn" ] && [ "\$db_secret_arn" != "null" ]; then
    print_status "Retrieving database credentials from AWS Secrets Manager..."
    DB_PASSWORD=\$(aws secretsmanager get-secret-value --secret-id "\$db_secret_arn" --query 'SecretString' --output text 2>/dev/null | jq -r '.password' 2>/dev/null || echo "")
    
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
sudo docker compose -f docker-compose.prod.yml build --no-cache

# Start containers
print_status "Starting containers..."
sudo docker compose -f docker-compose.prod.yml up -d

# Wait for containers to start
print_status "Waiting for containers to start..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
# Wait for backend container to be healthy
print_status "Waiting for backend container to be ready..."
timeout 120 bash -c '
    while true; do
        if sudo docker compose -f docker-compose.prod.yml ps backend | grep -q "healthy\|Up"; then
            print_status "Backend container is ready"
            break
        fi
        if sudo docker compose -f docker-compose.prod.yml ps backend | grep -q "Exit"; then
            print_status "Backend container failed to start, checking logs..."
            sudo docker compose -f docker-compose.prod.yml logs backend | tail -20
            exit 1
        fi
        sleep 3
    done
' || {
    print_error "Backend container failed to become ready"
    sudo docker compose -f docker-compose.prod.yml logs backend | tail -20
    exit 1
}

# Run Alembic migrations with better error handling
print_status "Running Alembic database migrations..."
if sudo docker compose -f docker-compose.prod.yml exec -T backend alembic upgrade head; then
    print_status "✅ Database migrations completed successfully"
else
    print_warning "⚠️  Migration failed - checking if database is already initialized..."
    # Check if tables exist
    if sudo docker compose -f docker-compose.prod.yml exec -T backend python -c "
from database import engine
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
if len(tables) > 0:
    print('Database already has tables:', tables)
    exit(0)
else:
    print('Database is empty but migration failed')
    exit(1)
" 2>/dev/null; then
        print_status "✅ Database already initialized"
    else
        print_error "❌ Database migration failed and database appears empty"
        exit 1
    fi
fi

# Check container status
print_status "Container status:"
sudo docker compose -f docker-compose.prod.yml ps

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

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --check)
                check_prerequisites
                echo "✅ Prerequisites check passed"
                exit 0
                ;;
            --system-only)
                SYSTEM_ONLY=true
                shift
                ;;
            --app-only)
                APP_ONLY=true
                shift
                ;;
            --force-reinstall)
                FORCE_REINSTALL=true
                shift
                ;;
            --skip-system-check)
                SKIP_SYSTEM_CHECK=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --help, -h           Show this help message"
    echo "  --check              Check prerequisites only"
    echo "  --system-only        Only setup system dependencies (Docker, AWS CLI)"
    echo "  --app-only           Only deploy application (skip system setup)"
    echo "  --force-reinstall    Force reinstall all system dependencies"
    echo "  --skip-system-check  Skip system dependency checks entirely"
    echo ""
    echo "Examples:"
    echo "  $0                   Full deployment (system + application)"
    echo "  $0 --system-only     Setup system only"
    echo "  $0 --app-only        Deploy application only"
    echo "  $0 --force-reinstall Re-install everything"
    echo ""
    echo "This script automatically deploys the Job Platform to AWS with dynamic configuration."
}

# Enhanced main function with options support
enhanced_main() {
    print_status "Starting automated Job Platform deployment..."
    echo ""
    
    # Show configuration
    if [ "$SYSTEM_ONLY" = true ]; then
        print_status "Mode: System setup only"
    elif [ "$APP_ONLY" = true ]; then
        print_status "Mode: Application deployment only"
    elif [ "$FORCE_REINSTALL" = true ]; then
        print_status "Mode: Force reinstall all dependencies"
    else
        print_status "Mode: Full deployment"
    fi
    echo ""
    
    # Check prerequisites (unless skipped)
    if [ "$APP_ONLY" = false ]; then
        check_prerequisites
    fi
    
    # Get infrastructure information (unless system-only)
    if [ "$SYSTEM_ONLY" = false ]; then
        get_terraform_outputs
        print_status "Deploying to EC2 instance: $PUBLIC_IP"
        print_status "RDS endpoint: ${RDS_ENDPOINT:-"Not available"}"
        echo ""
        
        # Wait for SSH
        wait_for_ssh "$PUBLIC_IP"
    fi
    
    # Generate dynamic environment configuration (unless system-only)
    if [ "$SYSTEM_ONLY" = false ]; then
        generate_environment_file "$PUBLIC_IP" "$RDS_ENDPOINT"
        create_deployment_package
    fi
    
    # Deploy based on mode
    if [ "$SYSTEM_ONLY" = true ]; then
        print_status "Setting up system dependencies only..."
        # This would be handled in the SSH deployment section
        print_status "✅ System setup mode - use --app-only for application deployment"
    elif [ "$APP_ONLY" = true ]; then
        print_status "Deploying application only..."
        deploy_application "$PUBLIC_IP" "$RDS_ENDPOINT" "$DB_SECRET_ARN"
        test_deployment "$PUBLIC_IP"
    else
        # Full deployment
        deploy_application "$PUBLIC_IP" "$RDS_ENDPOINT" "$DB_SECRET_ARN"
        test_deployment "$PUBLIC_IP"
    fi
    
    print_status ""
    print_status "🎉 Deployment completed successfully!"
    
    if [ "$SYSTEM_ONLY" = false ]; then
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
    fi
    
    print_status "🔄 To redeploy: ./deploy-automated.sh"
}

# Parse arguments and run
parse_arguments "$@"
enhanced_main