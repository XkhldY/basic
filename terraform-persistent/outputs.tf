# Outputs for Persistent Infrastructure
# These values will be used by the compute infrastructure

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet for EC2 instances"
  value       = aws_subnet.public.id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets for RDS"
  value       = [aws_subnet.private.id, aws_subnet.private_secondary.id]
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.postgres.port
}

output "database_secret_arn" {
  description = "ARN of the RDS master user secret in Secrets Manager"
  value       = aws_db_instance.postgres.master_user_secret[0].secret_arn
  sensitive   = true
}

output "db_security_group_id" {
  description = "ID of the database security group"
  value       = aws_security_group.db_sg.id
}

output "kms_key_arn" {
  description = "ARN of the KMS key for encryption"
  value       = aws_kms_key.secrets_manager.arn
}

# Networking information for compute infrastructure
output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_cidr" {
  description = "CIDR block of the public subnet"
  value       = aws_subnet.public.cidr_block
}

# Database connection information
output "database_url_template" {
  description = "Database URL template (password will be retrieved from Secrets Manager)"
  value       = "postgresql://${var.db_user}:PLACEHOLDER_PASSWORD@${aws_db_instance.postgres.endpoint}/${var.db_name}"
}

# Infrastructure summary
output "persistent_infrastructure_summary" {
  description = "Summary of persistent infrastructure"
  value = {
    vpc_id              = aws_vpc.main.id
    database_endpoint   = aws_db_instance.postgres.endpoint
    database_name       = var.db_name
    database_user       = var.db_user
    public_subnet       = aws_subnet.public.id
    private_subnets     = [aws_subnet.private.id, aws_subnet.private_secondary.id]
    kms_key            = aws_kms_key.secrets_manager.arn
    db_security_group  = aws_security_group.db_sg.id
  }
}

# S3 File Storage outputs
output "s3_bucket_name_dev" {
  description = "Name of the S3 bucket for development file storage"
  value       = aws_s3_bucket.file_storage_dev.bucket
}

output "s3_bucket_arn_dev" {
  description = "ARN of the S3 bucket for development file storage"
  value       = aws_s3_bucket.file_storage_dev.arn
}

output "s3_bucket_name_prod" {
  description = "Name of the S3 bucket for production file storage"
  value       = aws_s3_bucket.file_storage_prod.bucket
}

output "s3_bucket_arn_prod" {
  description = "ARN of the S3 bucket for production file storage"
  value       = aws_s3_bucket.file_storage_prod.arn
}

output "s3_file_access_policy_arn" {
  description = "ARN of the IAM policy for S3 file access"
  value       = aws_iam_policy.s3_file_access.arn
}