# 🎬 PRO GEAR — Hệ Thống Thương Mại Điện Tử Máy Ảnh, Máy Quay Cinema & Flycam DJI
> **Nền tảng thương mại điện tử chuyên nghiệp cho ngành Nhiếp Ảnh & Điện Ảnh (Sony Alpha, Canon EOS, Fujifilm, Blackmagic Cinema, Flycam & Gimbal DJI). Tích hợp Monorepo NestJS API, PostgreSQL, React Vite & hạ tầng Kubernetes AKS.**

---

## 🌟 1. Tổng Quan Kiến Trúc & Luồng Thông API

- **Storefront (Khách hàng):** React + Tailwind CSS (Port `3000`)
  - Banner công nghệ điện ảnh (Apple ProRes, 4K 120p, 8K RAW, Hasselblad 4/3 CMOS).
  - Lọc đa tiêu chí: Danh mục (Mirrorless, Cinema Line, Flycam DJI, Gimbal Ronin, Action Cam, Lens, Mic thu âm), Thương hiệu (DJI, Sony, Canon, Fujifilm, Blackmagic, Nikon).
  - Giỏ hàng & Thanh toán tự động: **VietQR** (sinh mã QR ngân hàng động kèm mã đơn & số tiền) / **COD**.
  - **Thông API Đặt Hàng:** Khi khách ấn Đặt Hàng, gửi `POST /api/orders` tới Backend; đơn hàng ngay lập tức xuất hiện trong Admin Portal để quản trị viên duyệt.
  - **Tra cứu bảo hành Serial:** Gửi `GET /api/warranty/:serialNumber` kiểm tra nguồn gốc chính hãng và hạn bảo hành.

- **Admin Operations (Quản trị):** React + Vite + Tailwind CSS (Port `3001` local / Port `80` K8s)
  - Dashboard doanh thu thời gian thực, tổng đơn hàng, cảnh báo tồn kho.
  - **Quản lý thiết bị (Products):** Thêm mới máy ảnh, máy quay, flycam DJI với thông số cảm biến, video codec, dải tương phản, tải trọng gimbal. Nạp dữ liệu chuẩn mẫu (Seed).
  - **Quản lý đơn hàng (Orders) - Thông 100% với Bán Hàng:** Nhận đơn hàng mới từ Storefront tức thì (auto-polling & live API), duyệt trạng thái đơn: *Chờ xác nhận → Đã xác nhận → Đang giao hàng → Hoàn tất*.
  - **Quản lý Serial & Bảo hành:** Quản lý kho Serial Number (DJI-M3PRO-..., SONY-FX3-..., CANON-R5M2-...) gán vào đơn hàng.
  - **Giám sát K8s:** Trực quan hóa cụm Azure AKS `k8s-hulk-lab`.

- **Backend API:** NestJS (TypeScript) + Prisma ORM (Port `4000`)
  - RESTful APIs cho Products, Orders, Warranty, Dashboard, Categories.
  - Swagger Documentation trực quan tại `http://localhost:4000/api/docs`.

---

## 📁 2. Cấu Trúc Thư Mục Monorepo

```text
web camera business/
├── apps/
│   ├── backend/               # NestJS API (Prisma ORM, Swagger, PostgreSQL)
│   │   ├── prisma/            # Schema PostgreSQL & Seed dữ liệu máy ảnh/DJI
│   │   ├── src/               # Products, Orders, Warranty, Dashboard, Auth
│   │   └── Dockerfile
│   │
│   ├── web-store/             # Web Bán Hàng Pro Gear (Port 3000)
│   │   ├── src/               # Catalog, Filters, Detail Specs, Cart, VietQR Checkout, Tra cứu SN
│   │   └── vite.config.ts     # Proxy /api -> http://localhost:4000
│   │
│   └── web-admin/             # Web Quản Trị Operations (Port 3001)
│       ├── src/               # Dashboard, CRUD thiết bị, Duyệt đơn hàng live, Quản lý Serial
│       └── vite.config.ts     # Proxy /api -> http://localhost:4000
│
├── deploy/
│   ├── docker-compose.yml     # PostgreSQL 16 & Redis local
│   └── k8s/                   # Manifests Kubernetes AKS
└── package.json               # Root monorepo scripts
```

