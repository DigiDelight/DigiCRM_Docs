# Deployment Guide

## Local Development

```bash
# Start full platform
cd infrastructure/docker
docker-compose -f docker-compose.full.yml up -d

# Seed SaaS Admin
cd saas-admin/backend && python seed_data.py

# Seed DigiDelight
cd digidelight/backend && python seed_data.py
```

## Environment Strategy

| Environment | Purpose | Config |
|-------------|---------|--------|
| development | Local dev | .env, Docker Compose |
| staging | Pre-production | K8s, staging secrets |
| production | Live | K8s, vault secrets, monitoring |

## Production Deployment

1. Build images: `docker build -t digidelight-api -f docker/Dockerfile.backend backend/`
2. Push to registry
3. Apply K8s manifests: `kubectl apply -f infrastructure/k8s/`
4. Run migrations: `alembic upgrade head`
5. Verify health: `curl /health` and `curl /readiness`

## Ports

| Service | Dev Port |
|---------|----------|
| SaaS Admin API | 8000 |
| SaaS Admin Web | 5173 |
| DigiDelight API | 8001 |
| DigiDelight Web | 5174 |
| Catalog DB | 5432 |
| Business DB | 5433 |
| Redis | 6379 |
