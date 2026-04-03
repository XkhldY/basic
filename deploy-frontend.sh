#!/bin/bash

set -e

echo "Frontend-Only Deployment for POM"
echo "================================="

# ---------------------------------------------------------------------------
# Configuration — override any of these with environment variables
# ---------------------------------------------------------------------------
PROJECT_NAME="${PROJECT_NAME:-job-platform}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/job-platform-key}"
EC2_IP="${EC2_IP:-}"          # Set this to skip auto-discovery

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status()  { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# ---------------------------------------------------------------------------
# Resolve EC2 IP
# Priority: env var → terraform output → AWS CLI → prompt
# ---------------------------------------------------------------------------
get_ec2_ip() {
    if [ -n "$EC2_IP" ]; then
        print_status "Using EC2_IP from environment: $EC2_IP"
        return 0
    fi

    # Try terraform output
    if [ -d "terraform" ] && [ -d "terraform/.terraform" ]; then
        print_status "Trying terraform output..."
        TERRAFORM_IP=$(cd terraform && terraform output -raw ec2_public_ip 2>/dev/null || echo "")
        if [ -n "$TERRAFORM_IP" ] && [[ "$TERRAFORM_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            EC2_IP="$TERRAFORM_IP"
            print_status "EC2 IP from terraform: $EC2_IP"
            return 0
        fi
    fi

    # Fall back to AWS CLI
    print_status "Terraform state empty — querying AWS CLI..."
    if command -v aws &>/dev/null; then
        AWS_IP=$(aws ec2 describe-instances \
            --filters \
                "Name=tag:Name,Values=${PROJECT_NAME}-app-server" \
                "Name=instance-state-name,Values=running" \
            --query "Reservations[0].Instances[0].PublicIpAddress" \
            --output text 2>/dev/null || echo "")
        if [ -n "$AWS_IP" ] && [ "$AWS_IP" != "None" ] && [[ "$AWS_IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            EC2_IP="$AWS_IP"
            print_status "EC2 IP from AWS CLI: $EC2_IP"
            return 0
        fi
    fi

    # Last resort — prompt
    print_warning "Could not auto-discover EC2 IP."
    read -rp "Enter EC2 public IP manually: " EC2_IP
    if [ -z "$EC2_IP" ]; then
        print_error "No EC2 IP provided. Aborting."
        exit 1
    fi
}

# ---------------------------------------------------------------------------
# Resolve SSH key
# ---------------------------------------------------------------------------
resolve_ssh_key() {
    # Expand ~ manually in case it wasn't expanded
    SSH_KEY="${SSH_KEY/#\~/$HOME}"

    if [ -f "$SSH_KEY" ]; then
        chmod 600 "$SSH_KEY"
        print_status "SSH key: $SSH_KEY"
        return 0
    fi

    # Try common alternative locations
    for candidate in \
        "$HOME/.ssh/id_ed25519" \
        "$HOME/.ssh/id_rsa" \
        "$HOME/.ssh/${PROJECT_NAME}-key"; do
        if [ -f "$candidate" ]; then
            SSH_KEY="$candidate"
            chmod 600 "$SSH_KEY"
            print_status "SSH key found at: $SSH_KEY"
            return 0
        fi
    done

    print_error "SSH private key not found."
    echo ""
    echo "  Expected location: $HOME/.ssh/job-platform-key"
    echo ""
    echo "  Options:"
    echo "    1. Copy your private key there:"
    echo "       cp /path/to/your/private-key $HOME/.ssh/job-platform-key"
    echo "    2. Or set SSH_KEY env var:"
    echo "       SSH_KEY=/path/to/key ./deploy-frontend.sh"
    exit 1
}

# ---------------------------------------------------------------------------
# Wait for SSH to be ready
# ---------------------------------------------------------------------------
wait_for_ssh() {
    local attempts=0
    while [ $attempts -lt 10 ]; do
        if ssh -i "$SSH_KEY" \
               -o StrictHostKeyChecking=no \
               -o UserKnownHostsFile=/dev/null \
               -o ConnectTimeout=5 \
               ubuntu@"$EC2_IP" 'echo ok' &>/dev/null; then
            print_status "SSH connection established"
            return 0
        fi
        attempts=$((attempts + 1))
        print_status "SSH attempt $attempts/10, retrying in 5s..."
        sleep 5
    done

    # Try alternate SSH port 2222
    print_warning "Port 22 unreachable — trying port 2222..."
    for i in 1 2 3; do
        if ssh -i "$SSH_KEY" \
               -p 2222 \
               -o StrictHostKeyChecking=no \
               -o UserKnownHostsFile=/dev/null \
               -o ConnectTimeout=5 \
               ubuntu@"$EC2_IP" 'echo ok' &>/dev/null; then
            print_status "SSH connected on port 2222"
            SSH_PORT=2222
            return 0
        fi
        sleep 5
    done

    print_error "SSH connection failed on ports 22 and 2222."
    exit 1
}

# ---------------------------------------------------------------------------
# Package, upload and deploy frontend
# ---------------------------------------------------------------------------
deploy_frontend() {
    local ssh_port="${SSH_PORT:-22}"
    # ssh uses -p (lowercase), scp uses -P (uppercase) for port
    local ssh_opts="-i $SSH_KEY -p $ssh_port -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    local scp_opts="-i $SSH_KEY -P $ssh_port -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

    print_status "Packaging frontend..."

    # Write production config
    cp frontend/public/config.js frontend/public/config.js.backup 2>/dev/null || true
    cat > frontend/public/config.js << 'CONFIGEOF'
// Production configuration — auto-generated during deployment
window.APP_CONFIG = {
  ENVIRONMENT: 'production'
};
CONFIGEOF

    tar --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='frontend/test-results' \
        --exclude='frontend/tests' \
        -czf deploy-frontend.tar.gz frontend/ docker-compose.prod.yml

    # Restore local config
    if [ -f frontend/public/config.js.backup ]; then
        mv frontend/public/config.js.backup frontend/public/config.js
    fi

    print_status "Uploading to EC2 ($EC2_IP)..."
    # shellcheck disable=SC2086
    scp $scp_opts deploy-frontend.tar.gz ubuntu@"$EC2_IP":/tmp/

    rm -f deploy-frontend.tar.gz

    print_status "Deploying on EC2..."
    # shellcheck disable=SC2086
    ssh $ssh_opts ubuntu@"$EC2_IP" << 'SSHEOF'
set -e
export PATH="/usr/local/bin:$PATH"

APP_DIR="/opt/job-platform"
sudo mkdir -p "$APP_DIR"
sudo chown ubuntu:ubuntu "$APP_DIR"
cd "$APP_DIR"

# Ensure Docker is installed
if ! command -v docker &>/dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker ubuntu
    newgrp docker
fi

# Ensure .env exists (create minimal one if missing)
if [ ! -f "$APP_DIR/.env" ]; then
    echo "NODE_ENV=production" > "$APP_DIR/.env"
    echo "NEXT_TELEMETRY_DISABLED=1" >> "$APP_DIR/.env"
    echo "Created minimal .env"
fi

echo "Stopping existing frontend container..."
docker compose -f docker-compose.prod.yml stop frontend 2>/dev/null || true
docker compose -f docker-compose.prod.yml rm -f frontend 2>/dev/null || true

echo "Extracting new code..."
rm -rf frontend docker-compose.prod.yml
tar -xzf /tmp/deploy-frontend.tar.gz
rm -f /tmp/deploy-frontend.tar.gz

echo "Removing old frontend image..."
docker image rm -f job-platform-frontend 2>/dev/null || true
docker images | grep frontend | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true

echo "Building and starting frontend..."
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml up -d frontend

echo "Waiting for container to start..."
sleep 20

echo "Container status:"
docker compose -f docker-compose.prod.yml ps frontend

echo "Recent logs:"
docker compose -f docker-compose.prod.yml logs --tail=30 frontend

echo "Frontend deployment complete!"
SSHEOF

    print_status "Frontend deployed successfully"
}

# ---------------------------------------------------------------------------
# Smoke test
# ---------------------------------------------------------------------------
test_frontend() {
    print_status "Running smoke test..."
    sleep 5
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://$EC2_IP:3000/" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        print_status "✓ Frontend responding at http://$EC2_IP:3000 (HTTP $HTTP_CODE)"
    else
        print_warning "Frontend returned HTTP $HTTP_CODE — check container logs on EC2."
    fi
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
    get_ec2_ip
    resolve_ssh_key
    wait_for_ssh
    deploy_frontend
    test_frontend

    echo ""
    print_status "Deployment complete!"
    echo ""
    echo "  Live site:  https://hirewithpom.com"
    echo "  Direct:     http://$EC2_IP:3000"
    echo ""
    print_warning "Clear your browser cache if you don't see changes."
}

case "${1:-}" in
    --help|-h)
        echo "Usage: ./deploy-frontend.sh"
        echo ""
        echo "Environment variable overrides:"
        echo "  EC2_IP=1.2.3.4          Skip auto-discovery and use this IP"
        echo "  SSH_KEY=/path/to/key    Use a specific SSH private key"
        echo "  PROJECT_NAME=my-proj    Override project name (default: job-platform)"
        echo ""
        echo "Examples:"
        echo "  ./deploy-frontend.sh"
        echo "  EC2_IP=54.123.45.67 ./deploy-frontend.sh"
        echo "  SSH_KEY=~/.ssh/my-key EC2_IP=54.123.45.67 ./deploy-frontend.sh"
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        exit 1
        ;;
esac
