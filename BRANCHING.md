# Chiến lược nhánh và chia việc

## 1. Nhánh cố định

- `main`: luôn deployable, protected, cấm push trực tiếp.
- Không duy trì `develop`; PR ngắn giảm merge drift.

## 2. Nhánh task

```text
plan/<scope>
feat/<scope>
fix/<scope>
test/<scope>
chore/<scope>
infra/<scope>
```

Ví dụ:

```text
plan/domain-contract-v1
feat/catalog-read-model
feat/customer-auth
feat/idempotent-checkout
test/checkout-concurrency
infra/aws-staging
```

Một nhánh chỉ giải quyết một task, sống tối đa 1–3 ngày, rebase/merge `main` thường xuyên. Không gom refactor không liên quan.

## 3. Chuỗi nhánh theo phase

| Thứ tự | Nhánh | Kết quả |
|---|---|---|
| 1 | `plan/product-scope` | Actor, role, use case, out-of-scope |
| 2 | `plan/domain-contract-v1` | ADR, schema, API/UI contract |
| 3 | `feat/platform-scaffold` | Spring Boot, Vaadin, Flyway, health |
| 4 | `feat/catalog` | Catalog vertical slice |
| 5 | `feat/customer-auth` | Session, RBAC, ownership |
| 6 | `feat/cart-inventory` | Cart, stock model, reservations |
| 7 | `feat/idempotent-checkout` | Checkout/order/payment transaction |
| 8 | `feat/order-tracking` | Tracking/cancel/stock restore |
| 9 | `feat/admin-operations` | Catalog, inventory, order admin |
| 10 | `feat/pos-warranty` | POS, serial, warranty lifecycle |
| 11 | `test/browser-security` | Browser, a11y, IDOR, concurrency |
| 12 | `infra/aws-staging` | AWS staging + observability |
| 13 | `infra/backup-rollback` | Restore drill + digest rollback |
| 14 | `chore/production-release` | Release candidate |

Nhánh phụ thuộc không mở trước khi contract của phase trước được merge.

## 4. Chia team

| Vai | Ownership |
|---|---|
| Architect/Product | Scope, ADR, domain, contract, acceptance criteria |
| Backend | Domain, DB, API, transaction, auth, integration tests |
| Frontend Vaadin | Store, Admin, POS, responsive, accessibility |
| QA/Security | Browser, concurrency, IDOR, security, evidence |
| AWS/DevOps | CI/CD, IaC, secrets, observability, backup, rollback |

Backend và Frontend làm song song sau khi contract merge. QA viết contract tests song song. DevOps chỉ deploy artifact đã qua gate.

## 5. Quy tắc PR

- Bắt buộc ít nhất một review.
- Bắt buộc build, unit, PostgreSQL integration và relevant browser test xanh.
- DB migration cần review riêng và rollback note.
- Security-sensitive PR cần QA/Security review.
- Infra PR cần plan output và không chứa secret.
- Squash hoặc merge commit nhất quán; commit message mô tả outcome.
- Không merge khi có flaky test, TODO security hoặc migration chưa test restore.

## 6. Environments

| Environment | Nguồn deploy | Write test |
|---|---|---|
| Local/ephemeral | Branch/PR | Cho phép, tự hủy |
| Staging AWS | `main` artifact | Chỉ fixture sandbox |
| Production AWS | Approved digest | Cấm; QA read-only |

## 7. Rollback

- App rollback bằng image digest trước.
- Migration dùng expand/contract; không phụ thuộc rollback schema phá hủy.
- Feature flag chỉ dùng cho rollout có rủi ro thật.
- Mỗi release ghi digest, migration version và restore point.
