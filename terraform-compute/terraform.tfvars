# Compute Infrastructure Configuration
# This file configures the dynamic compute resources (EC2, security groups)

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "job-platform"
environment  = "dev"

# SSH Configuration
# Generate your SSH key with: ssh-keygen -t ed25519 -C "your-email@example.com"
# Then copy the public key from ~/.ssh/id_ed25519.pub
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINHt9i+pat/yJ6O2BbCWwa9I5nMV1c2+Alnjy1giTD4J xkhaloda@gmail.com"

# Security Configuration
allowed_ssh_cidr_blocks = ["0.0.0.0/0"]  # Change to your IP for better security