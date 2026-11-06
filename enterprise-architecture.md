# Enterprise Architecture — Scale & Reliability

## Concurrency Model

```
                         ┌─────────────┐
                         │  Load       │
                         │  Balancer   │
                         └──────┬──────┘
                    ┌───────────┼───────────┐
              ┌─────┴─────┐ ┌──┴──┐ ┌─────┴─────┐
              │ API Pod 1 │ │ ... │ │ API Pod N │  ← HPA (3-20 replicas)
              │ 4 workers │ │     │ │ 4 workers │
              └─────┬─────┘ └──┬──┘ └─────┬─────┘
                    │          │           │
              ┌─────┴──────────┴───────────┴─────┐
              │         PgBouncer (2 replicas)    │  ← Connection pooler
              │    1000 client → 50 server conn   │
              └─────────────────┬─────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │       PostgreSQL (HA)              │
              │  Primary + Read Replica            │
              └───────────────────────────────────┘
```

## Connection Math

| Component | Connections |
|-----------|------------|
| API pod (4 workers x 10 pool each) | 40 DB connections per pod |
| 10 pods | 400 connections total |
| PgBouncer transaction mode | 50 actual server connections |
| PostgreSQL max_connections | 200 (headroom for admin) |

## Caching Strategy

| Layer | Cache | TTL | Purpose |
|-------|-------|-----|---------|
| Bootstrap context | Redis | 5 min | Tenant entitlements |
| User permissions | Redis | 5 min | RBAC lookups |
| Rate limits | Redis | 1 min | Sliding window counters |
| Distributed locks | Redis | 30s | Workflow idempotency |
| Query results | Redis | 2 min | Hot analytics queries |

## Rate Limiting

| Tier | Limit | Scope |
|------|-------|-------|
| Global | 300/min | Per user |
| Auth | 20/min | Per IP |
| AI | 30/min | Per tenant |
| API | 120/min | Per endpoint group |
| Burst | 2x limit | Short burst allowance |

## Circuit Breakers

| Service | Threshold | Recovery |
|---------|-----------|----------|
| SaaS Admin | 5 failures | 60s |
| AI Provider | 3 failures | 120s |
| Integration Hub | 5 failures | 60s |

## Tenant Isolation

1. **Database**: `tenant_id` column on every business table (indexed)
2. **Query enforcement**: `TenantQueryMixin` auto-filters all queries
3. **Request context**: `RequestContext` dataclass with tenant, user, correlation
4. **Concurrency**: Per-tenant concurrent request limit (100)
5. **Cache**: All cache keys namespaced by tenant_id
6. **Rate limiting**: Per-tenant rate windows

## Background Processing

| Queue | Purpose | Workers |
|-------|---------|---------|
| workflow_execution | Async workflow runs | 10 |
| message_delivery | Email/SMS sends | 10 |
| sync_inbound | Integration sync | 5 |
| ai_generation | AI calls | 5 |
| metering_publish | Usage reporting | 2 |

## Monitoring Endpoints

- `GET /health` — Liveness (always returns 200 if process alive)
- `GET /readiness` — Readiness (checks DB + Redis)
- `GET /metrics` — Pool stats, connection counts

## Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|-----------|
| Redis down | No caching/rate limiting | In-memory fallback, fail-open rate limiter |
| SaaS Admin down | Can't refresh bootstrap | Circuit breaker + cached context |
| AI Provider down | No AI features | Circuit breaker + mock fallback |
| Database overload | Slow queries | Statement timeout (30s), pool limits |
| Pod crash | Partial outage | HPA auto-scales, PgBouncer handles reconnect |