---

## 🚀 3. Hướng Dẫn Khởi Chạy Local

### Bước 1: Bật PostgreSQL & Redis qua Docker (Nếu cần DB thực tế)
```bash
npm run docker:up
```

### Bước 2: Chạy Backend API (Port 4000)
```bash
cd apps/backend
npm run prisma:generate
npm run prisma:seed   # Nạp bộ thiết bị DJI, Sony, Canon, Fujifilm mẫu
npm run start:dev
# Swagger xem tại: http://localhost:4000/api/docs
```

### Bước 3: Chạy Web Bán Hàng & Web Quản Trị Admin
Mở 2 cửa sổ terminal:
```bash
# Terminal 1: Chạy Web Khách Hàng (Port 3000)
npm run dev:store
# Truy cập: http://localhost:3000

# Terminal 2: Chạy Web Admin (Port 3001)
npm run dev:admin
# Truy cập: http://localhost:3001
```

*Lưu ý: Hệ thống đã tích hợp sẵn cơ chế đồng bộ dự phòng (Shared Sync Layer), do đó ngay cả khi backend chưa bật, các thao tác đặt hàng trên Web Khách Hàng vẫn lập tức đồng bộ sang Web Admin để bạn kiểm thử luồng bán hàng trơn tru.*

---

## 🧪 4. Kiểm Thử Tự Động Toàn Diện (Playwright QA & E2E Tester Suite)

Hệ thống đã tích hợp sẵn bộ kiểm thử tự động End-to-End với **@playwright/test** chạy trực tiếp trên Chromium Engine (`/usr/bin/microsoft-edge-stable`):

### 📋 Danh Sách Test Suites Đã Được Xác Thực (100% Pass):
1. **`tests/e2e/01-storefront-flow.spec.ts`**:
   - `TC-STORE-01`: Kiểm tra hiển thị Retail Header, danh mục, giỏ hàng, hotline.
   - `TC-STORE-02`: Kiểm tra bộ lọc Live Search thiết bị (Sony, DJI, Lens...).
   - `TC-STORE-03`: Thêm giỏ hàng và đặt hàng VietQR, kiểm tra hiển thị mã QR & số đơn hàng `PRO-YYYYMMDD-XXXX`.
2. **`tests/e2e/02-admin-operations.spec.ts`**:
   - `TC-ADMIN-01`: Kiểm tra điều hướng Sidebar Admin (Dashboard, Đơn Hàng, Sản Phẩm, Danh Mục, Bảo Hành).
   - `TC-ADMIN-02`: Kiểm tra bảng đơn hàng và modal xem chi tiết.
   - `TC-ADMIN-03`: Xuất bán tại quầy POS, gán khách hàng và kích hoạt bảo hành điện tử ngay lập tức.
3. **`tests/e2e/03-warranty-verification.spec.ts`**:
   - `TC-WARRANTY-01`: Tra cứu theo Mã đơn hàng (`PRO-20261016-8942`) hiển thị chứng nhận bảo hành Sony FX3 24 tháng kèm đồng hồ đếm ngược ngày hiệu lực.
   - `TC-WARRANTY-02`: Tra cứu theo Serial (`SONY-FX3-VN-9901`) hiển thị trạng thái đang hiệu lực.
   - `TC-WARRANTY-03`: Kiểm tra xử lý cảnh báo khi tra cứu mã không tồn tại.

### 💻 Các Lệnh Chạy Kiểm Thử:
```bash
# Chạy toàn bộ 9 ca kiểm thử tự động (headless mode)
npm run test:e2e

# Chạy kiểm thử có giao diện trực quan (headed mode - mở trình duyệt Edge)
npm run test:e2e:headed

# Mở Playwright Interactive UI Tester Studio
npm run test:e2e:ui

# Mở báo cáo HTML kết quả kiểm thử
npm run test:report
```

