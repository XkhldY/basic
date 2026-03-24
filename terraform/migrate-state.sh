#!/bin/bash
# =============================================================================
# migrate-state.sh
# Import existing AWS resources into the new unified terraform/ state so that
# nothing is destroyed or recreated — especially the Elastic IP that
# pom100.com points to.
#
# Usage:
#   1. Fill in the RESOURCE IDs below (get them from AWS Console or CLI).
#   2. cd terraform/
#   3. terraform init
#   4. bash migrate-state.sh
#   5. terraform plan   ← should show 0 changes if all IDs are correct
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# !! FILL THESE IN before running !!
# ---------------------------------------------------------------------------

# Networking (from terraform-persistent state / AWS Console → VPC)
VPC_ID=""                    # e.g. vpc-0abc123
IGW_ID=""                    # e.g. igw-0abc123
PUBLIC_SUBNET_ID=""          # e.g. subnet-0abc123
ROUTE_TABLE_ID=""            # e.g. rtb-0abc123

# EC2 (from terraform-compute state / AWS Console → EC2)
INSTANCE_ID=""               # e.g. i-0abc123
EIP_ALLOC_ID=""              # e.g. eipalloc-0abc123  (NOT the IP address)
EIP_ASSOC_ID=""              # e.g. eipassoc-0abc123
SECURITY_GROUP_ID=""         # e.g. sg-0abc123
KEY_PAIR_NAME="job-platform-key"

# IAM (names are deterministic — no IDs needed for most)
MARIE_ACCESS_KEY_ID=""       # e.g. AKIAIOSFODNN7EXAMPLE

# ---------------------------------------------------------------------------
# Validate required vars
# ---------------------------------------------------------------------------
REQUIRED=(VPC_ID IGW_ID PUBLIC_SUBNET_ID ROUTE_TABLE_ID INSTANCE_ID \
          EIP_ALLOC_ID EIP_ASSOC_ID SECURITY_GROUP_ID MARIE_ACCESS_KEY_ID)

for var in "${REQUIRED[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "ERROR: \$$var is not set. Edit migrate-state.sh and fill in all IDs."
    exit 1
  fi
done

PROJECT="job-platform"

echo "==> Importing networking resources..."
terraform import aws_vpc.main                        "$VPC_ID"
terraform import aws_internet_gateway.main           "$IGW_ID"
terraform import aws_subnet.public                   "$PUBLIC_SUBNET_ID"
terraform import aws_route_table.public              "$ROUTE_TABLE_ID"
terraform import aws_route_table_association.public  "${PUBLIC_SUBNET_ID}/${ROUTE_TABLE_ID}"

echo "==> Importing IAM resources..."
terraform import aws_iam_user.marie_deployer                "${PROJECT}-marie-deployer"
terraform import aws_iam_user_policy.marie_deployer_policy  "${PROJECT}-marie-deployer:${PROJECT}-marie-deployer-policy"
terraform import aws_iam_access_key.marie_deployer          "${PROJECT}-marie-deployer:${MARIE_ACCESS_KEY_ID}"
terraform import aws_iam_group.deployers                    "${PROJECT}-deployers"
terraform import aws_iam_user_group_membership.marie_deployers \
  "${PROJECT}-marie-deployer/${PROJECT}-deployers"

echo "==> Importing EC2 resources..."
terraform import aws_key_pair.deployer               "$KEY_PAIR_NAME"
terraform import aws_eip.app_server                  "$EIP_ALLOC_ID"
terraform import aws_security_group.app_sg           "$SECURITY_GROUP_ID"
terraform import aws_iam_role.ec2_role               "${PROJECT}-ec2-role"
terraform import aws_iam_role_policy_attachment.ec2_ssm \
  "${PROJECT}-ec2-role/arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
terraform import aws_iam_instance_profile.ec2_profile "${PROJECT}-ec2-profile"
terraform import aws_instance.app_server             "$INSTANCE_ID"
terraform import aws_eip_association.app_server      "$EIP_ASSOC_ID"

echo ""
echo "==> Import complete. Running plan to verify..."
terraform plan

echo ""
echo "If the plan shows 0 changes, the migration is successful."
echo "The Elastic IP is preserved — pom100.com DNS record does not need updating."
