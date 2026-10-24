# PRO GEAR Java/Vaadin — Kế hoạch QA giao diện và bảo toàn dữ liệu

## 1. Trạng thái trung thực hiện tại

Giao diện Java/Vaadin **chưa được nghiệm thu toàn diện**. Bằng chứng hiện có chỉ bao gồm build production, unit/integration test, Chrome smoke read-only trên một số màn hình, responsive cơ bản 1440×900 và 390×844, security/passive checks và readiness trên AWS.

Chưa được phép ghi `UI QA SIGN-OFF: APPROVED` cho tới khi toàn bộ ma trận trong tài liệu này có bằng chứng và không còn lỗi P0/P1/P2 chưa được chấp nhận.

## 2. Môi trường và ranh giới dữ liệu

| Môi trường | Mục đích | Quyền ghi |
|---|---|---|
| Production React/NestJS | Baseline đang phục vụ khách | Chỉ read-only |
| AWS Java preview | Visual, routing, auth boundary, readiness | Chỉ read-only mặc định |
| Ephemeral CI Java + PostgreSQL | Browser E2E, mutation, concurrency, cleanup | Được ghi fixture cô lập |
| PostgreSQL test container | Migration, transaction, lock, restore | Được ghi/xóa toàn bộ container |

Không tạo lại fixture endpoint trong runtime AWS. Write E2E phải dùng stack CI tạm thời hoặc một preview database tách biệt hoàn toàn, tự hủy sau job.

## 3. Đội ngũ và quyền sở hữu

### Role A — Test Architect

- Lập inventory route/component/state trước khi test.
- Viết test thất bại tái hiện lỗi; không sửa code sản phẩm.
- Gắn mức độ P0–P3 và lưu artifact: screenshot, console, network, DOM, viewport, commit SHA.
- Chỉ cấp sign-off khi có bằng chứng theo ma trận, không dựa vào HTTP 200.

### Role B — UI/Accessibility Tester

- Kiểm Chrome, Firefox và WebKit; desktop/tablet/mobile.
- Kiểm keyboard-only, focus, label, contrast, zoom 200%, reduced motion và screen-reader semantics.
- Kiểm loading, empty, error, retry, long text, ảnh lỗi, mạng chậm và mất mạng.
- Không thay đổi business data ngoài fixture ephemeral.

### Role C — Commerce/Security Tester

- Kiểm auth, role redirect, ownership/IDOR, CSRF, session expiry và back-button.
- Kiểm cart/checkout/idempotency/payment/order/cancel ở stack ephemeral PostgreSQL.
- Kiểm duplicate submit, retry, race, insufficient stock và rollback.
- Không dùng tài khoản, SKU hoặc đơn hàng thật.

### Role D — Fixer

- Chỉ sửa lỗi đã có reproduction và expected behavior.
- Mỗi lỗi một nhánh ngắn; không sửa file ngoài ownership nếu chưa handoff.
- Thêm regression test trước hoặc cùng commit sửa lỗi.
- Không dùng `git add -A`, không reset/revert thay đổi không phải của mình.

### Role E — Data/Release Guardian

- Kiểm migration forward, backup, restore và rollback image digest.
- Xác nhận checksum backup, row counts và Flyway history.
- Chỉ cho deploy khi test, migration và rollback gate đều xanh.
- Sau deploy chạy read-only AWS QA; write test chỉ ở môi trường cô lập.

Một người/agent có thể đảm nhiệm nhiều role theo tuần tự, nhưng không được tự ký QA cho thay đổi chưa có test độc lập.

## 4. Quy trình chống xung đột và mất code

