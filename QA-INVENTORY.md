# Inventory QA handoff

**QA SIGN-OFF: APPROVED — inventory fix scope**

## Verified in this session

- 5 existing unit tests passed.
- 6 new HTTP/PostgreSQL integration tests passed, 0 failures/skips.
- `git diff --check` passed.
- PostgreSQL 16 used in a disposable container on loopback port 55439, database `camera_inventory_test`; container removed after checks. Existing application databases were not used.
- Integration harness runs the actual Products/Orders controllers and services, Prisma client and global validation pipe. It intentionally excludes application startup auto-seeding/schema synchronization and other application modules.

Coverage: negative/zero/malformed order quantity, product zero/negative stock, inactive product, simultaneous purchases of the last item (one 201 and one 400, one persisted order, stock zero), transaction rollback when a later item lacks stock, update validation preserving images and stock on rejection, and successful update to zero stock.

## Validation review

`ProductsService.update` validates `stockQuantity` before image writes. Negative/fractional/string/null values and Prisma operation objects such as `{ decrement: 5 }` are rejected with HTTP 400. Integer zero is accepted. Order quantities must be positive safe integers. Conditional `updateMany` and the encompassing transaction protect stock reservations and rollback.

## Reproduce

Provision an empty, dedicated local PostgreSQL database whose name ends in `_test`. Set both `DATABASE_URL` and `INVENTORY_TEST_DATABASE_URL` to its URL (do not use a production URL), then from `apps/backend` run:

```sh
npx prisma db push --skip-generate
node --test tests/inventory.test.cjs tests/inventory.integration.cjs
```

The integration suite is explicit/opt-in, outside the default `*.test.cjs` unit-test glob. It creates unique fixtures and removes them afterward.

## Pipeline boundary

Prior `build:all` and 27 browser E2E passes were reported by the parent session; they were not rerun here. Those browser results used offline fallback and must not be represented as live-backend browser coverage. This sign-off covers the inventory repair, not whole-application integration or deployment. No commit, push, or deployment performed.
