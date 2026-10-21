# Kế hoạch sửa và triển khai app

## Phân công 3 vai

| Vai | Công việc | Kết quả bàn giao |
| --- | --- | --- |
| Tester | Chạy build, kiểm thử hiện có; tái hiện lỗi Store/Admin/API; kiểm tra lại bản sửa | Danh sách lỗi có bước tái hiện và kết quả pass/fail |
| Fix | Ưu tiên lỗi đặt hàng, tồn kho và các lỗi Tester xác nhận; thêm kiểm thử hồi quy cho logic quan trọng | Bản sửa và bằng chứng kiểm thử |
| Deploy | Xác minh Git remote, quyền truy cập và cấu hình CI/CD; triển khai bản đã kiểm tra khi có đủ kết nối | Trạng thái triển khai, URL và kết quả smoke test |

## Thứ tự thực hiện

1. Tester và Deploy khảo sát song song; Fix rà soát luồng đặt hàng.
2. Sửa lỗi theo mức ảnh hưởng, chạy kiểm thử hồi quy và build.
3. Tổng hợp lỗi còn tồn tại và điều kiện triển khai còn thiếu.
4. Khi đủ quyền và đích triển khai: đưa bản sửa lên Git, chạy quy trình deploy, kiểm tra Store/Admin/API sau triển khai.

## Đợt sửa đầu tiên

- Chặn danh sách sản phẩm sai định dạng và số lượng không phải số nguyên dương khi đặt hàng.
- Trừ kho có điều kiện nguyên tử để tránh bán vượt tồn khi đơn hàng đến đồng thời.
- Chặn đặt hàng sản phẩm đã ngừng hoạt động.
- Giữ đúng tồn kho `0` khi tạo sản phẩm; chặn tồn kho âm hoặc không nguyên.
- Chặn tồn kho không hợp lệ khi cập nhật sản phẩm trước khi thay đổi dữ liệu hoặc ảnh.
- Sửa `test:report` để mở đúng thư mục `playwright-report`.
- Kiểm thử: `npm test --workspace backend` — 5 ca đã pass.
- Build toàn bộ: `npm run build:all` — backend, Admin và Store pass.
- Tester: 27/27 E2E pass trong chế độ fallback; backend localhost:4000 chưa kết nối được. Chưa nghiệm thu tích hợp API/database thật.

Kiểm thử cạnh tranh hiện dùng mô phỏng repository; cần kiểm thử tích hợp PostgreSQL để xác nhận hành vi đồng thời và rollback trên cơ sở dữ liệu thật.

## Kết nối triển khai đã xác minh

- Repository: https://github.com/Hulk1809/web-camera-business — remote đọc được.
- Push vào `main` kích hoạt `.github/workflows/ci-cd.yml`: build/push GHCR rồi deploy AKS, namespace `camera-shop`.
- Run gần nhất đã xác minh thành công: https://github.com/Hulk1809/web-camera-business/actions/runs/39275567948 (commit `0c5f5ac`). Đây là bản trước đợt sửa này.
- Đã đăng nhập GitHub CLI bằng tài khoản `Hulk1809`; `git push --dry-run origin main` thành công sau khi đăng nhập.
- Production: http://74.176.156.158 — Deploy đã kiểm tra GET `/`, `/admin/`, `/api/health`, `/api/products`, `/api/categories`, `/api/brands` đều HTTP 200 trên bản hiện tại.
- QA commerce cốt lõi: 41/41 E2E, 5/5 unit và 6/6 integration HTTP/PostgreSQL pass; build toàn bộ pass.
- Chat đa thiết bị, customer auth backend và Meta OAuth chưa phải tích hợp thật; chưa deploy bản sửa mới.
- JWT production đã được chuyển khỏi manifest sang GitHub Secret `JWT_SECRET` và Kubernetes Secret.
