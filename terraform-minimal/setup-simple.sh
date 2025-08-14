#!/bin/bash
# Simple EC2 setup script - minimal configuration for testing

set -e

# Update system
apt-get update
apt-get upgrade -y

# Install basic packages
apt-get install -y docker.io docker-compose git nginx curl

# Start Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Create simple test page
mkdir -p /var/www/html
cat > /var/www/html/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Job Platform - Setup Complete</title>
</head>
<body>
    <h1>Job Platform AWS Instance Ready</h1>
    <p>Instance is running and accessible!</p>
    <p>Server IP: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)</p>
    <p>Setup completed at: $(date)</p>
</body>
</html>
EOF

# Start nginx
systemctl start nginx
systemctl enable nginx

echo "Simple setup completed!"