 Git Merge and Terraform Redeployment Plan                                                    │
     │                                                                                              │
     │ Current Status Analysis:                                                                     │
     │ - Currently on claude-auto branch with working AWS deployment                                │
     │ - Key changes made:                                                                          │
     │   - Frontend API URL fixed: http://54.165.55.106:8000 (currently hardcoded)                  │
     │   - Terraform configuration updated with working setup script                                │
     │   - Multiple deployment files created (.env.production, docker-compose files, etc.)          │
     │   - SSH keys generated for EC2 access                                                        │
     │                                                                                              │
     │ Plan Steps:                                                                                  │
     │                                                                                              │
     │ 1. Clean Up and Prepare Files                                                                │
     │                                                                                              │
     │ - Add important production files to git (.env.production, docker-compose.production.yml)     │
     │ - Revert hardcoded API URL in frontend/src/lib/api.ts to use environment variable properly   │
     │ - Update .gitignore to exclude sensitive files (SSH keys, terraform state)                   │
     │ - Clean up temporary deployment files                                                        │
     │                                                                                              │
     │ 2. Commit Changes                                                                            │
     │                                                                                              │
     │ - Stage essential changes (terraform config, frontend environment setup, production configs) │
     │ - Commit with message: "Fix frontend API configuration and production deployment setup"      │
     │                                                                                              │
     │ 3. Merge to Main Branch                                                                      │
     │                                                                                              │
     │ - Switch to main branch                                                                      │
     │ - Merge claude-auto branch                                                                   │
     │ - Push to origin/main                                                                        │
     │                                                                                              │
     │ 4. Update Terraform for Proper Deployment                                                    │
     │                                                                                              │
     │ - Update terraform configuration to use proper environment variables                         │
     │ - Ensure setup script includes correct API URL configuration                                 │
     │ - Make deployment reproducible and automated                                                 │
     │                                                                                              │
     │ 5. Redeploy via Terraform                                                                    │
     │                                                                                              │
     │ - Run terraform destroy to clean up current instance (optional, safer approach)              │
     │ - Run terraform apply to deploy with merged code                                             │
     │ - Verify all services work correctly with proper configuration                               │
     │                                                                                              │
     │ Key Benefits:                                                                                │
     │ - Clean, version-controlled deployment                                                       │
     │ - Proper environment variable usage instead of hardcoded values                              │
     │ - Automated deployment that others can reproduce                                             │
     │ - Merge preserves all working functionality while making it maintainable                     │
     │                                                                                              │
     │ Files to Include in Commit:                                                                  │
     │ - frontend/src/lib/api.ts (reverted to use env vars properly)                                │
     │ - frontend/.env.production                                                                   │
     │ - docker-compose.production.yml                                                              │
     │ - terraform-minimal/main.tf                                                                  │
     │ - backend/.env.production                                                                    │
     │                                                                                              │
     │ Files to Exclude:                                                                            │
     │ - SSH keys                                                                                   │
     │ - terraform.tfstate files                                                                    │
     │ - Temporary deployment scripts                                                               │
     │ - .next build artifacts                                                                   │
     │                                                                                           │
     │ ## Infrastructure and Database Setup Fix Plan                                             │
     │                                                                                           │
     │ ### Current Issues Identified:                                                            │
     │ 1. **AMI/OS Mismatch**: Setup script uses Ubuntu commands (`apt-get`) but instance runs Amazon Linux │
     │ 2. **Empty Database**: No table creation or migration process in deployment               │  
     │ 3. **Failed Application Deployment**: Setup script crashed, so no app is actually running │
     │                                                                                           │
     │ ### Root Cause Analysis:                                                                  │
     │ - Terraform main.tf uses AMI `ami-0c02fb55956c7d316` (Amazon Linux)                       │
     │ - Setup script setup-working.sh uses Ubuntu/Debian commands (apt-get, ubuntu user)       │
     │ - No database migration step included in deployment process                               │
     │ - RDS password placeholder never replaced with actual AWS Secrets Manager value          │
     │                                                                                           │
     │ ### Technical Solutions Required:                                                         │
     │                                                                                           │
     │ #### Infrastructure Fixes (Terraform):                                                   │
     │ - Change AMI from `ami-0c02fb55956c7d316` to Ubuntu 22.04 LTS (`ami-0866a3c8686eaeeba`)   │
     │ - Update setup script to include database migration commands                              │
     │ - Add AWS Secrets Manager integration for RDS password retrieval                         │
     │ - Ensure proper user permissions (ubuntu user vs ec2-user)                               │
     │                                                                                           │
     │ #### Database Migration Automation:                                                       │
     │ - Modify docker-compose to include migration init container                               │
     │ - Update backend Dockerfile with Alembic migration commands                               │
     │ - Add health checks to ensure proper startup sequence                                     │
     │ - Replace placeholder database password with actual secret value                         │
     │                                                                                           │
     │ #### Application Deployment Flow:                                                         │
     │ 1. EC2 instance starts with correct Ubuntu AMI                                            │
     │ 2. Setup script installs dependencies using apt-get (works correctly)                     │
     │ 3. Retrieve RDS password from AWS Secrets Manager                                         │
     │ 4. Update .env file with actual database credentials                                      │
     │ 5. Start Docker containers with proper database connection                                │
     │ 6. Run Alembic migrations to create all database tables                                   │
     │ 7. Application ready with fully initialized database                                      │
     │                                                                                           │
     │ #### Files to Modify:                                                                     │
     │ - `terraform-minimal/main.tf` (AMI change to Ubuntu)                                      │
     │ - `terraform-minimal/setup-working.sh` (add migrations + secrets retrieval)              │
     │ - Backend Docker configuration (ensure Alembic is available)                              │
     │ - docker-compose.prod.yml (add migration init container)                                  │
     │                                                                                           │
     │ #### Expected Outcome:                                                                    │
     │ - Fully automated infrastructure deployment                                               │
     │ - Database tables created automatically via migrations                                    │
     │ - No manual intervention required for setup                                               │
     │ - Proper secrets management integration                                                   │
     │ - Application accessible with working database connection                                 │