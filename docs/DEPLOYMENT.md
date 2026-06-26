# Deployment

## AWS

### Option A — ECS Fargate + RDS (recommended)
1. Push images to ECR:
   ```bash
   aws ecr create-repository --repository-name vms-backend
   aws ecr create-repository --repository-name vms-frontend
   docker build -t vms-backend ./backend && docker tag ... && docker push ...
   docker build -t vms-frontend ./frontend && docker tag ... && docker push ...
   ```
2. Provision **RDS for PostgreSQL** (t4g.micro is enough for pilot).
3. Create an ECS cluster + two services (backend, frontend), behind an Application Load Balancer.
4. Store secrets (`JWT_SECRET`, `SMTP_*`, `DATABASE_URL`) in **AWS Secrets Manager** and inject as task definition env vars.
5. Point a Route 53 record at the ALB. Add ACM TLS.

### Option B — EC2 + Docker Compose (simplest)
- Provision Ubuntu 22.04, install Docker.
- `git pull` this repo, set `backend/.env`, run `docker compose up -d --build`.
- Front it with Nginx + Let's Encrypt.

## Microsoft Azure

### Option A — Azure Container Apps + Azure Database for PostgreSQL
1. Create **Azure Database for PostgreSQL — Flexible Server**.
2. Push images to **Azure Container Registry**:
   ```bash
   az acr build -t vms-backend:latest -r <acr> ./backend
   az acr build -t vms-frontend:latest -r <acr> ./frontend
   ```
3. Create two **Container Apps** in the same environment, exposing 4000 (internal) and 80 (external).
4. Store secrets in **Azure Key Vault** and reference via Container App secret refs.
5. Map a custom domain + managed certificate.

### Option B — Azure App Service (Linux)
- Deploy backend as **App Service for Node 20**; deploy `dist/` of frontend as **Static Web App**.
- Use App Service environment variables for secrets.

## Common production checklist

- [ ] Strong `JWT_SECRET` (32+ random bytes)
- [ ] HTTPS terminated at LB / Nginx / App Gateway
- [ ] `CORS_ORIGIN` set to your frontend domain only
- [ ] SMTP credentials in secret manager
- [ ] Postgres backups + point-in-time recovery
- [ ] `npx prisma migrate deploy` on every release
- [ ] Centralized logs (CloudWatch / Azure Monitor)
- [ ] Health check on `/api/health`