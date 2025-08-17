# Variables for Persistent Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
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

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "jobplatform"
}

variable "db_user" {
  description = "Master username for the PostgreSQL database"
  type        = string
  default     = "dbadmin"
}