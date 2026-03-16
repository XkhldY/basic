# Redeploy app to AWS

Use this when the app is down or you need to push a new version.

**Note:** The current EC2 instance has Elastic IP **3.212.112.56**. If the instance was replaced, run **Option A** or **Option B** below to redeploy the app (Docker, Nginx, SSL, and app are not on a new instance until you deploy).

## Option A: Redeploy via GitHub Actions (recommended if local SSH fails)

If `./deploy-app.sh` fails with **SSH connection timed out**, your network may block outbound SSH. Use GitHub Actions so the deploy runs in the cloud and can reach the EC2 instance.

### 1. Ensure GitHub secrets are set

In the repo: **Settings → Secrets and variables → Actions**. Add or verify:

| Secret | Value |
|--------|--------|
| `AWS_ACCESS_KEY_ID` | AWS access key (e.g. from IAM user) |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `EC2_IP` | `3.212.112.56` (or run `cd terraform-compute && terraform output -raw ec2_public_ip`) |
| `SSH_PRIVATE_KEY` | Full contents of `terraform-compute/job-platform-key` (private key) |
| `DB_SECRET_ARN` | From `cd terraform-persistent && terraform output -raw database_secret_arn` |
| `RDS_ENDPOINT` | From `cd terraform-persistent && terraform output -raw rds_endpoint` |

### 2. Run the workflow

1. Open the repo on GitHub.
2. Go to **Actions** → **Deploy to AWS**.
3. Click **Run workflow**, choose branch (e.g. `main`), then **Run workflow**.
4. Wait for the job to finish. The app will be deployed to EC2.

---

## Option B: Redeploy from your machine

Use this when you can reach the EC2 instance on port 22 (e.g. from another network or VPN).

### Prerequisites

- Terraform applied: `terraform-persistent` and `terraform-compute`.
- SSH private key at `terraform-compute/job-platform-key` (must match the public key in `terraform-compute/terraform.tfvars`).
- `terraform`, `docker`, and `jq` installed.

### Commands

```bash
# From project root
./deploy-app.sh
```

If the server was never set up (Nginx, Docker, SSL), run the full flow once:

```bash
./deploy-aws.sh
```

---

## If the EC2 instance is stopped

Start it from AWS Console (EC2 → Instances → select instance → Start) or:

```bash
aws ec2 start-instances --instance-ids $(cd terraform-compute && terraform output -raw ec2_instance_id)
```

Wait 1–2 minutes, then redeploy (Option A or B).

---

## Current infrastructure (from Terraform)

- **EC2 IP:** 3.212.112.56 (Elastic IP)
- **Instance ID:** `i-03087eaad201f7f4f` (run `cd terraform-compute && terraform output -raw ec2_instance_id` for current)
- **App URLs:** https://pom100.com, https://api.pom100.com

If SSH from your machine times out (e.g. network blocks port 22), use **Option A** to redeploy via GitHub Actions.

**SSH not connecting?** Run `./scripts/ensure-ssh-and-access.sh`. See [docs/SSH-AND-TERRAFORM.md](docs/SSH-AND-TERRAFORM.md) and [docs/SSH-TROUBLESHOOTING.md](docs/SSH-TROUBLESHOOTING.md).

**"Failed to retrieve database secret from Secrets Manager"?** The deploy script now sets `AWS_REGION=us-east-1` and shows the AWS error. If it still fails: (1) Run `cd terraform-compute && terraform apply -auto-approve` so the EC2 IAM role has the latest Secrets Manager policy; (2) Ensure the secret ARN in `.env` matches `terraform-persistent` output: `cd terraform-persistent && terraform output -raw database_secret_arn`.

**HTTPS not working (pom100.com times out on port 443)?** The app is reachable on HTTP (e.g. http://3.212.112.56). To enable HTTPS, SSH to the server and run certbot. If DNS already points to the EC2 IP:
`ssh -i terraform-compute/job-platform-key ubuntu@$(cd terraform-compute && terraform output -raw ec2_public_ip) 'sudo certbot --nginx -d pom100.com -d www.pom100.com -d api.pom100.com --non-interactive --agree-tos --email admin@pom100.com'`
If certbot fails with an account error, try `sudo rm -rf /etc/letsencrypt/accounts` then run certbot again, or use Session Manager to run the same command from the AWS Console.
