# Team Backlog

Trạng thái: `TODO | READY | IN_PROGRESS | BLOCKED | DONE`

| ID | Owner | Task | Depends | Status |
|---|---|---|---|---|
| P-01 | architect | Chốt actor, role, use case và out-of-scope trong `PRODUCT.md` | - | READY |
| P-02 | architect | Chọn stack tối thiểu và ghi ADR | P-01 | BLOCKED |
| P-03 | architect | Thiết kế domain, schema và API contract v1 | P-01, P-02 | BLOCKED |
| B-01 | backend | Scaffold backend, migrations, health/readiness | P-03 | BLOCKED |
| B-02 | backend | Auth, session, RBAC và audit baseline | B-01 | BLOCKED |
| B-03 | backend | Catalog và inventory transaction model | B-02 | BLOCKED |
| B-04 | backend | Checkout idempotent, order và payment state machine | B-03 | BLOCKED |
| F-01 | frontend | Scaffold UI, tokens, layout và accessibility baseline | P-03 | BLOCKED |
| F-02 | frontend | Store catalog, detail, cart và checkout states | F-01, B-03 | BLOCKED |
| F-03 | frontend | Admin catalog, inventory và order operations | F-01, B-04 | BLOCKED |
| Q-01 | qa-security | Contract, integration và DB concurrency harness | P-03, B-01 | BLOCKED |
| Q-02 | qa-security | Browser lifecycle, responsive và accessibility suite | F-02, B-04 | BLOCKED |
| Q-03 | qa-security | Auth, IDOR, passive security và error-branch suite | B-02, F-03 | BLOCKED |
| D-01 | aws-devops | CI build/test/image scan với digest immutable | B-01, F-01, Q-01 | BLOCKED |
| D-02 | aws-devops | AWS staging bằng IaC, secret store và observability | D-01 | BLOCKED |
| D-03 | aws-devops | Backup/restore drill và digest rollback runbook | D-02 | BLOCKED |
| R-01 | orchestrator | Release candidate: toàn bộ quality gates xanh | Q-02, Q-03, D-03 | BLOCKED |
