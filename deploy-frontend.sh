#!/bin/bash

set -e

echo "Frontend-Only Deployment for POM"
echo "================================="

# Configuration
SSH_KEY="~/.ssh/job-platform-key"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status()  { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# Get EC2 IP from terraform
get_ec2_ip() {
    print_status "Getting EC2 IP from terraform..."

    if [ ! -d "terraform" ]; then
        print_error "terraform directory not found"
        exit 1
    fi

    cd terraform
    if [ ! -d ".terraform" ]; then
        terraform init
    fi
    EC2_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "")
    cd ..

    if [ -z "$EC2_IP" ]; then
        print_error "Could not get EC2 IP. Run 'terraform apply' in terraform-compute first."
        exit 1
    fi

    print_status "EC2 IP: $EC2_IP"
}

# Wait for SSH
wait_for_ssh() {
    chmod 600 "$SSH_KEY"
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=5 ubuntu@$EC2_IP 'echo ok' &>/dev/null; then
            print_status "SSH connection established"
            return 0
        fi
        attempts=$((attempts + 1))
        print_status "Attempt $attempts/10, retrying in 5s..."
        sleep 5
    done
    print_error "SSH connection failed"
    exit 1
}

# Package and upload frontend only
deploy_frontend() {
    print_status "Packaging frontend..."

    # Write production config
    cp frontend/public/config.js frontend/public/config.js.backup
    cat > frontend/public/config.js << 'CONFIGEOF'
// Production configuration - automatically generated during deployment
window.APP_CONFIG = {
  API_URL: 'https://api.pom100.com',
  ENVIRONMENT: 'production'
};
CONFIGEOF

    tar --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='frontend/test-results' \
        --exclude='frontend/tests' \
        -czf deploy-frontend.tar.gz frontend/

    # Restore local config
    mv frontend/public/config.js.backup frontend/public/config.js

    print_status "Uploading frontend to EC2..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
        deploy-frontend.tar.gz ubuntu@$EC2_IP:/tmp/

    rm -f deploy-frontend.tar.gz

    print_status "Deploying frontend on EC2..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@$EC2_IP << 'SSHEOF'
set -e
export PATH="/usr/local/bin:$PATH"
cd /opt/job-platform

echo "Stopping frontend container..."
sudo docker compose -f docker-compose.prod.yml stop frontend 2>/dev/null || true
sudo docker compose -f docker-compose.prod.yml rm -f frontend 2>/dev/null || true

echo "Extracting new frontend..."
rm -rf frontend
tar -xzf /tmp/deploy-frontend.tar.gz
rm -f /tmp/deploy-frontend.tar.gz

echo "Removing old frontend image..."
sudo docker image rm -f job-platform-frontend 2>/dev/null || true
sudo docker images | grep frontend | awk '{print $3}' | xargs sudo docker rmi -f 2>/dev/null || true

echo "Building and starting frontend container..."
sudo docker compose -f docker-compose.prod.yml build --no-cache frontend
sudo docker compose -f docker-compose.prod.yml up -d frontend

echo "Waiting for frontend to start..."
sleep 20

echo "Container status:"
sudo docker compose -f docker-compose.prod.yml ps frontend

echo "Recent frontend logs:"
sudo docker compose -f docker-compose.prod.yml logs --tail=20 frontend

echo "Frontend deployment complete!"
SSHEOF

    print_status "Frontend deployed successfully"
}

# Smoke test
test_frontend() {
    print_status "Testing frontend..."
    sleep 5
    if curl -s -o /dev/null -w "%{http_code}" "http://$EC2_IP:3000/" | grep -q "200"; then
        print_status "Frontend is accessible at http://$EC2_IP:3000"
    else
        print_warning "Frontend health check returned non-200. Check logs on EC2."
    fi
}

main() {
    get_ec2_ip
    wait_for_ssh
    deploy_frontend
    test_frontend

    echo ""
    print_status "Frontend deployment done!"
    echo ""
    echo "  Live site:  https://pom100.com"
    echo "  Direct:     http://$EC2_IP:3000"
    echo ""
    print_warning "Clear your browser cache to see changes."
}

case "${1:-}" in
    --help|-h)
        echo "Usage: $0"
        echo "Deploys only the frontend container. Backend stays untouched."
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        exit 1
        ;;
esac
