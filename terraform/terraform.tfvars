# Unified infrastructure configuration — pom100.com frontend on EC2

# AWS
aws_region = "us-east-1"

# Project
project_name = "job-platform"
environment  = "dev"

# EC2
instance_type = "t3.small"

# SSH
# Regenerate with: ssh-keygen -t ed25519 -C "your-email@example.com"
# Then paste the contents of ~/.ssh/id_ed25519.pub below
ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINHt9i+pat/yJ6O2BbCWwa9I5nMV1c2+Alnjy1giTD4J xkhaloda@gmail.com"

# Security — restrict to your IP for better security, e.g. ["203.0.113.0/32"]
allowed_ssh_cidr_blocks = ["0.0.0.0/0"]
