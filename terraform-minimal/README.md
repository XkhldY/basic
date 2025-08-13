# Job Platform AWS Deployment

This directory contains Terraform configuration for deploying the Job Platform to AWS with minimal cost (~$15-25/month).

## Architecture

- **EC2 t3.micro**: Hosts both frontend and backend using Docker
- **RDS PostgreSQL t3.micro**: Database in private subnet
- **Elastic IP**: Static public IP address
- **VPC**: Isolated network with public/private subnets
- **Security Groups**: Network access control
- **Route 53**: DNS management (optional)

## Prerequisites

1. **AWS Account**: With billing configured
2. **AWS CLI**: Installed and configured
3. **Terraform**: Version >= 1.0
4. **SSH Key**: For EC2 access
5. **Domain** (optional): For HTTPS and custom domain

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Terraform
brew install terraform  # macOS
# or
sudo apt-get install terraform  # Ubuntu

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
```

### 2. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy this for terraform.tfvars
```

### 3. Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Deploy the infrastructure
terraform apply
```

### 5. Access Your Application

After deployment, Terraform will output:
- Public IP address
- SSH command
- Application URLs
- Database connection details

## Post-Deployment Setup

### 1. SSH to Server

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>
```

### 2. Check Application Status

```bash
# Check Docker containers
sudo docker-compose -f /opt/job-platform/docker-compose.prod.yml ps

# View application logs
sudo docker-compose -f /opt/job-platform/docker-compose.prod.yml logs -f

# Check Nginx status
sudo systemctl status nginx
```

### 3. Setup SSL (if domain configured)

```bash
# Run Certbot for HTTPS
sudo certbot --nginx -d your-domain.com

# Verify SSL renewal
sudo certbot renew --dry-run
```

## Cost Optimization

### Free Tier Usage (First 12 months)
- EC2 t3.micro: 750 hours/month free
- RDS t3.micro: 750 hours/month free
- EBS: 30 GB free
- Data transfer: 15 GB/month free

### Estimated Monthly Costs
- **With Free Tier**: ~$3.50/month
- **After Free Tier**: ~$25.50/month

## Monitoring and Maintenance

### Application Management

```bash
# Restart application
sudo systemctl restart job-platform

# Update application code
cd /opt/job-platform
git pull
sudo systemctl restart job-platform

# View system resources
htop
df -h
```

### Database Management

```bash
# Connect to database (from EC2)
psql postgresql://dbadmin:password@db-endpoint:5432/jobplatform

# View database logs (from AWS Console)
# RDS → Databases → job-platform-db → Logs
```

### Backup Strategy

- **RDS Automated Backups**: 7 days retention
- **Manual Snapshots**: Create before major updates
- **Application Data**: Consider backing up uploaded files

## Security Considerations

1. **SSH Access**: Restrict to your IP in `allowed_ssh_cidr_blocks`
2. **Database**: Located in private subnet, no public access
3. **Firewall**: UFW configured with minimal open ports
4. **SSL**: Use Certbot for free HTTPS certificates
5. **Updates**: Regular system and application updates

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   ```bash
   # Check security group allows your IP
   curl https://ipinfo.io/ip
   ```

2. **Application Not Loading**
   ```bash
   # Check Docker containers
   sudo docker-compose ps
   
   # Check Nginx
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Database Connection Issues**
   ```bash
   # Test from EC2
   nc -zv <db-endpoint> 5432
   
   # Check environment variables
   cat /opt/job-platform/.env
   ```

### Logs Location

- **Application**: `sudo docker-compose logs`
- **Nginx**: `/var/log/nginx/`
- **System**: `journalctl -u job-platform`

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will permanently delete all data and resources.

## Support

For issues with the deployment:
1. Check AWS CloudWatch logs
2. Review EC2 system logs
3. Check application logs via Docker
4. Verify security group configurations

## Files Description

- `main.tf`: Core infrastructure resources
- `variables.tf`: Input variables with validation
- `outputs.tf`: Resource outputs and connection info
- `security-groups.tf`: Network security rules
- `setup.sh`: EC2 initialization script
- `nginx.conf`: Reverse proxy configuration
- `terraform.tfvars.example`: Example variable values