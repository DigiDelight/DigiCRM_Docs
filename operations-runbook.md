# Operations Runbook

## Health Checks
- DigiDelight API: `GET /health` (liveness), `GET /readiness` (database check)
- SaaS Admin API: `GET /health`
- DigiDelight Diagnostics: `GET /api/v1/diagnostics/readiness` (DB + SaaS Admin)

## Common Operations

### Restart Services
```bash
docker-compose restart digidelight-api
docker-compose restart saas-admin-api
```

### Run Migrations
```bash
cd backend && alembic upgrade head
```

### Clear Bootstrap Cache
```bash
curl -X POST /api/v1/bootstrap/refresh -H "Authorization: Bearer $TOKEN"
```

### Publish Usage Metrics
```bash
curl -X POST /api/v1/metering/publish -H "Authorization: Bearer $TOKEN"
```

## Incident Response

1. Check `/health` and `/readiness` endpoints
2. Check `/api/v1/diagnostics/bootstrap` for bootstrap issues
3. Review structured logs (JSON format in production)
4. Check correlation IDs across services
5. Review audit logs: `GET /api/v1/audit`

## Backup Strategy

### Database
- Catalog DB: pg_dump with `--format=custom`
- Business DB: pg_dump with `--format=custom`
- Schedule: Daily full, hourly WAL archival

### Tenant Restore
- Restore specific tenant by filtering on tenant_id
- Ensure bootstrap cache is invalidated after restore
