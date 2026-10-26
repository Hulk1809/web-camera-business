# Kế hoạch xây web bán máy ảnh bằng Java

## 1. Mục tiêu

Xây nền tảng commerce chuyên bán máy ảnh, ống kính, flycam, gimbal và phụ kiện. Một ứng dụng Java phục vụ Storefront, Admin và POS; PostgreSQL giữ dữ liệu; AWS là cloud duy nhất.

## 2. Stack

- Java 21, Spring Boot 3, Vaadin Flow.
- Spring Security, Spring Data JPA, Hibernate.
- PostgreSQL 16, Flyway.
- Maven, JUnit 5, Testcontainers, Selenium Java.
- Docker, AWS EC2/ECS, RDS PostgreSQL, S3, CloudFront, Route 53, CloudWatch.

Dùng modular monolith. Chưa dùng microservice hoặc Kubernetes.

## 3. Phạm vi MVP

### Storefront

- Catalog, category, brand, search, filter và product detail.
- Đăng ký, đăng nhập, profile và địa chỉ.
- Cart và checkout COD/chuyển khoản.
- Theo dõi đơn, lịch sử trạng thái và hủy đơn hợp lệ.
- Tra cứu bảo hành bằng serial.

### Admin

- CRUD category, brand, product, ảnh và thông số.
- Quản lý tồn kho, serial, order, payment và warranty.
- Tài khoản nhân viên, role và audit log.
- Dashboard doanh thu/tồn kho tối thiểu.

### POS

- Tìm theo SKU, tạo đơn tại quầy, chọn serial.
- Cash/card/chuyển khoản.
- Hoàn tất order, payment, stock, serial và warranty nguyên tử.

## 4. Quy tắc bắt buộc

- Tiền dùng `BigDecimal`; giá order item là snapshot.
- Checkout nhận `Idempotency-Key`.
- DB constraint và transaction ngăn oversell/bán trùng serial.
- Hủy đơn hoàn kho đúng một lần.
- Khách chỉ được đọc/hủy đơn thuộc quyền sở hữu của mình.
- Chuyển khoản pending không hoàn tất order trước khi xác nhận.
- Mọi thay đổi tồn kho, tiền và role phải có audit.
- Production QA chỉ đọc; write E2E chỉ chạy PostgreSQL ephemeral.

## 5. Module

```text
src/main/java/com/progear/
├── auth/
├── catalog/
├── cart/
├── checkout/
├── order/
├── payment/
├── inventory/
├── warranty/
├── admin/
├── pos/
├── audit/
└── shared/
```

Mỗi module chỉ thêm `domain`, `application`, `repository`, `ui` hoặc `web` khi thực sự cần.

## 6. Phase và quality gate

| Phase | Phạm vi | Gate |
|---|---|---|
| 0 | Product scope, actor, role, ADR | Không còn quyết định blocker |
| 1 | Scaffold, Security, PostgreSQL, Flyway | Build, health, migration xanh |
| 2 | Catalog và media | Admin CRUD + Store read flow xanh |
| 3 | Auth, profile, address | RBAC, CSRF, ownership tests xanh |
| 4 | Cart, inventory, checkout | Concurrency + idempotency tests xanh |
| 5 | Order, payment, tracking, cancel | State machine + rollback xanh |
| 6 | Admin operations, POS, serial, warranty | Transaction lifecycle xanh |
| 7 | Responsive, accessibility, browser E2E | Chromium/Firefox/WebKit xanh |
| 8 | AWS staging, observability | Smoke + alert + secret gates xanh |
| 9 | Backup/restore, rollback | Restore drill + digest rollback xanh |
| 10 | Production | Post-deploy read-only QA xanh |

## 7. Test strategy

- Unit: state transition, totals, cancel policy, warranty, idempotency.
- PostgreSQL integration: concurrent checkout, unique serial, rollback, stock restore.
- Browser: customer lifecycle, admin order flow, POS, warranty, error states.
- Security: auth, CSRF, IDOR, upload validation, headers, rate limiting.
- Accessibility: keyboard, focus, labels, contrast, semantic navigation.
- Responsive: 360, 768, 1024 và 1440 px; không overflow ngang.

## 8. Release gate

- Tests và production build xanh.
- Không có secret trong Git.
- Image deploy bằng immutable digest.
- Staging smoke xanh.
- Backup restore đã diễn tập.
- Digest rollback đã diễn tập.
- Production write test bị chặn kỹ thuật.

## 9. Ngoài MVP

- Mobile app, marketplace, AI recommendation, loyalty phức tạp.
- Livestream, multi-region, multi-currency.
- Microservice, Kafka, Kubernetes, Elasticsearch.

Chỉ thêm khi dữ liệu vận hành chứng minh cần thiết.
