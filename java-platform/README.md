# Camera Platform (Java scaffold)

An independent Spring Boot 3 / Java 21 / Vaadin 24 scaffold. It does **not** replace or migrate the existing application. All tables live in the new `camera_platform` PostgreSQL schema, managed by additive Flyway migrations.

## Run

Prerequisites: Java 21, Maven 3.9+, and PostgreSQL. The simplest local production-style run is:

```bash
docker compose up --build
```

Then open <http://localhost:8080>. Health probes are available at `/actuator/health`, `/actuator/health/liveness`, and `/actuator/health/readiness`.

For backend tests (H2, no Docker-in-Docker required):

```bash
mvn test
```

For a Vaadin production bundle:

```bash
mvn -Pproduction clean package
```

No account is created by default. To create the first administrator once, set:

```text
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=<at-least-12-characters>
```

Disable `BOOTSTRAP_ADMIN_ENABLED` after first startup. In TLS environments set `SESSION_COOKIE_SECURE=true`. Secrets should come from the runtime secret manager, never source control.

## Feature matrix

| Area | Scaffold status | Notes |
|---|---|---|
| Store view | Partial | Catalog search/filter, product detail, draft cart and authenticated order placement |
| Admin view | Partial | Dashboard catalog KPIs and role-protected product create/update form; unsupported tabs are explicitly disabled |
| Login | Implemented | Spring Security server-side cookie session, BCrypt |
| Product | Partial | Product CRUD foundation plus Category, Brand, ProductImage and JSON specifications domain |
| Order / OrderItem | Domain service | Transactional placement, stock locking and price snapshot |
| User | Basic | Roles and optional explicit admin bootstrap |
| ChatSession / Message | Domain service/API | Persistence plus authenticated chat-start endpoint; no chat UI yet |
| Order API | Basic | Authenticated, CSRF-protected order placement endpoint |
| Database | Implemented | PostgreSQL, dedicated schema, additive Flyway V1/V2, Hibernate validation |
| Operations | Basic | Actuator probes, container image, Compose development stack |
| Tests | Basic | Domain unit test and H2 repository slice test |

## TODO before production migration

- Define a reviewed legacy-data mapping and write separate, idempotent import jobs; this scaffold intentionally performs no legacy migration.
- Add checkout/payment, idempotency keys, inventory reservation expiry, tax/shipping, and order state authorization.
- Add customer registration/email verification, password reset, MFA for admins, login throttling, and audit events.
- Add admin edit workflows, chat UI/API authorization, pagination, image/object storage, and product search.
- Add PostgreSQL integration tests (for example Testcontainers in CI), browser tests, dependency scanning, metrics/tracing, backups, and restore drills.
- Put the app behind TLS, set secure cookies, manage secrets externally, and define retention/privacy controls.

## API

`GET /api/products` is intentionally public and read-only. Other capabilities currently remain Java service APIs until their authorization and request contracts are specified.
