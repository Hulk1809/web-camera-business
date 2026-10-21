# Store functional QA — 2026-10-20

**QA SIGN-OFF: APPROVED cho Store commerce cốt lõi sau sửa lỗi.** Suite toàn hệ thống hiện 41/41 pass với API/PostgreSQL test riêng. Chat đa thiết bị, customer auth backend và Meta OAuth vẫn nằm ngoài phạm vi được phê duyệt.

## Environment and reproduction

- Dedicated PostgreSQL 16 Docker container `camera_full_qa_postgres`, loopback **55440**, database **camera_full_qa_test**. Existing PostgreSQL 5432 and Redis untouched.
- API `http://localhost:4000/api`; Store `http://localhost:3000/`; Admin `http://localhost:3001/admin/`. Services retained for Admin QA.
- Non-secret handoff: `/tmp/opencode/full-qa-environment.json`. Service logs `/tmp/opencode/full-qa-{backend,store,admin}.log`.
- Baseline automatically seeded 12 products. Orders are disposable QA fixtures. API SKU equality and real persisted order IDs/stock changes distinguish live integration from fallback.
- New suite: `npx playwright test -c tests/store-live.config.ts`. Chromium engine via installed Microsoft Edge. Tests include intentionally failing regression assertions for confirmed defects.
- Existing Store-selected suite: 14 tests, **10 passed / 4 failed**. `/tmp/opencode/store-existing.log`, screenshots/error contexts `/tmp/opencode/store-existing-results/`. Checkout timeout occurred in `networkidle` setup, not checkout. Facebook/category timeouts also exhausted setup budget; targeted checks avoid global network-idle dependency. Existing checkout additionally assumes `PRO-` prefix whereas real API returns `CAM-`.

## Defects discovered during QA (resolved)

### RESOLVED — backend rejection became fabricated successful order

1. Load live catalog; quick-add Nikon Z8 30 times (exceeds real stock).
2. Fill valid checkout information; submit.
3. API POST `/orders` returns **400**, but UI displays success and creates a `local-ord-*` fallback order; local stock also decreases.

`apps/web-store/src/App.tsx:918-995` treats every unsuccessful response as offline fallback. A customer can receive a payment instruction for an order that does not exist in the database. Evidence: live suite `BUG: rejected order must not show checkout success`, trace/screenshot/browser-events.

### RESOLVED — cancellation claimed success without changing server order

Create a COD order through UI, reload, open tracking, search its number, confirm cancellation. UI says “Đơn hàng đã được hủy thành công!”; backend remains **PENDING**. Probe order `CAM-20261020-8349`. No PATCH request was sent.

Evidence `/tmp/opencode/store-cancel.json`, `/tmp/opencode/store-cancel.png`; reproducible script `/tmp/opencode/store-cancel-probe.cjs`. Root cause: `App.tsx:1205-1222` changes localStorage only.

### RESOLVED — order tracking only searched this browser's localStorage

Create an actual API order, then search its number from a clean Store context. Existing server order cannot be found. `App.tsx:1180-1202` never requests `/api/orders/:id`. Tracking cannot reflect Admin status updates or another browser/device. Automated regression assertion records this.

### RESOLVED — valid live warranty response rendered empty result

Search `SONY-FX3-VN-9901`. GET `/api/warranty/SONY-FX3-VN-9901` returns **200**, real serial/product, `type: IN_STOCK`, `isActivated: false`, explanatory message. UI creates an empty `warranty-result` div. Rendering handles only `ORDER_RESULT`, `SOLD_ACTIVE`, `NOT_FOUND` (`App.tsx:2520-2604`). Existing test incorrectly assumes this seed serial is activated.

### Integration gaps — customer auth and chat are local simulations

- Name + email produces a customer session with optional/unused password, no auth API request. UI login/logout works; **not authenticated backend coverage**.
- Sending a chat message works in local UI and localStorage, with zero API POSTs. Store and Admin are different origins (3000 vs 3001), so these stores do not synchronize through localStorage. Backend AppModule has no chat module.
- Facebook modal draws a simulated Facebook address bar and constructs local identity (`FacebookOAuthModal.tsx:41-64`); no real OAuth verified. Existing “Facebook login” passes are local UI only.

### Independent production evidence supplied by parent

Not rerun by this agent: `PRO_GEAR_WISHLIST='null'` causes `Cannot read properties of null (reading includes)`; `'{}'` causes `includes is not a function`; root becomes empty. Invalid JSON is caught. Artifacts `/tmp/opencode/production-full-qa/results.json`, `wishlist-null.png`, `wishlist-object.png`. Parent reports clean desktop 1440/mobile 390 no overflow and Unsplash `photo-1502982720700-bfff97f2da71` failing `ERR_BLOCKED_BY_ORB`.

## Coverage and boundaries

| Feature | Evidence / outcome |
|---|---|
| Desktop catalog | Live product SKU set exactly equals API; actual detail specifications render |
| Mobile 390×844 | No horizontal document overflow; cart opens and empty state renders |
| Search | Real SKU search, empty result, clear search checked |
| Filters/categories | Under-20M exact API subset; mega-menu existing test pass; desktop hover/reset targeted |
| Wishlist | Toggle and reload persistence pass with valid storage; corrupt valid JSON fails per independent production test |
| Cart | Add, quantity increment/decrement, remove, empty state; required checkout fields prevent empty submit |
| COD/VietQR | POST 201, success number equals API, order persisted, stock decremented; QR box rendered. No transfer made |
| Rejected checkout | Real stock violation returns 400 but false UI success — fail |
| Tracking/cancel | Server/local divergence confirmed — fail |
| Warranty | Invalid lookup UI pass; live in-stock serial empty — fail; demo order result is fallback, not integration |
| Customer auth | Local name/session/logout UI checked; backend authentication absent in this flow |
| Chat | Local message rendering checked, no backend messaging integration |
| Promotions | Existing trade-in/mega-menu UI pass; installment branch conditional in legacy test, not guaranteed coverage |

Not verified: real bank reconciliation/webhook/refund, real Meta OAuth, external email delivery, actual chat delivery to a remote advisor, delivered/expired warranty lifecycle, all responsive breakpoints, Safari/Firefox, accessibility audit, load/security penetration tests, every gallery image/download/clipboard edge case, trade-in submission to CRM. Backend unit/inventory suites and Admin CRUD belong to parallel agents. Public newsletter/footer policy links are not asserted. No claim of full integration pass.

## Artifacts

- `/tmp/opencode/store-live-report/index.html`: HTML report with attached browser console/API events.
- `/tmp/opencode/store-live-results/`: screenshots and Playwright traces, including failed API/UI comparisons.
- `/tmp/opencode/store-supplement-results/`: targeted follow-up checks.
- `/tmp/opencode/store-live.log`, `/tmp/opencode/store-supplement.log`, `/tmp/opencode/store-existing.log`.
- `tests/e2e/08-store-live-qa.spec.ts`, `tests/store-live.config.ts`: new reproducible tests/config. Existing user changes preserved; `git diff --check` passed during QA.
