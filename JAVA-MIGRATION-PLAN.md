# Kế hoạch chuyển PRO GEAR sang Java

## Nguyên tắc

- Mã nghiệp vụ, REST API, UI Vaadin và test do đội dự án viết bằng Java 21.
- Vaadin Flow vẫn sinh HTML/CSS/JavaScript framework để trình duyệt chạy; không có React/TypeScript do đội dự án viết trong bản Java.
- Bản Java chạy shadow trong `java-platform/`; production không chuyển traffic cho tới khi đạt feature parity và QA 7 tầng.
- Không xóa hoặc ghi đè hệ thống hiện tại trong quá trình migration.
- PostgreSQL migration theo expand → backfill → switch → contract; chỉ một writer cho mỗi bounded context.

## Các pha và quality gate

| Pha | Phạm vi | Điều kiện hoàn thành |
| --- | --- | --- |
| 0 | Scaffold Spring Boot, Vaadin, Flyway, Security | Java CI xanh, health/readiness pass |
| 1 | Catalog/category/brand đọc | Contract và dữ liệu so sánh với API cũ khớp |
| 2 | Auth, chat, product admin | RBAC, concurrency và audit tests pass |
| 3 | Order, inventory, cancel, POS, warranty | Không oversell, không bán trùng serial, rollback đúng |
| 4 | Vaadin Admin feature parity | CRUD, finance, POS, warranty, chat critical flows pass |
| 5 | Vaadin Store feature parity | Search, cart, checkout, tracking, warranty, account pass |
| 6 | Preview AKS + QA 7 tầng | 7/7 tầng xanh hai lần liên tiếp |
| 7 | Cutover có rollback | Smoke production xanh, quan sát lỗi/tồn kho/đơn hàng ổn định |

## QA Java độc lập

`qa-java/` chỉ truy cập hệ thống qua HTTPS/browser và không import mã ứng dụng. Mặc định mọi tầng là read-only. Test ghi dữ liệu chỉ được bật với fixture sandbox riêng và ba biến opt-in được mô tả trong `qa-java/README.md`.

## Trạng thái

- Pha 0: hoàn thành scaffold và Java CI.
- QA production hiện tại: 20/20 read-only tests pass trên 7 tầng.
- Pha 1: đang triển khai; đã có catalog search/filter/detail, Category/Brand/Image domain và Flyway V2.
- Pha 2–5: chưa đủ feature parity và chưa đủ điều kiện cutover.
