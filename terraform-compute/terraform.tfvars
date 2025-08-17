# Compute Infrastructure Configuration
# This file configures the dynamic compute resources (EC2, security groups)

# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "job-platform"
environment  = "dev"

# SSH Configuration
# Generate your SSH key with: ssh-keygen -t ed25519 -C "your-email@example.com"
# Then copy the public key from ~/.ssh/id_ed25519.pub
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCa44Fm6ckZAERzR5kMxta6VTqrPgV/9y5W8Zx00sEQCAsLNb9VFgUBi/Ylj/1b7tPho8LWOlXKVMoQkDE00cI6kUTpEtXqpAUsdloXHnsIbiAmrs65z4ifSyQMVbgzZukeH9oGNJYukXxg16szpJAZMATyzZTc7gtaMwFf6q/BOhZzm0fn4UhrLLb56/v27s5tw8hpOt2AnBpuRp+07aZPLaMlfDb5+ehGxGuIMn9zCc7vmmr7jFFWoWE1QJH6IyPYuDiY7l6kWQv1tUCvcK5BhxP7tdNS/wrIhFNdU3m0rHCp/is3Latd5YrmlcNyObQlgue+6rQyaHh1SmZNj5216FESN2KvWJzFsoKfcjpJOr3scGS9aZKO0gMaX/MaYi56jEfUh/JrvM/PyC2VCVsu1RGJeeOr/wi+zPlJ/09HX1ljvVWxPgmGjABTxW2NoG0Fpu3VXWDpo8q8KymSNYVPSQD6SifcdE4UhdumoysM0YpWdJ6VkBxIkKnt5SGCFqFY+y38UNBxnmHxJTUHh2TvjI47l4D15CixLuTABUcKs51eIQLLw+eFg77Xyzm6TmhriIYeFSuthThir4R45+qLrSbwGSITrOb0ufjS2U6bp2LT8Njq33OsslBFpJSlJb070NQ88SgUrxtodatxmE4haq4zVMt9saFHpdSGastPgw== khaled@MacBook-Pro.local"

# Security Configuration
allowed_ssh_cidr_blocks = ["0.0.0.0/0"]  # Change to your IP for better security