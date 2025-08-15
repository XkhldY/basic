# Terraform configuration for minimal cost AWS deployment
# Estimated cost: $15-25/month

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

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
  }
}

# Public Subnet for EC2
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet"
    Environment = var.environment
  }
}

# Private Subnet for RDS
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name        = "${var.project_name}-private-subnet"
    Environment = var.environment
  }
}

# Additional private subnet for RDS (required for DB subnet group)
resource "aws_subnet" "private_secondary" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name        = "${var.project_name}-private-subnet-2"
    Environment = var.environment
  }
}

# Route Table for Public Subnet
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.project_name}-public-rt"
    Environment = var.environment
  }
}

# Route Table Association for Public Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Key Pair for EC2 access
resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-key"
    Environment = var.environment
  }
}

# Elastic IP for EC2 instance
resource "aws_eip" "app_server" {
  domain = "vpc"
  
  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
  }
}

# EC2 Instance for Frontend + Backend
resource "aws_instance" "app_server" {
  ami                    = "ami-0866a3c8686eaeeba" # Ubuntu 22.04 LTS (us-east-1)
  instance_type          = "t3.micro"              # Free tier eligible
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = aws_subnet.public.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  # Increased storage for Docker images and application files
  root_block_device {
    volume_type = "gp2"
    volume_size = 30
    encrypted   = true

    tags = {
      Name        = "${var.project_name}-root-volume"
      Environment = var.environment
    }
  }

  user_data = base64encode(file("${path.module}/setup-minimal.sh"))

  # Force recreation when user data changes
  user_data_replace_on_change = true

  # Lifecycle configuration for zero-downtime deployments
  lifecycle {
    create_before_destroy = true
    replace_triggered_by = [
      # Force recreation when setup script changes
      file("${path.module}/setup-minimal.sh")
    ]
  }

  tags = {
    Name        = "${var.project_name}-app-server"
    Environment = var.environment
  }
}

# Associate Elastic IP with EC2 instance
resource "aws_eip_association" "app_server" {
  instance_id   = aws_instance.app_server.id
  allocation_id = aws_eip.app_server.id
}

# DB Subnet Group for RDS
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.private_secondary.id]

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

# KMS Key for encrypting Secrets Manager secrets
resource "aws_kms_key" "secrets_manager" {
  description             = "KMS key for ${var.project_name} Secrets Manager"
  deletion_window_in_days = 7
  
  tags = {
    Name        = "${var.project_name}-secrets-kms"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "secrets_manager" {
  name          = "alias/${var.project_name}-secrets"
  target_key_id = aws_kms_key.secrets_manager.key_id
}

# RDS PostgreSQL Instance with Secrets Manager
resource "aws_db_instance" "postgres" {
  identifier = "${var.project_name}-db"
  
  # Database configuration
  allocated_storage     = 20           # Free tier limit
  max_allocated_storage = 100          # Auto-scaling limit
  storage_type          = "gp2"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.secrets_manager.arn
  
  # Engine configuration  
  engine              = "postgres"
  engine_version      = "15.13"
  instance_class      = "db.t3.micro"  # Free tier eligible
  
  # Database credentials - managed by AWS Secrets Manager
  db_name                     = var.db_name
  username                    = var.db_user
  manage_master_user_password = true
  master_user_secret_kms_key_id = aws_kms_key.secrets_manager.key_id
  
  # Network and security
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  publicly_accessible    = false
  
  # Backup and maintenance
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Performance and monitoring
  performance_insights_enabled = false  # Not available in free tier
  monitoring_interval         = 0       # Disable enhanced monitoring to save costs
  
  # Deletion protection
  skip_final_snapshot = true  # Set to false in production
  deletion_protection = false # Set to true in production

  tags = {
    Name        = "${var.project_name}-database"
    Environment = var.environment
  }
}

# Note: App secrets temporarily removed due to deletion conflict
# Can be re-added later with different name if needed

# Route 53 Hosted Zone (if domain is provided)
resource "aws_route53_zone" "main" {
  count = var.domain_name != "" ? 1 : 0
  name  = var.domain_name

  tags = {
    Name        = "${var.project_name}-zone"
    Environment = var.environment
  }
}

# Route 53 A Record pointing to Elastic IP
resource "aws_route53_record" "app" {
  count   = var.domain_name != "" ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.app_server.public_ip]
}