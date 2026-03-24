# Terraform Merge TODO

## Steps

- [x] Read and analyze terraform-persistent/main.tf, variables.tf, outputs.tf, terraform.tfvars
- [x] Read and analyze terraform-compute/main.tf, variables.tf, outputs.tf, terraform.tfvars
- [x] Plan confirmed by user
- [x] Create terraform/main.tf (merged, EC2-only, no private subnets/RDS)
- [x] Create terraform/variables.tf (combined variables)
- [x] Create terraform/outputs.tf (combined outputs, includes pom100.com note)
- [x] Create terraform/terraform.tfvars (combined tfvars)
- [x] Create terraform/migrate-state.sh (import script to preserve existing resources)
- [x] Remove old terraform-persistent/ and terraform-compute/ directories
