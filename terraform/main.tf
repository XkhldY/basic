# Infrastructure - VPC + EC2 Frontend Deployment
# Single unified Terraform configuration for hirewithpom.com frontend on EC2

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

# ---------------------------------------------------------------------------
# Networking
# ---------------------------------------------------------------------------

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.project_name}-igw"
    Environment = var.environment
  }
}

# Single public subnet — EC2 lives here
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

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ---------------------------------------------------------------------------
# IAM — Marie deployer user
# ---------------------------------------------------------------------------

resource "aws_iam_user" "marie_deployer" {
  name = "${var.project_name}-marie-deployer"

  tags = {
    Name      = "${var.project_name}-marie-deployer"
    Owner     = "Marie"
    AccountID = "154989746316"
  }
}

resource "aws_iam_user_policy" "marie_deployer_policy" {
  name = "${var.project_name}-marie-deployer-policy"
  user = aws_iam_user.marie_deployer.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:*",
          "cloudwatch:*",
          "logs:*",
          "iam:PassRole",
          "iam:GetRole",
          "iam:GetUser",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListAttachedUserPolicies",
          "iam:ListUserPolicies"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_access_key" "marie_deployer" {
  user = aws_iam_user.marie_deployer.name
}

resource "aws_iam_group" "deployers" {
  name = "${var.project_name}-deployers"
}

resource "aws_iam_user_group_membership" "marie_deployers" {
  user   = aws_iam_user.marie_deployer.name
  groups = [aws_iam_group.deployers.name]
}

# ---------------------------------------------------------------------------
# EC2 — Key pair, security group, IAM role, instance, Elastic IP
# ---------------------------------------------------------------------------

resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key

  tags = {
    Name        = "${var.project_name}-key"
    Environment = var.environment
  }
}

# Elastic IP — kept stable so pom100.com DNS record never needs updating
resource "aws_eip" "app_server" {
  domain = "vpc"

  tags = {
    Name        = "${var.project_name}-eip"
    Environment = var.environment
    Domain      = "pom100.com"
  }
}

resource "aws_security_group" "app_sg" {
  name_prefix = "${var.project_name}-app-"
  vpc_id      = aws_vpc.main.id
  description = "Security group for frontend application server"

  # SSH (standard + alternate for networks that block port 22)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }
  ingress {
    description = "SSH alternate (2222)"
    from_port   = 2222
    to_port     = 2222
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr_blocks
  }

  # HTTP / HTTPS — served by Nginx reverse proxy
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Next.js dev / direct access
  ingress {
    description = "Frontend port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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
  }

  lifecycle {
    create_before_destroy = true
  }
}

# IAM role attached to the EC2 instance (enables SSM Session Manager)
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
  }
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = {
    Name        = "${var.project_name}-ec2-profile"
    Environment = var.environment
  }
}

resource "aws_instance" "app_server" {
  ami                    = "ami-0866a3c8686eaeeba" # Ubuntu 22.04 LTS (us-east-1)
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  subnet_id              = aws_subnet.public.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  root_block_device {
    volume_type = "gp2"
    volume_size = 30
    encrypted   = true

    tags = {
      Name        = "${var.project_name}-root-volume"
      Environment = var.environment
    }
  }

  # Enable SSH on port 22 and 2222 (fallback for networks that block 22)
  user_data = base64encode(<<-EOT
#!/bin/bash
set -e
echo 'EC2 ready for deployment' > /var/log/ec2-ready.log
if ! grep -q '^Port 2222' /etc/ssh/sshd_config 2>/dev/null; then
  sed -i 's/^#Port 22/Port 22/' /etc/ssh/sshd_config
  echo 'Port 2222' >> /etc/ssh/sshd_config
  systemctl restart ssh || true
  echo 'SSH ports 22 and 2222 enabled' >> /var/log/ec2-ready.log
fi
EOT
  )

  user_data_replace_on_change = true

  tags = {
    Name        = "${var.project_name}-app-server"
    Environment = var.environment
    Domain      = "pom100.com"
  }
}

resource "aws_eip_association" "app_server" {
  instance_id   = aws_instance.app_server.id
  allocation_id = aws_eip.app_server.id
}
