# Example Terraform variables file
# Copy this to terraform.tfvars and customize the values

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "job-platform"
environment  = "dev"

# Database Configuration
db_name = "jobplatform"
db_user = "dbadmin"
# Note: Database password is now managed automatically by AWS Secrets Manager

# SSH Configuration
# Generate your SSH key with: ssh-keygen -t ed25519 -C "your-email@example.com"
# Then copy the public key from ~/.ssh/id_ed25519.pub
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGr5TI8zjcZCBcDZIo9P0zNe7w7/tKedwYabeWM8Ylq6 engkhaled87@gmail.com"

# Security Configuration
allowed_ssh_cidr_blocks = ["0.0.0.0/0"]  # Change to your IP for better security

# Domain Configuration (Optional)
# If you have a domain, uncomment and set it:
# domain_name = "jobplatform.example.com"

# Application Configuration
app_jwt_secret = "your-super-secret-jwt-key-change-this-in-production"

# Email Configuration (Optional - configure based on your SMTP provider)
# app_email_smtp_server = "smtp.gmail.com"
# app_email_smtp_port   = 587
# app_email_username    = "your-email@gmail.com"
# app_email_password    = "your-app-password"
# app_from_email        = "noreply@jobplatform.com"