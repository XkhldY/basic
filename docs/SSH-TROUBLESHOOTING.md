# SSH not connecting – what went wrong and how to fix it

If you get **Connection timed out** when running `ssh -i terraform-compute/job-platform-key ubuntu@<EC2_IP>` (or `./deploy-app.sh`), use this guide. Get the current IP with `cd terraform-compute && terraform output -raw ec2_public_ip` (e.g. 3.212.112.56).

---

## What “timed out” means

- **Connection timed out** = your machine never got a TCP response on port 22. The traffic is being blocked or dropped before it reaches the instance (or before the reply gets back to you).
- **Permission denied (publickey)** = SSH reached the server but the key was rejected (different problem; see “Key / permission denied” below).

On your setup, AWS side is open: security group allows SSH from `0.0.0.0/0`, NACL allows all, instance is running, Elastic IP is attached. So the timeout is almost always **your network or firewall blocking outbound port 22**.

---

## Fix 1: Use another network (quick check)

Try from a network that doesn’t block outbound SSH:

- **Mobile hotspot** (phone Wi‑Fi / USB tethering).
- **Home or another office** (if you’re on corporate Wi‑Fi).
- **Another machine** (e.g. a friend’s laptop, different office).

If SSH works from the other network, the problem is your current network/firewall, not AWS or the key.

---

## Fix 2: Connect without SSH – Session Manager (recommended)

You can get a shell on the EC2 instance **without opening port 22** using AWS Systems Manager Session Manager. No SSH client or key needed from your side.

### One-time: enable Session Manager on the instance

The project’s Terraform has been updated so the EC2 instance has the IAM permissions for Session Manager. Apply it once:

```bash
cd terraform-compute
terraform apply -auto-approve
```

After the next instance boot (or after a few minutes), the instance will register with SSM.

### Connect from AWS Console

1. Open **EC2** → **Instances**.
2. Select the instance (get ID with `cd terraform-compute && terraform output -raw ec2_instance_id`, e.g. i-03087eaad201f7f4f).
3. Click **Connect**.
4. Choose **Session Manager** tab → **Connect**.
5. A browser-based shell opens. You’re logged in as `ssm-user`. To get an `ubuntu` shell:  
   `sudo su - ubuntu`

You can run your deploy steps from this shell (e.g. extract tarball, run docker commands) without SSH.

---

## Fix 3: Deploy without SSH from your machine – GitHub Actions

If you only need to **redeploy the app** and don’t need an interactive shell:

1. Set GitHub Actions secrets (see **REDEPLOY.md**): `EC2_IP`, `SSH_PRIVATE_KEY`, `DB_SECRET_ARN`, `RDS_ENDPOINT`, and AWS credentials.
2. Push your code, then **Actions** → **Deploy to AWS** → **Run workflow**.

The workflow runs on GitHub’s runners (which can reach your EC2), so it doesn’t depend on your laptop’s SSH working.

---

## Fix 4: If your network blocks port 22

- **Corporate/VPN:** Ask IT to allow outbound TCP to your EC2 IP on port 22, or use Session Manager / GitHub Actions instead.
- **Home router:** Ensure “block WAN ping” or “stealth” doesn’t block outbound connections; try rebooting the router.
- **ISP:** Some ISPs throttle or block port 22. Try mobile hotspot to confirm; if it works, use Session Manager or GitHub Actions for regular access/deploys.

---

## Fix 5: Key / “Permission denied (publickey)”

If you get **Permission denied** (not timeout), SSH is reaching the server but the key is wrong:

1. **Use the private key that matches Terraform:**  
   The key pair in AWS was created from `terraform-compute/terraform.tfvars` → `ssh_public_key`. The file `terraform-compute/job-platform-key` must be the **private** key for that public key.
2. **Check key and permissions:**
   ```bash
   ls -la terraform-compute/job-platform-key   # should be -rw------- (600)
   ssh-keygen -y -f terraform-compute/job-platform-key
   ```
   Compare the printed line with the `ssh_public_key` in `terraform.tfvars`. They must match.
3. If you lost the private key, add a new key pair in Terraform (new variable or new key pair resource), apply, and use the new private key file.

---

## Quick diagnostic (from your machine)

```bash
EC2_IP=$(cd terraform-compute && terraform output -raw ec2_public_ip)

# 1. Can you reach the host at all? (HTTP is often allowed when SSH is blocked)
curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://$EC2_IP:80

# 2. Is port 22 open from your side?
nc -zv $EC2_IP 22

# 3. Verbose SSH (see where it stops)
ssh -v -i terraform-compute/job-platform-key -o ConnectTimeout=10 ubuntu@$EC2_IP echo ok
```

- **curl returns 200** but **nc** or **ssh** hang → port 22 is blocked (or filtered) from your network; use Session Manager or another network.
- **ssh** fails with **Permission denied** → fix the key (see Fix 5).

---

## Summary

| Symptom              | Likely cause              | What to do                                      |
|----------------------|---------------------------|-------------------------------------------------|
| Connection timed out | Your network blocks :22   | Use Session Manager, GitHub Actions, or other network |
| Permission denied    | Wrong or missing SSH key  | Use correct private key for `terraform.tfvars` |
| Connection refused   | SSH not running on EC2    | Use Session Manager to log in and check `sshd`  |

For getting the app back up without SSH: use **GitHub Actions** (REDEPLOY.md) or **Session Manager** to get a shell and run the deploy steps manually.