1. **Chụp baseline trước mỗi đợt:** lưu commit SHA, `git status --short`, branch và danh sách file user đang sửa.
2. **Không làm việc trực tiếp trên `main`:** mỗi bug/feature dùng branch ngắn từ `origin/main` mới nhất.
3. **Worktree riêng theo luồng:** Tester, Fixer và Release không dùng chung working directory nếu chạy song song.
4. **File ownership:** mỗi task ghi rõ file được phép sửa; file ngoài phạm vi chỉ đọc.
5. **Checkpoint nhỏ:** commit sau mỗi nhóm test/fix độc lập; push branch sau khi local gate xanh.
6. **Không thao tác phá hủy:** cấm `git reset --hard`, `git checkout --`, clean/xóa recursive và force-push nếu chưa được xác nhận.
7. **Không stage rộng:** stage bằng danh sách đường dẫn cụ thể; kiểm `git diff --cached --check` và `git diff --cached --stat` trước commit.
8. **Không ghi đè user work:** file modified từ trước được đánh dấu `USER-OWNED`; không sửa/stage/revert. Hiện tại `.agents/rules/autonomous_team_pipeline.md` thuộc nhóm này.
9. **Handoff bắt buộc:** ghi branch, commit, file đổi, test đã chạy, test chưa chạy, artifact và rủi ro còn lại.
10. **Recovery:** mọi thay đổi phải có trên branch remote trước deploy; rollback dùng image digest/commit đã xác minh, không dùng source chưa commit.

## 5. Quy trình bảo toàn dữ liệu

### Trước migration/deploy

- Tạo PostgreSQL logical backup với timestamp, commit SHA và schema version.
- Mã hóa backup, lưu object storage có versioning/retention; không commit backup hoặc secret.
- Ghi SHA-256, kích thước, row count các bảng trọng yếu và Flyway version.
- Xác minh dung lượng đĩa và quyền truy cập backup trước khi deploy.

### Restore drill

- Restore vào PostgreSQL tạm, không restore đè database đang chạy.
- Chạy Flyway validate, row-count comparison và read-only API smoke.
- Ghi RPO/RTO thực tế và artifact. Backup chưa restore thử không được coi là backup đã xác minh.

### Dữ liệu test

- Fixture có prefix/email/SKU riêng, TTL và cleanup trong `finally`.
- CI tạo database/container riêng cho mỗi run; xóa cả container sau khi upload artifact.
- Test cleanup phải có allowlist; từ chối xóa record không thuộc namespace fixture.
- Không hardcode tài khoản ngân hàng, password, token hoặc dữ liệu khách trong source/log/artifact.

## 6. Ma trận giao diện bắt buộc

### Storefront

- Header, search, category/brand filter, hero, product grid và footer.
- Product detail: SKU hợp lệ/không tồn tại, ảnh lỗi, thông số dài, hết hàng/ngừng bán.
- Cart: rỗng, thêm, tăng/giảm, xóa, duplicate SKU, refresh và session mới.
- Checkout: guest redirect, field invalid, COD, VietQR, double click, retry, timeout, hết hàng và server error.

### Customer Account

- `/dang-nhap`: success, sai password, disabled account, session expiry, mobile keyboard.
- Đăng ký: email sai/trùng, password yếu/không khớp, double submit và server error.
- Danh sách đơn: empty/many rows/long number, trạng thái và pagination/scroll.
- Chi tiết đơn: owner/non-owner, timeline, snapshot, VietQR, hủy hợp lệ/không hợp lệ.

### Admin

- `/admin/login`: staff/admin success, customer denial, sai password và session expiry.
- Dashboard: loading/empty/error/large values.
- Product/order/payment/warranty transitions: valid, invalid, stale version và concurrent update.
- Không hiển thị hoặc cho gọi action ngoài role.

### POS

- Search/add/remove, serial, out-of-stock, duplicate serial và payment state.
- Keyboard flow, barcode-like rapid input, duplicate submit và printer unavailable state.

### Warranty

- Serial không tồn tại, in-stock masked, sold active, expired và malformed input.
- Không lộ order/customer data cho anonymous.

## 7. Ma trận trình duyệt và viewport

| Engine | Viewport bắt buộc |
|---|---|
| Chromium | 1440×900, 1024×768, 768×1024, 390×844, 360×800 |
| Firefox | 1440×900, 390×844 |
| WebKit | 1440×900, 390×844 |

Mỗi viewport kiểm horizontal overflow, sticky/fixed overlap, dialog scroll, virtual keyboard, focus visibility và zoom 200%.

## 8. Nhánh trạng thái cần debug

