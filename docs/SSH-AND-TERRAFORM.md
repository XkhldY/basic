# SSH connection and Terraform – when to rerun and how to test

## Do you need to rerun Terraform?

**Yes, run it at least once** (or after any change to Terraform files) so that:

1. **Security group** allows SSH on port 22 and 2222 (2222 helps when your network blocks 22).
2. **Instance** exists and has the right IAM role (Secrets Manager, S3, and **Session Manager**).
3. **Elastic IP** is attached so the instance keeps the same public IP (e.g. 3.212.112.56; run `terraform output -raw ec2_public_ip` for current).

Rerun Terraform **whenever** you:

- Change `terraform-compute/*.tf` or `terraform-compute/terraform.tfvars`
- Add or change the EC2 IAM role (e.g. we added Session Manager)
- Want to fix a drifted state (e.g. EIP disassociated after stop/start)

You do **not** need to rerun Terraform just to “test” SSH; you can test SSH after one good apply.

---

## One script that does everything

From the **repo root**:

```bash
./scripts/ensure-ssh-and-access.sh
```

This script:

1. Checks prerequisites (terraform, aws CLI, jq, SSH key).
2. Runs **terraform apply** in `terraform-compute` (and optionally in `terraform-persistent`).
3. Ensures the EC2 instance is **running** (starts it if stopped).
4. Verifies the **Elastic IP** is attached.
5. **Tests SSH** with a 15-second timeout and prints clear success or failure.

If SSH still times out, the script prints what to do next (Session Manager, other network, GitHub Actions).

**Options:**

```bash
# Also apply terraform-persistent (VPC, RDS, etc.)
./scripts/ensure-ssh-and-access.sh --apply-persistent

# Skip Terraform; only test SSH (after you’ve already applied)
./scripts/ensure-ssh-and-access.sh --skip-terraform
```

---

## Manual steps (if you prefer)

### 1. Rerun Terraform (compute is enough for SSH/SSM)

```bash
cd terraform-compute
terraform init
terraform apply -auto-approve
```

To also refresh persistent infra (VPC, RDS, S3):

```bash
cd terraform-persistent
terraform init
terraform apply -auto-approve
cd ../terraform-compute
terraform init
terraform apply -auto-approve
```

### 2. Start the instance if it’s stopped

```bash
INSTANCE_ID=$(cd terraform-compute && terraform output -raw ec2_instance_id)
aws ec2 start-instances --instance-ids "$INSTANCE_ID"
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
# Wait a bit for SSH to come up
sleep 30
```

### 3. Test SSH

```bash
EC2_IP=$(cd terraform-compute && terraform output -raw ec2_public_ip)
ssh -i terraform-compute/job-platform-key -o StrictHostKeyChecking=no -o ConnectTimeout=15 ubuntu@$EC2_IP 'echo SSH_OK'
```

- If you see `SSH_OK`, SSH works.
- If you see **Connection timed out**, your network is likely blocking outbound port 22; use Session Manager or another network (see [SSH-TROUBLESHOOTING.md](SSH-TROUBLESHOOTING.md)).
- If you see **Permission denied (publickey)**, the private key doesn’t match the one in Terraform; fix the key or update `terraform.tfvars` and re-apply.

---

## Summary

| Goal | What to run |
|------|-------------|
| “Do everything”: apply Terraform, ensure instance up, test SSH | `./scripts/ensure-ssh-and-access.sh` |
| Only test SSH (Terraform already applied) | `./scripts/ensure-ssh-and-access.sh --skip-terraform` |
| Apply Terraform + persistent | `./scripts/ensure-ssh-and-access.sh --apply-persistent` |
| Connect without SSH (Session Manager) | After one `terraform apply` in compute: EC2 Console → instance → Connect → Session Manager |

Rerun Terraform when you change infra or to reattach EIP/role; use the script to make sure the instance is up and to test SSH so it doesn’t time out unexpectedly.
