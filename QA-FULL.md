# Kiểm thử Store và Admin

## Phạm vi và môi trường

- Store: duyệt/tìm/lọc sản phẩm, chi tiết, yêu thích, giỏ hàng, đặt hàng, tra cứu, bảo hành, tài khoản và chat.
- Admin: đăng nhập/phân quyền, dashboard, sản phẩm/ảnh/thông số, tồn kho, đơn hàng/POS/preorder, doanh thu, bảo hành và chat.
- Production `http://74.176.156.158`: kiểm tra trình duyệt desktop/mobile và HTTP chỉ đọc. Dữ liệu trình duyệt của ca kiểm thử được giữ trong context riêng.
- Các ca ghi dữ liệu dùng môi trường local và PostgreSQL test riêng. Không đặt đơn hoặc thay đổi dữ liệu kinh doanh trên production.
- Báo cáo này đang được tổng hợp; không coi HTTP 200 hoặc E2E fallback là chứng nhận tính đúng đắn toàn hệ thống.

## Kiểm tra đã có trước đợt full test

- Tồn kho: 5 unit + 6 integration HTTP/PostgreSQL pass; xem `QA-INVENTORY.md`.
- Build backend, Store, Admin pass.
- 27 E2E trước đây pass với fallback, không đại diện kiểm thử tích hợp API thật.

## Production: phân phối tài nguyên

- HTML Store/Admin, bundle JavaScript và CSS hiện tại: HTTP 200, MIME đúng.
- Yêu cầu `/assets/qa-nonexistent-file.js`: HTTP 200 với MIME `text/html` (trả SPA HTML thay vì 404).
- Nếu trình duyệt giữ HTML tham chiếu bundle cũ không còn trên server, hành vi trên có thể gây lỗi tải module và trang trống. Chưa có bằng chứng đây là nguyên nhân ảnh người dùng gửi.
- HTML và assets kiểm tra không có `Cache-Control` tường minh.

## Kết quả cuối

- `npm run test:e2e`: **41/41 pass** với Store, Admin, API và PostgreSQL test riêng.
- Backend unit: **5/5 pass**.
- Inventory integration HTTP/PostgreSQL: **6/6 pass**.
- `npm run build:all`: backend, Store và Admin đều pass.
- Admin CRUD chuyên sâu: đăng nhập thật, sản phẩm/ảnh/thông số, nhập kho, đơn hàng, tài chính, POS, bảo hành, xóa mềm và phân quyền đều pass.
- API quản trị chưa đăng nhập trả 401; JWT production đã chuyển sang GitHub Secret/Kubernetes Secret và được xoay mới.
- Production read-only: Store/Admin desktop và mobile render pass; chưa smoke test bản sửa vì chưa deploy.

### Các lỗi đã sửa trong đợt full test

- Trang Store trắng khi wishlist trong localStorage là `null` hoặc object.
- Server từ chối đơn nhưng Store vẫn tạo đơn giả và hiện QR thành công.
- Tra cứu/hủy đơn chỉ thay đổi localStorage; hủy nay cập nhật DB và hoàn tồn kho.
- Kết quả bảo hành serial `IN_STOCK` bị rỗng.
- Admin login hard-code phía trình duyệt và API quản trị không yêu cầu JWT.
- Finance crash khi category/brand API là object.
- Sản phẩm vừa tạo dùng ID tạm nên sửa ngay bị 500; cập nhật gửi field không hợp lệ tới Prisma.
- POS chỉ ghi localStorage, không lưu đơn/serial/tồn kho DB; thao tác nay là transaction và chặn bán lại serial/bán âm kho.
- Nhân viên có thể chuyển giao diện sang tài khoản quản trị.
- Xóa sản phẩm có liên kết đơn hàng báo thành công giả; nay chuyển sang ngừng hoạt động.
- Test E2E chờ `networkidle` không phù hợp với app polling, gây timeout giả.

### Giới hạn chưa được nghiệm thu như tích hợp thật

- Chat Store/Admin vẫn dùng localStorage, không có backend nên không trao đổi được giữa thiết bị/trình duyệt khác nhau.
- Customer login và Facebook OAuth vẫn là mô phỏng UI; chưa tích hợp tài khoản backend/Meta OAuth thật.
- Chưa kiểm thử giao dịch ngân hàng/webhook/refund, email ngoài hệ thống, Safari/Firefox, tải cao hay pentest.

**QA SIGN-OFF: APPROVED cho thương mại cốt lõi, tồn kho, Admin, POS và phân quyền API. Không phê duyệt chat đa thiết bị, customer auth hoặc Meta OAuth là tích hợp production thật.**

## Kết quả các nhóm

### Production — kết quả đã xác minh

| Ca kiểm tra | Kết quả | Bằng chứng |
| --- | --- | --- |
| Store desktop 1440px / mobile 390px | PASS hiển thị | Root có nội dung, không lỗi JavaScript, không tràn ngang |
| Admin login desktop / mobile | PASS hiển thị | Form đăng nhập hiển thị, không lỗi JavaScript, không tràn ngang |
| Wishlist lưu `null` | FAIL — P1 | `Cannot read properties of null (reading 'includes')`, root rỗng |
| Wishlist lưu `{}` | FAIL — P1 | `includes is not a function`, root rỗng |
| Wishlist JSON lỗi cú pháp | PASS khả năng phục hồi | Store vẫn hiển thị |
| Cache sản phẩm là `{}` | PASS khả năng phục hồi | Store vẫn hiển thị |
| GET `/api/orders` không token | FAIL — P1 phân quyền | HTTP 200 dù chưa đăng nhập; không ghi dữ liệu production |
| GET health/products/categories/brands | Quan sát HTTP 200 | Chưa đủ chứng minh đúng toàn bộ nghiệp vụ |
| GET `/api/dashboard/stats` | Quan sát HTTP 404 | Chưa xác định đây có phải route hợp lệ; không tính là lỗi chức năng |

Ảnh banner Unsplash `photo-1502982720700-bfff97f2da71?w=1000` bị `ERR_BLOCKED_BY_ORB` trong Edge.

**Tái hiện trang trống:** Trong context trình duyệt test riêng, đặt `localStorage.setItem('PRO_GEAR_WISHLIST', 'null')` (hoặc `'{}'`), rồi tải lại Store. Không chạy thao tác này trên phiên mua hàng thật. Đây là nguyên nhân đã tái hiện được, chưa xác minh dữ liệu trên máy người dùng.

Ca mobile ban đầu dùng nút tìm kiếm chỉ dành cho desktop nên assertion sai; kiểm tra lại với nội dung Store đã pass. Không tính assertion sai này là lỗi sản phẩm.

Artifacts: `/tmp/opencode/production-full-qa/results.json` và ảnh chụp cùng thư mục.

Kết quả chức năng local đã hoàn tất như phần tổng kết trên.
