#!/bin/bash
set -e

echo "🐳 Starting Docker..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

echo "🌐 Installing and configuring Nginx..."
sudo apt-get update -y
sudo apt-get install -y nginx

# Create Nginx configuration for the job platform
sudo tee /etc/nginx/sites-available/job-platform > /dev/null << 'NGINX_EOF'
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Enable CORS for API
    location ~* ^/(api|docs|openapi\.json) {
        if ($request_method = 'OPTIONS') {
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

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
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com/)
POM100_IP=$(dig +short pom100.com || echo "")
API_POM100_IP=$(dig +short api.pom100.com || echo "")

if [ "$POM100_IP" = "$PUBLIC_IP" ] && [ "$API_POM100_IP" = "$PUBLIC_IP" ]; then
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
    echo "⚠️ DNS records not yet pointing to this server ($PUBLIC_IP)"
    echo "   pom100.com resolves to: $POM100_IP"
    echo "   api.pom100.com resolves to: $API_POM100_IP"
    echo ""
    echo "📋 To enable SSL later, run these commands on the server:"
    echo "   sudo certbot --nginx -d pom100.com -d www.pom100.com -d api.pom100.com"
    echo ""
    echo "🌐 DNS Configuration needed:"
    echo "   pom100.com     A  $PUBLIC_IP"
    echo "   www.pom100.com A  $PUBLIC_IP"  
    echo "   api.pom100.com A  $PUBLIC_IP"
fi

echo "📁 Setting up application directory..."
sudo mkdir -p /opt/job-platform
sudo chown ubuntu:ubuntu /opt/job-platform

echo "✅ Server setup completed!"