Mỗi màn hình phải có test cho: `loading`, `success`, `empty`, `validation error`, `401`, `403`, `404`, `409`, `422/400`, `500`, timeout, offline/retry, stale data và duplicate action.

Mỗi nghiệp vụ phải kiểm happy path và mọi transition bị cấm. Không suy luận UI đúng chỉ vì service/unit test pass.

## 9. Test pyramid và công cụ

1. Domain/unit: transition, formatter, validation.
2. Repository/PostgreSQL: Flyway, lock, unique constraint, rollback, concurrency.
3. MVC/API: auth, ownership, status code, idempotency contract.
4. Vaadin component tests: visibility, enabled state và localized labels.
5. Browser E2E ephemeral: full authenticated write flows.
6. Browser read-only deployed: TLS, routing, responsive, console/network errors.
7. Visual regression: golden screenshots có threshold và review thủ công khi baseline đổi.
8. Accessibility: axe/WCAG automation cộng keyboard/manual checks.

Artifacts phải chứa commit SHA và tên môi trường; upload cả khi test fail.

## 10. Mức độ lỗi và vòng lặp sửa

- **P0:** mất/ghi sai dữ liệu, auth bypass, nhận tiền sai — dừng deploy ngay.
- **P1:** checkout/order/payment không dùng được hoặc IDOR — không merge.
- **P2:** nhánh trạng thái, responsive hoặc accessibility quan trọng lỗi — phải sửa trước sign-off, trừ khi user chấp nhận bằng văn bản.
- **P3:** cosmetic nhỏ — ghi backlog với ảnh và tiêu chí sửa.

Vòng lặp: reproduce → test đỏ → RCA → fix nhỏ → targeted test → full regression → review artifact. Sau ba lần sửa cùng lỗi không tiến triển, dừng và báo blocker; không tiếp tục sửa mù.

## 11. Release gates

- Không có P0/P1/P2 mở.
- Java tests, production package và PostgreSQL integration/concurrency xanh.
- Browser matrix và accessibility matrix xanh.
- Migration fresh + upgrade xanh; backup/restore drill đạt.
- Security/auth/IDOR checks xanh.
- PR review và CI xanh; merge bằng squash, không commit thẳng `main`.
- AWS deploy HTTPS/readiness/redirect xanh.
- QA hậu-deploy đúng commit xanh.
- Rollback digest đã biết và có lệnh phục hồi được kiểm chứng.

## 12. Bảng bằng chứng sống

Mỗi đợt QA cập nhật bảng này thay vì ghi “hoàn thiện 100%” chung chung.

| Khu vực | Automated | Browser matrix | Error branches | A11y | PostgreSQL write | AWS evidence | Trạng thái |
|---|---:|---:|---:|---:|---:|---:|---|
| Storefront | Một phần | Chrome cơ bản | Một phần | Chưa | Checkout service có test | Read-only | CHƯA SIGN-OFF |
| Customer Account | Một phần | Anonymous/auth portal | Một phần | Chưa | Order service có test | Read-only | CHƯA SIGN-OFF |
| Admin | Một phần | Login smoke | Chưa | Chưa | Một phần | Read-only | CHƯA SIGN-OFF |
| POS | Một phần | Chưa đầy đủ | Chưa | Chưa | Một phần | Chưa | CHƯA SIGN-OFF |
| Warranty | Một phần | Lookup smoke | Một phần | Chưa | Một phần | Read-only | CHƯA SIGN-OFF |

## 13. Thứ tự thực thi đề xuất

1. Inventory route/state/role và bổ sung selector ổn định.
2. Chromium deep E2E cho Storefront + Customer Account trên stack ephemeral.
3. Admin + POS + Warranty deep E2E.
4. Firefox/WebKit và toàn bộ viewport.
5. Accessibility + visual regression.
6. PostgreSQL migration/concurrency mở rộng.
7. Backup/restore drill và rollback rehearsal.
8. AWS read-only hậu-deploy và báo cáo gap cuối.

Chỉ sau bước 8 mới xem xét `UI QA SIGN-OFF`; cutover production là quyết định riêng và cần tất cả release gates.
