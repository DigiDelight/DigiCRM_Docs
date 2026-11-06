# Event-Driven Architecture — Retrofit Guide

## Architecture Overview

```
┌──────────────────┐     ┌──────────────────┐
│   SaaS Admin     │     │   DigiDelight    │
│   (API)          │     │   (API)          │
│                  │     │                  │
│  Business Write  │     │  Business Write  │
│       +          │     │       +          │
│  Outbox Write    │     │  Outbox Write    │
│  (same txn)      │     │  (same txn)      │
└───────┬──────────┘     └───────┬──────────┘
        │                        │
        │  event_outbox table    │  event_outbox table
        │                        │
┌───────┴──────────┐     ┌───────┴──────────┐
│  Publisher        │     │  Publisher        │
│  Worker           │     │  Worker           │
│  (polls outbox)   │     │  (polls outbox)   │
└───────┬──────────┘     └───────┬──────────┘
        │                        │
        └────────┬───────────────┘
                 │
         ┌───────┴───────┐
         │   Redpanda    │
         │   (Broker)    │
         │   Topics      │
         └───────┬───────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───┴───┐  ┌────┴────┐  ┌────┴────┐
│Consumer│  │Consumer │  │Consumer │
│  A     │  │  B      │  │  C      │
│(inbox) │  │(inbox)  │  │(inbox)  │
└────────┘  └─────────┘  └─────────┘
```

## Key Design Decisions

### 1. Outbox Pattern (Transactional Outbox)
- Events are written to `event_outbox` table inside the **same DB transaction** as business data
- No event is ever published without the business operation succeeding
- No distributed transactions needed

### 2. Publisher Worker (Outbox Relay)
- Separate process that polls the outbox table
- Uses `SELECT ... FOR UPDATE SKIP LOCKED` for safe concurrent polling
- Publishes to Redpanda/Kafka topics
- Marks entries as published or retries with exponential backoff

### 3. Inbox Pattern (Idempotent Consumers)
- `processed_events` table tracks every consumed event
- Unique index on `(event_id, consumer_name)` prevents reprocessing
- Consumers use `BaseConsumer.process()` which checks inbox before handling

### 4. Event Envelope
Every event follows a standard envelope:
```json
{
  "event_id": "uuid",
  "event_type": "crm.contact.created",
  "event_version": "1.0",
  "occurred_at": "2025-01-01T00:00:00Z",
  "tenant_id": "uuid",
  "actor_id": "uuid",
  "entity_type": "contact",
  "entity_id": "uuid",
  "correlation_id": "uuid",
  "causation_id": "uuid",
  "payload": { ... },
  "metadata": { ... }
}
```

## Topic Map (14 topics)

| Topic | Partitions | Events |
|-------|-----------|--------|
| saas.tenant.lifecycle | 3 | created, activated, suspended |
| saas.subscription.lifecycle | 3 | created, renewed, cancelled |
| dd.crm.contacts | 6 | created, updated, deleted |
| dd.crm.leads | 6 | created, updated, converted |
| dd.crm.opportunities | 6 | created, stage_changed, won, lost |
| dd.service.tickets | 6 | created, status_changed, resolved |
| dd.campaigns.lifecycle | 3 | created, started, completed |
| dd.workflows.execution | 3 | triggered, completed, failed |
| dd.ai.events | 3 | generation.completed, draft.reviewed |
| platform.metering | 3 | usage.recorded |
| platform.audit | 3 | audit.entry |

## Migration Strategy

1. Deploy outbox tables (non-breaking schema addition)
2. Deploy publisher workers (no effect until outbox has entries)
3. Add outbox writes to existing services (alongside existing behavior)
4. Deploy consumers (idempotent — safe to start empty)
5. Gradually migrate side effects from synchronous to event-driven

## Rollback Considerations

- Outbox writes are just INSERT — removing them doesn't affect business logic
- Publisher workers can be stopped without data loss (outbox retains events)
- Consumers are idempotent — reprocessing is safe
- Topics can be retained or deleted without affecting applications
