#!/bin/bash
# Minimal EC2 setup script that downloads and runs the full setup

set -e
exec > >(tee /var/log/setup.log) 2>&1

echo "=== Starting Minimal Job Platform Setup at $(date) ==="

# Update system
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install essential packages
apt-get install -y curl wget git awscli jq

# Download the full setup script
echo "Downloading full setup script..."
curl -o /tmp/full-setup.sh https://raw.githubusercontent.com/XkhldY/basic/claude-auto/terraform-minimal/setup-working.sh

# Make it executable and run it
chmod +x /tmp/full-setup.sh
/tmp/full-setup.sh

echo "=== Minimal setup completed at $(date) ==="