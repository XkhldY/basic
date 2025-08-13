# Variables for minimal AWS deployment

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "job-platform"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Database Configuration
variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "jobplatform"
}

variable "db_user" {
  description = "PostgreSQL database username"
  type        = string
  default     = "dbadmin"
}

# Database password is now managed by AWS Secrets Manager
# No need to specify manually - AWS will generate and manage it

# SSH Configuration
variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
  
  validation {
    condition     = can(regex("^ssh-", var.ssh_public_key))
    error_message = "SSH public key must start with 'ssh-' (e.g., ssh-rsa, ssh-ed25519)."
  }
}

variable "allowed_ssh_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Change to your IP for better security
}

# Domain Configuration (Optional)
variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

# Application Configuration
variable "app_jwt_secret" {
  description = "JWT secret key for application authentication"
  type        = string
  sensitive   = true
  default     = "your-super-secret-jwt-key-change-this-in-production"
}

variable "app_email_smtp_server" {
  description = "SMTP server for email notifications"
  type        = string
  default     = "localhost"
}

variable "app_email_smtp_port" {
  description = "SMTP port for email notifications"
  type        = number
  default     = 587
}

variable "app_email_username" {
  description = "SMTP username for email notifications"
  type        = string
  default     = ""
}

variable "app_email_password" {
  description = "SMTP password for email notifications"
  type        = string
  sensitive   = true
  default     = ""
}

variable "app_from_email" {
  description = "From email address for notifications"
  type        = string
  default     = "noreply@jobplatform.com"
}