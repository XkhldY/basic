#!/bin/bash
set -e

echo "📁 Setting up application..."
cd /opt/job-platform

echo "🔄 Stopping existing containers..."
sudo docker compose -f docker-compose.prod.yml down 2>/dev/null || true

echo "🧹 Cleaning up Docker resources..."
sudo docker system prune -f
sudo docker image prune -f

echo "📂 Extracting application..."
rm -rf frontend backend docker-compose.prod.yml .env 2>/dev/null || true
tar -xzf /tmp/deploy.tar.gz
rm -f /tmp/deploy.tar.gz

echo "🔐 Retrieving database credentials from AWS Secrets Manager..."
# Get database credentials from Secrets Manager
DB_SECRET_ARN=$(grep "DB_SECRET_ARN=" .env | cut -d'=' -f2)
if [ -n "$DB_SECRET_ARN" ]; then
    DB_SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$DB_SECRET_ARN" --query SecretString --output text 2>/dev/null || echo "")
    
    if [ -n "$DB_SECRET_JSON" ]; then
        # AWS-managed RDS secrets only contain username and password
        # Host and database name come from terraform outputs and variables
        DB_USER=$(echo "$DB_SECRET_JSON" | jq -r .username)
        DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r .password)
        DB_HOST=$(grep "DB_HOST=" .env | cut -d'=' -f2)  # From terraform output (RDS endpoint)
        DB_PORT=$(grep "DB_PORT=" .env | cut -d'=' -f2)  # Port from .env
        DB_NAME="jobplatform"  # From terraform variables (var.db_name)
        
        echo "✅ Database credentials assembled:"
        echo "  DB_USER: $DB_USER"
        echo "  DB_HOST: $DB_HOST"
        echo "  DB_PORT: $DB_PORT"
        echo "  DB_NAME: $DB_NAME"
        
        # Create DATABASE_URL from the retrieved credentials
        # Remove any existing port from DB_HOST to avoid duplication
        DB_HOST_CLEAN=$(echo "$DB_HOST" | cut -d':' -f1)
        DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST_CLEAN:$DB_PORT/$DB_NAME"
        
        echo "🔍 Final DATABASE_URL format: postgresql://[user]:[password]@$DB_HOST_CLEAN:$DB_PORT/$DB_NAME"
        
        # Update .env file with actual credentials
        echo "DATABASE_URL=$DATABASE_URL" >> .env
        echo "DB_USER=$DB_USER" >> .env  
        echo "DB_PASSWORD=$DB_PASSWORD" >> .env
        
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

# Show container logs for debugging
echo "📋 Recent container logs:"
echo "--- Frontend logs ---"
sudo docker compose -f docker-compose.prod.yml logs --tail=10 frontend
echo "--- Backend logs ---"
sudo docker compose -f docker-compose.prod.yml logs --tail=10 backend

echo "✅ Application deployment completed!"
