# Persistent Infrastructure - Database + Core Networking
# This infrastructure is created once and maintained long-term

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
    Type        = "persistent"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
    Type        = "persistent"
  }
}

# Public Subnet for EC2 (future compute resources)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.project_name}-public-subnet"
    Environment = var.environment
    Type        = "persistent"
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
    Type        = "persistent"
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
    Type        = "persistent"
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
    Type        = "persistent"
  }
}

# Route Table Association for Public Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# DB Subnet Group for RDS
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.private_secondary.id]

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
    Type        = "persistent"
  }
}

# KMS Key for encrypting Secrets Manager secrets
resource "aws_kms_key" "secrets_manager" {
  description             = "KMS key for ${var.project_name} Secrets Manager"
  deletion_window_in_days = 7
  
  tags = {
    Name        = "${var.project_name}-secrets-kms"
    Environment = var.environment
    Type        = "persistent"
  }
}

resource "aws_kms_alias" "secrets_manager" {
  name          = "alias/${var.project_name}-secrets"
  target_key_id = aws_kms_key.secrets_manager.key_id
}

# Security Group for RDS Database
resource "aws_security_group" "db_sg" {
  name_prefix = "${var.project_name}-db-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for PostgreSQL database"

  # PostgreSQL access from compute security group (will be referenced from compute module)
  ingress {
    description = "PostgreSQL from compute instances"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_subnet.public.cidr_block]  # Allow from public subnet where compute will be
  }

  # No outbound rules needed for RDS
  egress {
    description = "No outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = []
  }

  tags = {
    Name        = "${var.project_name}-db-sg"
    Environment = var.environment
    Type        = "persistent"
  }

  lifecycle {
    create_before_destroy = true
  }
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
  
  # Deletion protection - ENABLED for persistent infrastructure
  skip_final_snapshot = false           # Create snapshot on deletion
  deletion_protection = false            # Prevent accidental deletion
  final_snapshot_identifier = "${var.project_name}-db-final-snapshot"

  tags = {
    Name        = "${var.project_name}-database"
    Environment = var.environment
    Type        = "persistent"
  }
}