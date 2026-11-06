# Security Checklist

## Application Security
- [x] JWT authentication with refresh tokens
- [x] RBAC with permission guards on all routes
- [x] Feature/module gating via bootstrap entitlements
- [x] Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
- [x] Rate limiting middleware (placeholder, Redis-backed in production)
- [x] Correlation IDs on all requests
- [x] Input sanitization utilities
- [x] Prompt injection defense in AI layer
- [x] PII detection in AI outputs
- [x] Separate AI-derived data storage

## Data Security
- [x] Multi-tenant isolation (tenant_id on all business tables)
- [x] Soft delete with audit fields
- [x] No secrets in code (reference-based auth configs)
- [x] Separate databases for control plane and business data
- [x] Audit logging on important operations

## API Security
- [x] OpenAPI documentation
- [x] Pydantic validation on all inputs
- [x] Permission checks before data access
- [x] Idempotency keys on integration paths
- [x] No auto-send for AI-generated content

## Deployment Security
- [ ] TLS everywhere (configure in production)
- [ ] Secret management (Vault/K8s secrets)
- [ ] Network policies (K8s)
- [ ] Container scanning
- [ ] Dependency vulnerability scanning
