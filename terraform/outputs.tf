# Outputs — unified infrastructure

# ---------------------------------------------------------------------------
# Networking
# ---------------------------------------------------------------------------

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

# ---------------------------------------------------------------------------
# EC2 / Application
# ---------------------------------------------------------------------------

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "ec2_public_ip" {
  description = "Elastic (static) public IP — point pom100.com A record here"
  value       = aws_eip.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = "ssh -i ~/.ssh/${var.project_name}-key ubuntu@${aws_eip.app_server.public_ip}"
}

output "application_urls" {
  description = "URLs to access the frontend"
  value = {
    http     = "http://${aws_eip.app_server.public_ip}"
    https    = "https://pom100.com"
    dev_port = "http://${aws_eip.app_server.public_ip}:3000"
  }
}

output "deployment_info" {
  description = "Full deployment summary"
  value = {
    ec2_instance_id = aws_instance.app_server.id
    elastic_ip      = aws_eip.app_server.public_ip
    domain          = "pom100.com"
    ssh_key         = "${var.project_name}-key"
    ssh_command     = "ssh -i ~/.ssh/${var.project_name}-key ubuntu@${aws_eip.app_server.public_ip}"
    frontend_url    = "https://pom100.com"
  }
}

# ---------------------------------------------------------------------------
# IAM — Marie deployer
# ---------------------------------------------------------------------------

output "marie_iam_user_name" {
  description = "Name of Marie's IAM user"
  value       = aws_iam_user.marie_deployer.name
}

output "marie_iam_user_arn" {
  description = "ARN of Marie's IAM user"
  value       = aws_iam_user.marie_deployer.arn
}

output "marie_access_key_id" {
  description = "Access Key ID for Marie's deployment access"
  value       = aws_iam_access_key.marie_deployer.id
}

output "marie_secret_access_key" {
  description = "Secret Access Key for Marie's deployment access"
  value       = aws_iam_access_key.marie_deployer.secret
  sensitive   = true
}

output "deployers_group_name" {
  description = "Name of the deployers IAM group"
  value       = aws_iam_group.deployers.name
}
