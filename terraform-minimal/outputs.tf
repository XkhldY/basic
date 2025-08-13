# Outputs for minimal AWS deployment

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

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.postgres.port
}

output "database_url" {
  description = "Complete PostgreSQL database URL"
  value       = "postgresql://${var.db_user}:${var.db_password}@${aws_db_instance.postgres.endpoint}:${aws_db_instance.postgres.port}/${var.db_name}"
  sensitive   = true
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
    https_domain  = var.domain_name != "" ? "https://${var.domain_name}" : "Configure domain in Route 53"
    http_domain   = var.domain_name != "" ? "http://${var.domain_name}" : "Configure domain in Route 53"
  }
}

output "route53_nameservers" {
  description = "Route 53 nameservers (if domain is configured)"
  value       = var.domain_name != "" ? aws_route53_zone.main[0].name_servers : []
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = [aws_subnet.private.id, aws_subnet.private_secondary.id]
}

output "security_group_app_id" {
  description = "ID of the application security group"
  value       = aws_security_group.app_sg.id
}

output "security_group_db_id" {
  description = "ID of the database security group"
  value       = aws_security_group.db_sg.id
}

# Deployment information
output "deployment_info" {
  description = "Deployment instructions and next steps"
  value = {
    step_1 = "SSH to server: ssh -i ~/.ssh/${var.project_name}-key ubuntu@${aws_eip.app_server.public_ip}"
    step_2 = "Check Docker status: sudo systemctl status docker"
    step_3 = "Navigate to app: cd /opt/job-platform"
    step_4 = "Start services: sudo docker-compose up -d"
    step_5 = "Check logs: sudo docker-compose logs -f"
    step_6 = "Setup SSL: sudo certbot --nginx -d ${var.domain_name != "" ? var.domain_name : "your-domain.com"}"
  }
}

# Cost estimation
output "estimated_monthly_cost" {
  description = "Estimated monthly cost breakdown"
  value = {
    ec2_t3_micro       = "$8.50 (after free tier)"
    rds_t3_micro       = "$13.50 (after free tier)"
    ebs_storage_30gb   = "$3.00"
    route53_hosted_zone = "$0.50"
    data_transfer_1gb  = "$0.00 (free tier)"
    total_after_free_tier = "$25.50/month"
    total_with_free_tier  = "$3.50/month (first year)"
    note = "Costs may vary based on usage and AWS pricing changes"
  }
}