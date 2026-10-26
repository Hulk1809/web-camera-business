# Bộ QA Java 7 tầng chạy từ bên ngoài

Project Maven Java 21 này chỉ kiểm tra hệ thống qua HTTP/HTTPS và trình duyệt thật. Nó không import mã ứng dụng, không kết nối database và mặc định không gửi request ghi dữ liệu.

## Mô hình 7 tầng

| Tầng | Tag/profile | Phạm vi | Tính an toàn |
|---|---|---|---|
| L1 | `layer1` | Availability, chứng chỉ/TLS 1.2+, HTTP→HTTPS, health | Read-only |
| L2 | `layer2` | Contract JSON catalog, categories/brands, ranh giới auth admin | Read-only |
| L3 | `layer3` | Selenium smoke Store/Admin, desktop/mobile, overflow | Read-only; profile trình duyệt tạm |
| L4 | `layer4` | Catalog→detail và warranty not-found | Read-only |
| L5 | `layer5` | Security headers, TRACE, CORS, stack disclosure (OWASP-oriented passive) | Passive/read-only |
| L6 | `layer6` | p95 và tỉ lệ lỗi health bằng Java HTTP client | 20 request mặc định |
| L7 | `layer7` | Routing Store/Admin/API, probe liên tiếp, cache-busted HTML | Read-only |

L5 là security baseline thụ động, **không phải pentest đầy đủ**. L6 là threshold smoke, không thay thế load test có capacity plan.

## Chạy

Đích mặc định là production HTTPS:

```bash
cd qa-java
./run-in-docker.sh test
```

Chạy một tầng hoặc toàn bộ read-only:

```bash
./run-in-docker.sh -Player1 test
./run-in-docker.sh -Player3 test
./run-in-docker.sh -Pread-only test
```

Nếu máy đã có JDK 21, Maven và Chrome/Chromium:

```bash
mvn -Player2 test
mvn -Player6 test
```

Selenium dùng Selenium Manager để lấy driver khớp trình duyệt. Docker image cài Google Chrome stable từ repository chính thức (không dùng Chromium Snap launcher không tương thích container).

## Cấu hình môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `QA_BASE_URL` | `https://java-aws.54.179.55.104.nip.io` | URL hệ thống từ bên ngoài |
| `QA_TARGET` | `java` | Contract UI Java; không thay đổi tính black-box |
| `QA_TIMEOUT_SECONDS` | `20` | Timeout request/wait |
| `QA_ALLOW_INSECURE_TLS` | `false` | Chỉ dùng ở môi trường test có cert self-signed |
| `QA_PERF_REQUESTS` | `20` | Số health probes L6 (5..500) |
| `QA_PERF_CONCURRENCY` | `4` | Đồng thời L6 (1..20) |
| `QA_PERF_P95_MS` | `1500` | Ngưỡng p95 L6 |
### Quy tắc chống ghi production

- Các tầng mặc định chỉ dùng GET/TRACE thụ động. Không login, đặt đơn, cập nhật hay xóa business data.
- Bộ external QA hiện chỉ chạy read-only và không cung cấp fixture API trên ứng dụng đã deploy.

## Báo cáo và CI

Surefire tạo XML/TXT chuẩn CI tại `target/reports/junit/`. Exit code khác 0 nghĩa có regression hoặc môi trường đích không đáp ứng baseline. Nên publish cả thư mục này như test artifact.
