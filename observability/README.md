# Observability Stack — DigiDelight Platform

## Architecture

```
Frontend (Vue)                Backend (FastAPI)              Infrastructure
├── Sentry Browser SDK        ├── OTel SDK (traces)          ├── Prometheus (:9090)
├── Error Handlers            ├── Prometheus metrics          ├── Grafana (:3000)
├── Web Vitals                ├── Structured JSON logs        ├── Loki (:3100)
├── Route Timing              ├── Sentry SDK (errors)         ├── Tempo (:3200)
└── API Correlation IDs       ├── Health checks               ├── OTel Collector (:4317)
                              └── Auto-instrumentation        └── Alertmanager (:9093)
```

## Quick Start

### Start the observability stack
```bash
cd infrastructure/docker
docker compose -f docker-compose.observability.yml up -d
```

### Access dashboards
- **Grafana**: http://localhost:3000 (admin / admin)
- **Prometheus**: http://localhost:9090
- **Alertmanager**: http://localhost:9093

### Verify metrics
```bash
curl http://localhost:8001/metrics  # DigiDelight API
curl http://localhost:8000/metrics  # SaaS Admin API
```

### Verify health
```bash
curl http://localhost:8001/health      # Basic health
curl http://localhost:8001/readiness   # Dependency checks
curl http://localhost:8001/liveness    # Process alive
```

## Dashboards

| Dashboard | Purpose |
|-----------|---------|
| Platform Overview | Request rate, error rate, latency p50/p95/p99, DB pool, cache hit ratio |
| DigiDelight Backend | Route-level latency, error breakdown, top slow endpoints |
| SaaS Admin Backend | Same for admin API |
| Background Jobs | Job throughput, failures, retries, queue depth |
| Messaging & Campaigns | Send rate, delivery failures, webhook health |
| Public Flows | Survey submissions, booking completions, link redirects |
| Infrastructure | DB pool, Redis latency, connection health |
| Tenant Diagnostics | Per-tenant error rates, request volumes |
| Alerts Overview | Active/resolved alerts timeline |

## Metrics Reference

### HTTP Metrics
| Metric | Type | Labels |
|--------|------|--------|
| `http_requests_total` | Counter | method, path_template, status_code, service |
| `http_request_duration_seconds` | Histogram | method, path_template, service |
| `http_requests_in_flight` | Gauge | service |
| `http_errors_total` | Counter | method, path_template, status_code, service |

### Database Metrics
| Metric | Type | Labels |
|--------|------|--------|
| `db_query_duration_seconds` | Histogram | operation, service |
| `db_pool_size` | Gauge | service |
| `db_pool_checkedout` | Gauge | service |

### Cache Metrics
| Metric | Type | Labels |
|--------|------|--------|
| `redis_cache_hits_total` | Counter | service |
| `redis_cache_misses_total` | Counter | service |
| `redis_operation_duration_seconds` | Histogram | operation, service |

### Module Metrics
| Metric | Type | Labels |
|--------|------|--------|
| `survey_submissions_total` | Counter | survey_type, status, service |
| `link_redirects_total` | Counter | status, service |
| `campaign_sends_total` | Counter | channel, status, service |
| `booking_completions_total` | Counter | status, service |
| `webhook_deliveries_total` | Counter | status, service |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_EXPORTER_ENDPOINT` | `http://otel-collector:4317` | OTel Collector gRPC endpoint |
| `OTEL_TRACES_SAMPLE_RATE` | `1.0` (dev) / `0.1` (prod) | Trace sampling rate |
| `SENTRY_DSN` | _(empty)_ | Sentry DSN for error monitoring |
| `SENTRY_TRACES_SAMPLE_RATE` | `0.05` | Sentry performance sampling |
| `PROMETHEUS_ENABLED` | `true` | Enable /metrics endpoint |
| `VITE_SENTRY_DSN` | _(empty)_ | Frontend Sentry DSN |
| `VITE_APP_ENV` | `development` | Frontend environment tag |
| `VITE_RELEASE` | `1.0.0` | Frontend release version |

## Adding New Metrics

1. Define in `packages/observability/metrics.py`:
   ```python
   my_metric = Counter("my_metric_total", "Description", ["label1"], registry=metrics_registry)
   ```

2. Instrument in your code:
   ```python
   from packages.observability.metrics import my_metric
   my_metric.labels(label1="value").inc()
   ```

3. Add Grafana panel in the relevant dashboard JSON.

## Adding New Alerts

1. Add rule to `infrastructure/observability/prometheus/alert_rules.yml`
2. Reload Prometheus: `curl -X POST http://localhost:9090/-/reload`

## Runbooks

### Service is Unhealthy
1. Check `/readiness` endpoint for which dependency failed
2. Check Docker container logs: `docker logs digidelight-api --tail 50`
3. Check database connectivity: `docker exec platform-business-db pg_isready`
4. Check Redis: `docker exec platform-redis redis-cli ping`

### High Error Rate (>5%)
1. Open Grafana → Platform Overview → check error rate panel
2. Drill into DigiDelight Backend dashboard → error breakdown by path
3. Check Sentry for new error groups
4. Check logs: filter by `level=ERROR` in Loki

### Queue Backlog
1. Check Background Jobs dashboard → queue depth panel
2. Check worker logs for exceptions
3. Scale workers if needed
4. Check for stuck jobs (duration > 5min)

### DB Pool Exhaustion
1. Check Infrastructure dashboard → DB pool usage
2. Look for long-running queries in slow query logs
3. Check for connection leaks (pool overflow trending up)
4. Consider increasing pool size or optimizing queries

## Security & Privacy

- **No PII in traces**: User IDs are tagged but emails/names are not
- **No secrets in logs**: Authorization headers, tokens, and passwords are redacted
- **IP addresses hashed**: Survey submissions store hashed IPs, not raw
- **Sentry PII scrubbing**: Before-send hooks strip sensitive headers and params
- **Tenant-safe metrics**: Tenant IDs in traces/logs are for internal ops only
- **Sampling**: Configurable rates to control data volume and cost
