# DigiDelight Platform — Architecture Overview

## Two-Application Architecture

### SaaS Admin Platform (Control Plane)
- **Port**: 8000
- **Database**: Catalog DB (PostgreSQL, port 5432)
- **Purpose**: Tenant management, subscriptions, entitlements, routing

### DigiDelight Application (Data Plane)
- **Port**: 8001
- **Database**: Business DB (PostgreSQL, port 5433)
- **Purpose**: Tenant-facing CRM, campaigns, service desk, workflows, AI

## Key Architectural Principles

1. **Strict separation**: Control plane vs business data vs AI-derived data vs sync metadata
2. **Entitlements vs Permissions**: SaaS Admin controls what's available; DigiDelight controls who can do what
3. **Customer 360 as a core domain**: Not a page — an aggregation layer
4. **Hybrid extensibility**: Hard tables for standard entities + JSONB for custom entities
5. **Governed AI**: All AI through orchestration layer with audit, trust, and human review
6. **Multi-tenant isolation**: tenant_id on every business table

## Data Flow

```
Login → SaaS Admin Auth → Bootstrap Context → DigiDelight JWT
                                                    ↓
                                            Local RBAC + Feature Gates
                                                    ↓
                                    CRM / Campaigns / Service / Workflows / AI
```

## Module Map (10 Phases)

| Phase | Module | Tables |
|-------|--------|--------|
| 1 | SaaS Admin | 19 |
| 2 | DigiDelight Foundation | 10 |
| 3 | CRM Core + Customer 360 | 13 |
| 4 | Custom Entities + Relationships | 11 |
| 5 | Integration Hub | 9 |
| 6 | Campaigns + Messaging | 13 |
| 7 | Service Desk + KB | 11 |
| 8 | Workflows + Approvals | 7 |
| 9 | AI Orchestration | 14 |
| 10 | Analytics + Metering + Hardening | 3 |
| **Total** | | **~110 tables** |
