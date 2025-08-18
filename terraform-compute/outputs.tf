# Outputs for Compute Infrastructure

output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/${var.project_name}-key ubuntu@${aws_eip.app_server.public_ip}"
}

output "application_urls" {
  description = "URLs to access the application"
  value = {
    frontend_dev  = "http://${aws_eip.app_server.public_ip}:3000"
    backend_api   = "http://${aws_eip.app_server.public_ip}:8000"
    api_docs      = "http://${aws_eip.app_server.public_ip}:8000/docs"
  }
}

# Database connection info from persistent infrastructure
output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint from persistent infrastructure"
  value       = data.terraform_remote_state.persistent.outputs.rds_endpoint
}

output "rds_port" {
  description = "RDS PostgreSQL port from persistent infrastructure"
  value       = data.terraform_remote_state.persistent.outputs.rds_port
}

output "db_secret_arn" {
  description = "Database secret ARN from persistent infrastructure"
  value       = data.terraform_remote_state.persistent.outputs.database_secret_arn
  sensitive   = true
}

# Complete deployment information
output "deployment_info" {
  description = "Complete deployment information combining persistent and compute resources"
  value = {
    # Compute resources
    ec2_ip        = aws_eip.app_server.public_ip
    ec2_instance  = aws_instance.app_server.id
    ssh_key       = "${var.project_name}-key"
    
    # Database resources
    db_endpoint   = data.terraform_remote_state.persistent.outputs.rds_endpoint
    db_secret_arn = data.terraform_remote_state.persistent.outputs.database_secret_arn
    
    # Application URLs
    frontend_url  = "http://${aws_eip.app_server.public_ip}:3000"
    backend_url   = "http://${aws_eip.app_server.public_ip}:8000"
    api_docs_url  = "http://${aws_eip.app_server.public_ip}:8000/docs"
    
    # SSH access
    ssh_command   = "ssh -i ~/.ssh/${var.project_name}-key ubuntu@${aws_eip.app_server.public_ip}"
  }
}