# Persistent Infrastructure Configuration
# This file configures the long-term infrastructure (database, VPC, networking)

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "job-platform"
environment  = "dev"

# Database Configuration
db_name = "jobplatform"
db_user = "dbadmin"
# Note: Database password is managed automatically by AWS Secrets Manager