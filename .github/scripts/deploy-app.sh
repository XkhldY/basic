#!/bin/bash

# deploy-app.sh
# Script to deploy application on EC2 instance

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
export AWS_REGION=${AWS_REGION:-us-east-1}
DB_SECRET_ARN=$(grep "DB_SECRET_ARN=" .env | cut -d'=' -f2- | tr -d ' \r\n')
if [ -n "$DB_SECRET_ARN" ]; then
    echo "  Using secret: ${DB_SECRET_ARN:0:60}..."
    # Use --output json and jq to get SecretString so we never mix stderr into the JSON
    RAW=$(aws secretsmanager get-secret-value --secret-id "$DB_SECRET_ARN" --region "$AWS_REGION" --output json 2>&1) || true
    if echo "$RAW" | grep -q "AccessDeniedException\|ResourceNotFoundException\|InvalidRequestException"; then
        DB_SECRET_JSON=""
    else
        DB_SECRET_JSON=$(echo "$RAW" | jq -r '.SecretString // empty' 2>/dev/null)
    fi
    
    if [ -n "$DB_SECRET_JSON" ]; then
        # RDS-managed secret JSON: username, password (and optionally engine, host, port)
        DB_USER=$(echo "$DB_SECRET_JSON" | jq -r '.username // empty')
        DB_PASSWORD=$(echo "$DB_SECRET_JSON" | jq -r '.password // empty')
        if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
            echo "❌ Secret missing .username or .password (check RDS managed secret format)"
            exit 1
        fi
        DB_HOST=$(grep "DB_HOST=" .env | cut -d'=' -f2- | tr -d ' \r\n')
        DB_PORT=$(grep "DB_PORT=" .env | cut -d'=' -f2- | tr -d ' \r\n')
        DB_NAME="jobplatform"
        
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
        echo "   AWS error/output: $DB_SECRET_JSON"
        echo "   Check: 1) EC2 IAM role has secretsmanager:GetSecretValue, 2) DB_SECRET_ARN in .env is correct, 3) AWS_REGION (e.g. us-east-1)"
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