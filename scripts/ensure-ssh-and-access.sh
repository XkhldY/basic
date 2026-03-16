#!/bin/bash
#
# Ensure infrastructure is up and test SSH. Run from repo root:
#   ./scripts/ensure-ssh-and-access.sh
#
# Options:
#   --apply-persistent   Also run terraform apply in terraform-persistent (default: compute only)
#   --skip-terraform     Skip terraform apply; only test SSH (use after you've applied already)
#

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

APPLY_PERSISTENT=false
SKIP_TERRAFORM=false
for arg in "$@"; do
  case "$arg" in
    --apply-persistent) APPLY_PERSISTENT=true ;;
    --skip-terraform)   SKIP_TERRAFORM=true ;;
    -h|--help)
      echo "Usage: $0 [--apply-persistent] [--skip-terraform]"
      echo "  --apply-persistent  Run terraform apply in terraform-persistent first"
      echo "  --skip-terraform    Only test SSH (do not run terraform apply)"
      exit 0
      ;;
  esac
done

SSH_KEY="${REPO_ROOT}/terraform-compute/job-platform-key"
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=15 -o BatchMode=yes"

echo "=== Ensure SSH and access (repo: $REPO_ROOT) ==="
echo ""

# --- Prereqs ---
echo "1. Checking prerequisites..."
command -v terraform >/dev/null 2>&1 || { echo "   Missing: terraform"; exit 1; }
command -v aws    >/dev/null 2>&1 || { echo "   Missing: aws CLI"; exit 1; }
command -v jq     >/dev/null 2>&1 || { echo "   Missing: jq"; exit 1; }
[ -f "$SSH_KEY" ] || { echo "   Missing SSH key: $SSH_KEY"; exit 1; }
chmod 600 "$SSH_KEY" 2>/dev/null || true
echo "   OK (terraform, aws, jq, SSH key present)"
echo ""

# --- Terraform ---
if [ "$SKIP_TERRAFORM" = true ]; then
  echo "2. Skipping Terraform (--skip-terraform)."
else
  echo "2. Applying Terraform..."

  if [ "$APPLY_PERSISTENT" = true ]; then
    echo "   terraform-persistent..."
    (cd terraform-persistent && terraform init -input=false && terraform apply -input=false -auto-approve)
  fi

  echo "   terraform-compute (ensures SSM policy, security group, instance)..."
  (cd terraform-compute && terraform init -input=false && terraform apply -input=false -auto-approve)
fi
echo ""

# --- Get instance ID and IP ---
echo "3. Getting instance and IP from Terraform..."
INSTANCE_ID=$(cd terraform-compute && terraform output -raw ec2_instance_id 2>/dev/null) || true
EC2_IP=$(cd terraform-compute && terraform output -raw ec2_public_ip 2>/dev/null) || true

if [ -z "$EC2_IP" ] || [ -z "$INSTANCE_ID" ]; then
  echo "   Failed to get ec2_public_ip or ec2_instance_id from terraform-compute."
  exit 1
fi
echo "   Instance: $INSTANCE_ID  |  IP: $EC2_IP"
echo ""

# --- Ensure instance is running ---
echo "4. Ensuring EC2 instance is running..."
STATE=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].State.Name' --output text 2>/dev/null) || true
if [ "$STATE" = "stopped" ]; then
  echo "   Instance was stopped. Starting..."
  aws ec2 start-instances --instance-ids "$INSTANCE_ID" --output text
  echo "   Waiting for running state..."
  aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
  echo "   Instance is running. Waiting 30s for SSH service..."
  sleep 30
elif [ "$STATE" = "running" ]; then
  echo "   Instance is already running."
else
  echo "   Unexpected state: $STATE"
  exit 1
fi
echo ""

# --- Verify EIP ---
echo "5. Verifying Elastic IP..."
CURRENT_IP=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text 2>/dev/null) || true
if [ -z "$CURRENT_IP" ]; then
  echo "   No public IP. Elastic IP may be disassociated. Re-run: cd terraform-compute && terraform apply -auto-approve"
  exit 1
fi
if [ "$CURRENT_IP" != "$EC2_IP" ]; then
  echo "   Warning: Instance public IP ($CURRENT_IP) differs from Terraform output ($EC2_IP). Using $CURRENT_IP for SSH."
  EC2_IP="$CURRENT_IP"
fi
echo "   OK (IP: $EC2_IP)"
echo ""

# --- Test SSH (try port 22, then 2222) ---
echo "6. Testing SSH (port 22, then 2222 if needed)..."
if ssh -i "$SSH_KEY" $SSH_OPTS "ubuntu@$EC2_IP" 'echo SSH_OK' 2>/dev/null; then
  echo "   SSH connection: SUCCESS (port 22)"
  echo ""
  echo "You can connect with:"
  echo "  ssh -i $SSH_KEY ubuntu@$EC2_IP"
  echo ""
  exit 0
fi
if ssh -i "$SSH_KEY" $SSH_OPTS -p 2222 "ubuntu@$EC2_IP" 'echo SSH_OK' 2>/dev/null; then
  echo "   SSH connection: SUCCESS (port 2222)"
  echo ""
  echo "You can connect with:"
  echo "  ssh -i $SSH_KEY -p 2222 ubuntu@$EC2_IP"
  echo ""
  exit 0
fi

# SSH failed
echo "   SSH connection: TIMED OUT or PERMISSION DENIED"
echo ""
echo "--- What to do next ---"
echo ""
echo "If you see TIMEOUT: your network likely blocks outbound port 22."
echo "  • Use Session Manager (no SSH): AWS Console → EC2 → Instances → Select this instance → Connect → Session Manager → Connect"
echo "  • Try from another network (e.g. mobile hotspot) and run this script again"
echo "  • Deploy app without SSH: use GitHub Actions workflow 'Deploy to AWS' (see REDEPLOY.md)"
echo ""
echo "If you see PERMISSION DENIED: the SSH key may not match."
echo "  • Ensure $SSH_KEY is the private key for the public key in terraform-compute/terraform.tfvars (ssh_public_key)"
echo "  • Test: ssh-keygen -y -f $SSH_KEY  (output should match the public key in tfvars)"
echo ""
echo "Quick Session Manager link (replace REGION if needed):"
echo "  https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#ConnectToInstance:instanceId=$INSTANCE_ID"
echo ""
exit 1
