# PRO GEAR Java/Vaadin — UI inventory Phase 1

Baseline: `main@4ab639e`
Mục đích: inventory route, quyền, trạng thái, selector và gap trước khi viết deep browser E2E. Tài liệu này không phải QA sign-off.

## Route và quyền

| Route | View | Quyền | Selector gốc | Trạng thái cần phủ |
|---|---|---|---|---|
| `/` | `StoreView` | Anonymous | `#qa-product-grid` | catalog, filter, empty, cart, checkout validation/error/success |
| `/products/{uuid}` | `ProductDetailView` | Anonymous | `#product-detail-view` | valid, 404, in/out of stock, specs empty/long, image failure |
| `/warranty-check` | `WarrantyView` | Anonymous | `#warranty-view` | blank, not found, active, expired, claimed, masked serial |
| `/dang-nhap` | `LoginView` | Anonymous | `#qa-login-screen` | login success/error, registration validation/conflict/error |
| `/login` | `LegacyLoginRedirectView` | Anonymous | redirect | query/redirect preservation |
| `/tai-khoan/don-hang` | `CustomerOrdersView` | CUSTOMER | `#customer-orders-view` | empty/list/many rows/session expiry |
| `/tai-khoan/don-hang/{number}` | `CustomerOrdersView` | CUSTOMER owner | `#customer-order-summary` | owner, IDOR/not-found, timeline, payment, cancellation |
| `/my-orders` | alias | CUSTOMER | `#customer-orders-view` | redirect/alias parity |
| `/admin/login` | `AdminLoginView` | Anonymous | `#admin-login-view` | admin/staff/customer/error/session expiry |
| `/admin` | `AdminView` | ADMIN | `#admin-view` | all tabs, empty/error/large data, invalid transitions |
| `/pos` | `PosView` | ADMIN, STAFF | `#pos-view` | cart, stock, serial, payment, duplicate submit, partial failure |

## Selector contract

Các selector trong bảng dưới là API kiểm thử ổn định. Test không dựa vào text/CSS layout nếu đã có selector.

### Store và checkout

- `#qa-search-input`, `#qa-product-grid`, `[data-testid='product-card']`
- `#cart-drawer-button`, `#store-cart-dialog`
- `#checkout-recipient-name`, `#checkout-email`, `#checkout-phone`, `#checkout-address`
- `#checkout-payment-method`, `#checkout-confirmation`, `#checkout-submit`

### Product và warranty

- `#product-detail-name`, `#product-detail-image`, `#product-detail-stock`
- `#product-detail-buy`, `#product-detail-installment`, `#product-detail-specifications`
- `#warranty-serial-input`, `#warranty-submit`, `#warranty-result`

### Customer account

- `#qa-login-form`, `#customer-orders-grid`, `[data-testid='customer-order-details']`
- `#customer-order-summary`, `#customer-order-timeline`, `#customer-order-delivery`
- `#customer-order-payment`, `#customer-order-cancel`
- `#customer-order-cancel-reason`, `#customer-order-cancel-confirm`

### Admin và POS

- `#admin-login-form`, `#admin-tabs`, `#admin-content`, `#admin-dashboard`
- `#admin-products-grid`, `#admin-product-form`, `#admin-orders-grid`
- `#admin-payments-grid`, `#admin-warranties-grid`
- `#pos-product-select`, `#pos-quantity`, `#pos-add-item`, `#pos-cart-grid`
- `#pos-payment-method`, `#pos-total`, `#pos-checkout`, `#pos-receipt-content`

## Gap phát hiện khi inventory

### P1 — cần sửa trước write E2E sign-off

1. **POS VietQR có transition mâu thuẫn:** `placePos` tạo order `COMPLETED/PAID`, sau đó `createForOrder` yêu cầu order `PLACED` để chuyển `PENDING_PAYMENT`; nhánh VietQR có thể lỗi sau khi order/tồn kho đã commit.
2. **POS không atomic toàn luồng:** tạo order, bán serial/bảo hành và tạo payment nằm ở nhiều transaction service; lỗi giữa chừng có thể để lại order/tồn kho đã thay đổi nhưng UI báo checkout lỗi.
3. **Storefront double-submit chưa dùng cùng idempotency key:** mỗi click tạo UUID mới; backend idempotency không ngăn hai event UI liên tiếp tạo hai đơn.

### P2 — cần sửa trước UI sign-off

1. Admin và POS còn phần lớn tiếng Anh, POS hiển thị USD trong khi Store dùng VND.
2. `ProductDetailView` nút “MUA NGAY” chỉ về trang chủ, không mang sản phẩm vào cart; nút “TRẢ GÓP 0%” chưa có action.
3. Admin tab/page chưa có loading/error boundary; gọi service lỗi trong constructor có thể làm hỏng toàn view.
4. Customer order list chưa có empty state/pagination rõ ràng và chưa có selector theo từng order number.
5. Dialog/action chưa khóa nút trong lúc request; có nguy cơ double action và feedback trùng.
6. Chưa có browser coverage cho keyboard, focus, zoom 200%, Firefox/WebKit và viewport tablet.

### P3 — polish

1. `@PageTitle` POS còn “Camera Platform”, không đồng nhất PRO GEAR.
2. Một số label Admin/POS không đồng nhất thuật ngữ tiếng Việt.
3. Selector cũ có prefix `qa-`, selector mới dùng tên nghiệp vụ; giữ tương thích, chuẩn hóa dần nhưng không đổi selector đã có nếu chưa migrate test.

## Test map Phase 2

1. Public read-only browser: Store → Product → Warranty trên 5 viewport.
2. Authenticated ephemeral browser: register/login → cart → COD/VietQR → orders → detail → cancel.
3. Negative branches: validation, duplicate submit, 401/403/404/409/500, timeout và retry.
4. Console/network assertion: không có uncaught exception, failed same-origin resource hoặc secret/PII trong log.
5. Artifact cho mỗi failure: screenshot, page source, console, network summary, commit SHA và viewport.

## Exit criteria Phase 1

- Route/role inventory đầy đủ.
- Selector contract compile được và browser smoke công khai xác nhận selector chính.
- P1/P2/P3 được ghi rõ, không che lỗi bằng “APPROVED”.
- Không ghi dữ liệu AWS và không sửa hai tài liệu đã khóa.
