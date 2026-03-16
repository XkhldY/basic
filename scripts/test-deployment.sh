#!/bin/bash
# Quick connectivity and app tests. Run from your machine (e.g. ./scripts/test-deployment.sh).

set -e

# Prefer env; otherwise try Terraform output, then fallback
if [ -z "$EC2_IP" ] && [ -d "terraform-compute" ]; then
  EC2_IP=$(cd terraform-compute 2>/dev/null && terraform output -raw ec2_public_ip 2>/dev/null) || true
fi
EC2_IP="${EC2_IP:-3.212.112.56}"
SSH_KEY="${SSH_KEY:-terraform-compute/job-platform-key}"

echo "=== Testing deployment (EC2: $EC2_IP) ==="
echo ""

# 1. Frontend (public URL)
echo -n "1. Frontend https://pom100.com ... "
CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 https://pom100.com 2>/dev/null || echo "000")
if [ "$CODE" = "200" ]; then
  echo "OK (HTTP $CODE)"
else
  echo "FAIL (HTTP $CODE or timeout)"
fi

# 2. API health
echo -n "2. API https://api.pom100.com/health ... "
BODY=$(curl -s --connect-timeout 10 https://api.pom100.com/health 2>/dev/null || echo "")
if echo "$BODY" | grep -q "healthy"; then
  echo "OK (healthy)"
else
  echo "FAIL or timeout"
fi

# 3. Direct EC2 ports (if DNS is not used)
echo -n "3. Direct EC2 :80 ... "
CODE80=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://$EC2_IP:80" 2>/dev/null || echo "000")
[ "$CODE80" = "200" ] || [ "$CODE80" = "301" ] || [ "$CODE80" = "302" ] && echo "OK (HTTP $CODE80)" || echo "FAIL (HTTP $CODE80)"

echo -n "4. Direct EC2 :8000/health ... "
BODY8=$(curl -s --connect-timeout 5 "http://$EC2_IP:8000/health" 2>/dev/null || echo "")
echo "$BODY8" | grep -q "healthy" && echo "OK" || echo "FAIL or timeout"

# 5. SSH
echo -n "5. SSH port 22 ... "
if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes "ubuntu@$EC2_IP" 'echo OK' 2>/dev/null; then
  echo "OK"
else
  echo "FAIL (timeout or permission denied)"
fi

echo ""
echo "Done. If 1–4 fail, app may be down. If only 5 fails, use Session Manager or GitHub Actions to deploy."
