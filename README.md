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
