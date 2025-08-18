# Dynamic Compute Infrastructure - EC2 + Security Groups
# This infrastructure can be rebuilt/destroyed without affecting the database

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Data sources to reference persistent infrastructure
data "terraform_remote_state" "persistent" {
  backend = "local"
  config = {
    path = "../terraform-persistent/terraform.tfstate"
  }
}

# Key Pair for EC2 access
resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-key"
    Environment = var.environment
    Type        = "compute"
  }
}

# Elastic IP for EC2 instance
resource "aws_eip" "app_server" {
  domain = "vpc"
  
  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
    Type        = "compute"
  }
}

# Security Group for EC2 Application Server
resource "aws_security_group" "app_sg" {
  name_prefix = "${var.project_name}-app-"
  vpc_id      = data.terraform_remote_state.persistent.outputs.vpc_id
  description = "Security group for application server"

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  # HTTP access
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend development port
  ingress {
    description = "Frontend Dev"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API port
  ingress {
    description = "Backend API"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-app-sg"
    Environment = var.environment
    Type        = "compute"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# IAM Role for EC2 to access Secrets Manager
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-ec2-role"
    Environment = var.environment
    Type        = "compute"
  }
}

# IAM Policy for accessing Secrets Manager
resource "aws_iam_role_policy" "ec2_secrets_policy" {
  name = "${var.project_name}-ec2-secrets-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = data.terraform_remote_state.persistent.outputs.database_secret_arn
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = data.terraform_remote_state.persistent.outputs.kms_key_arn
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = {
    Name        = "${var.project_name}-ec2-profile"
    Environment = var.environment
    Type        = "compute"
  }
}

# EC2 Instance for Frontend + Backend
resource "aws_instance" "app_server" {
  ami                    = "ami-0866a3c8686eaeeba" # Ubuntu 22.04 LTS (us-east-1)
  instance_type          = "t3.micro"              # Free tier eligible
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = data.terraform_remote_state.persistent.outputs.public_subnet_id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  # Increased storage for Docker images and application files
  root_block_device {
    volume_type = "gp2"
    volume_size = 30
    encrypted   = true

    tags = {
      Name        = "${var.project_name}-root-volume"
      Environment = var.environment
      Type        = "compute"
    }
  }

  # Minimal user data - just log readiness
  user_data = base64encode("#!/bin/bash\necho 'EC2 ready for deployment' > /var/log/ec2-ready.log")

  # Force recreation when user data changes
  user_data_replace_on_change = true

  tags = {
    Name        = "${var.project_name}-app-server"
    Environment = var.environment
    Type        = "compute"
  }
}

# Associate Elastic IP with EC2 instance
resource "aws_eip_association" "app_server" {
  instance_id   = aws_instance.app_server.id
  allocation_id = aws_eip.app_server.id
}