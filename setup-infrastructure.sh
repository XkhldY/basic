#!/bin/bash

set -e

echo "=== Job Platform Infrastructure Setup ==="
echo "This script sets up the separated infrastructure architecture:"
echo "1. Persistent infrastructure (database, VPC) - created once"
echo "2. Compute infrastructure (EC2, security groups) - can be recreated"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if persistent infrastructure exists
if [ ! -f "terraform-persistent/terraform.tfstate" ]; then
    print_header "Setting up Persistent Infrastructure"
    print_status "Creating database, VPC, and core networking..."
    
    cd terraform-persistent
    terraform init
    terraform apply -auto-approve
    cd ..
    
    print_status "✅ Persistent infrastructure created successfully!"
    terraform -chdir=terraform-persistent output persistent_infrastructure_summary
    echo ""
else
    print_status "✅ Persistent infrastructure already exists"
    terraform -chdir=terraform-persistent output persistent_infrastructure_summary
    echo ""
fi

# Setup compute infrastructure
print_header "Setting up Compute Infrastructure"
print_status "Creating EC2 instance and security groups..."

cd terraform-compute
terraform init

# Refresh the data sources to ensure persistent outputs are available
print_status "Refreshing remote state data..."
terraform refresh

# Now apply the compute infrastructure
terraform apply -auto-approve
cd ..

print_status "✅ Compute infrastructure created successfully!"
terraform -chdir=terraform-compute output deployment_info
echo ""

# Display next steps
print_header "Infrastructure Setup Complete!"
echo ""
print_status "✅ Database and persistent resources: Safe and protected"
print_status "✅ Compute resources: Ready for application deployment"
echo ""
print_warning "Next steps:"
echo "1. Deploy your application:"
echo "   ./deploy-automated.sh"
echo ""
echo "2. To rebuild just compute resources (if needed):"
echo "   cd terraform-compute && terraform apply"
echo ""
echo "3. To destroy only compute resources (keeps database safe):"
echo "   cd terraform-compute && terraform destroy"
echo ""
print_status "🎉 Your infrastructure is ready!"