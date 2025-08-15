# 🚀 Complete AWS Deployment Guide

## ✅ Prerequisites Status
- ✅ **Terraform**: Installed and initialized
- ✅ **AWS CLI**: Configured with valid credentials  
- ✅ **SSH Key**: Generated and configured
- ✅ **Configuration**: terraform.tfvars ready

## 🔧 Step-by-Step AWS Deployment

### Step 1: Set AWS Region
```bash
export AWS_DEFAULT_REGION=us-east-1
```

### Step 2: Plan Terraform Deployment
```bash
# Review what will be created
terraform plan
```

### Step 3: Deploy Infrastructure
```bash
# Deploy AWS infrastructure (EC2, RDS, VPC, etc.)
terraform apply -auto-approve
```

### Step 4: Get Deployment Information
```bash
# Get the public IP of your EC2 instance
terraform output ec2_public_ip

# Get all deployment information
terraform output
```

### Step 5: Deploy Application
```bash
# Go back to project root
cd ..

# Run the automated deployment script
./deploy-with-dynamic-ip.sh
```

## 📋 What Gets Created in AWS

### Infrastructure Components:
- **VPC**: Custom virtual private cloud with public/private subnets
- **EC2 Instance**: t3.micro Ubuntu server with Elastic IP
- **RDS Database**: PostgreSQL t3.micro with automated password management
- **Security Groups**: Firewall rules for web traffic and database access
- **IAM Roles**: EC2 permissions to access Secrets Manager
- **Route 53** (optional): DNS configuration if domain provided

### Cost Breakdown:
- **EC2 t3.micro**: $0-8/month (free tier eligible)
- **RDS t3.micro**: $0-13/month (free tier eligible)  
- **EBS Storage (30GB)**: ~$3/month
- **Elastic IP**: $0/month (when attached)
- **Total**: $3-25/month depending on free tier eligibility

## 🎯 Access Your Application

After successful deployment:

1. **Frontend**: `http://YOUR_EC2_IP:3000`
2. **Backend API**: `http://YOUR_EC2_IP:8000`
3. **API Documentation**: `http://YOUR_EC2_IP:8000/docs`
4. **SSH Access**: `ssh -i terraform-minimal/job-platform-key ubuntu@YOUR_EC2_IP`

## 🛠 Troubleshooting Common Issues

### Issue 1: SSH Connection Refused
```bash
# Wait for EC2 instance to fully boot (2-3 minutes)
# Then test SSH connectivity
ssh -i terraform-minimal/job-platform-key ubuntu@$(terraform output -raw ec2_public_ip) "echo 'Connection successful'"
```

### Issue 2: Terraform Permission Errors  
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check region is set
echo $AWS_DEFAULT_REGION
```

### Issue 3: Frontend CORS Errors
The deployment script automatically configures CORS origins. If you see CORS errors:
```bash
# Re-run deployment to fix configuration
./deploy-with-dynamic-ip.sh
```

### Issue 4: Database Connection Issues
```bash
# Check RDS endpoint
terraform output rds_endpoint

# Verify security groups allow EC2 to RDS connection
aws ec2 describe-security-groups --group-ids $(terraform output -raw security_group_db_id)
```

## 🔄 Redeployment Process

### For Infrastructure Changes:
```bash
# Modify terraform files, then:
terraform plan
terraform apply
```

### For Application Updates:
```bash
# Just run the deployment script
./deploy-with-dynamic-ip.sh
```

### Complete Restart:
```bash
# Destroy everything (THIS DELETES YOUR DATA)
terraform destroy

# Deploy fresh
terraform apply -auto-approve
./deploy-with-dynamic-ip.sh
```

## 🔐 Security Best Practices

### 1. Restrict SSH Access
Edit `terraform.tfvars`:
```hcl
allowed_ssh_cidr_blocks = ["YOUR_PUBLIC_IP/32"]  # Replace with your IP
```

### 2. Use Strong Secrets
The system uses AWS Secrets Manager for database passwords, but update:
```hcl
app_jwt_secret = "your-unique-complex-jwt-secret-here"
```

### 3. Enable HTTPS (Optional)
After deployment, you can add SSL:
```bash
# SSH to your server
ssh -i terraform-minimal/job-platform-key ubuntu@$(terraform output -raw ec2_public_ip)

# Install Certbot and configure SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring & Logs

### View Application Logs:
```bash
# SSH to server
ssh -i terraform-minimal/job-platform-key ubuntu@$(terraform output -raw ec2_public_ip)

# Check Docker containers
sudo docker-compose -f docker-compose.prod.yml ps

# View logs
sudo docker-compose -f docker-compose.prod.yml logs frontend
sudo docker-compose -f docker-compose.prod.yml logs backend
```

### Check System Resources:
```bash
# On your EC2 instance
htop          # CPU/Memory usage
df -h         # Disk usage
free -h       # Memory details
```

## ⚡ Quick Commands Reference

```bash
# Get current EC2 IP
terraform output -raw ec2_public_ip

# SSH to server
ssh -i terraform-minimal/job-platform-key ubuntu@$(terraform output -raw ec2_public_ip)

# Redeploy application
./deploy-with-dynamic-ip.sh

# View infrastructure costs
terraform output estimated_monthly_cost

# Get database connection info
terraform output rds_endpoint
```

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ `terraform apply` completes without errors
- ✅ You can SSH to the EC2 instance
- ✅ Frontend loads at `http://YOUR_IP:3000`
- ✅ Backend API responds at `http://YOUR_IP:8000/docs`
- ✅ You can register/login users through the frontend

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in `/var/log/setup.log` on the EC2 instance
3. Verify all prerequisites are met
4. Try rerunning the deployment script

---
*This deployment creates a production-ready job platform on AWS with automatic scaling capabilities and secure database management.*