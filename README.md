# 📷 Hệ Thống Web Bán Camera An Ninh (Storefront & Admin)
> **Nền tảng thương mại điện tử chuyên biệt ngành Camera An Ninh, tích hợp Kubernetes (Azure AKS), CI/CD GitHub Actions & PostgreSQL.**

---

## 🌟 1. Tổng Quan Kiến Trúc

- **Storefront (Khách hàng):** React + Tailwind CSS (Port `3000`) — Banner công nghệ ColorVu & AI AcuSense, lọc đa tiêu chí (độ phân giải, tính năng AI), xem specs JSONB chi tiết, giỏ hàng & thanh toán VietQR / COD, tra cứu bảo hành Serial Number trực tiếp.
- **Admin Portal (Quản trị):** React + Vite + Tailwind CSS (Port `3001` local / Port `80` K8s) — Dashboard doanh thu, Quản lý sản phẩm camera, Quản lý đơn hàng, Quản lý kho Serial Number bảo hành, Giám sát cụm AKS `k8s-hulk-lab`.
- **Backend API:** NestJS (TypeScript) + Prisma ORM (Port `4000`) — Swagger API docs tại `/api/docs`, xác thực JWT + phân quyền RBAC, giao dịch trừ kho ACID an toàn tuyệt đối.
- **Database Engine:** PostgreSQL 16 (StatefulSet với 20GB Azure Managed Disk CSI) + Redis cache.
- **Hạ tầng K8s:** Cụm Azure AKS **`k8s-hulk-lab`** (2 Nodes Ubuntu Linux).
- **CI/CD Pipeline:** GitHub Actions tự động build Multi-stage Docker images và rolling update vào AKS.

---

## 📁 2. Cấu Trúc Thư Mục Dự Án

```text
web camera business/
├── apps/
│   ├── backend/               # NestJS API (Prisma ORM, Swagger, JWT)
│   │   ├── prisma/            # Schema PostgreSQL & Seed dữ liệu mẫu camera
│   │   ├── src/               # Auth, Products, Orders, Warranty, Dashboard
│   │   └── Dockerfile         # Multi-stage build
│   │
│   ├── web-store/             # Web bán hàng cho Khách Hàng (Port 3000)
│   │   ├── src/               # UI Storefront, Hero, Filter, Cart, Checkout, Tra cứu SN
│   │   ├── nginx.conf
│   │   └── Dockerfile
│   │
│   └── web-admin/             # Giao diện Quản Trị Admin (Port 3001 / Port 80)
│       ├── src/               # Dashboard, CRUD camera, Đơn hàng, Quản lý Serial
│       ├── nginx.conf
│       └── Dockerfile
│
├── deploy/
│   ├── docker-compose.yml     # Khởi chạy PostgreSQL 16 & Redis local
│   └── k8s/                   # Toàn bộ manifests cho cụm k8s-hulk-lab
│       ├── 00-namespace.yaml
│       ├── 01-postgres/       # StatefulSet + Azure Disk PVC 20GB
│       ├── 02-redis/          # Redis Cache
│       ├── 03-backend/        # Deployment 2 replicas + Service + ConfigMap + Secret
│       ├── 04-web-store/      # Storefront Deployment 2 replicas
│       ├── 05-web-admin/      # Admin Deployment 2 replicas
│       └── 06-ingress/        # NGINX Ingress rules + Let's Encrypt SSL
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline GitHub Actions deploy vào AKS k8s-hulk-lab
├── package.json               # Root monorepo workspace
└── README.md
```

---

## 🚀 3. Hướng Dẫn Chạy Thử Nghiệm Tại Local

### Bước 1: Khởi động Database PostgreSQL & Redis bằng Docker
```bash
npm run docker:up
# Lệnh này sẽ bật container postgres:16-alpine (port 5432) và redis:7-alpine (port 6379)
```

### Bước 2: Cài đặt Dependencies & Khởi chạy Backend
```bash
# Cài đặt thư viện cho toàn bộ Monorepo
npm install

# Di chuyển vào backend để tạo DB schema & nạp dữ liệu mẫu
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Chạy Backend API (Port 4000)
npm run start:dev
# Swagger API docs xem tại: http://localhost:4000/api/docs
```

### Bước 3: Khởi chạy Web Khách Hàng & Web Admin
Mở 2 terminal mới:
```bash
# Terminal 1: Chạy Web Khách Hàng (Port 3000)
npm run dev:store
# Truy cập: http://localhost:3000

# Terminal 2: Chạy Web Admin Quản Trị (Port 3001)
npm run dev:admin
# Truy cập: http://localhost:3001
```

---

## ☸️ 4. Triển Khai Lên Cụm Azure Kubernetes Service (`k8s-hulk-lab`)

### Bước 1: Đăng nhập Azure CLI và lấy Kubeconfig
```bash
az login
az aks get-credentials --resource-group <YOUR_RESOURCE_GROUP> --name k8s-hulk-lab
```

### Bước 2: Áp dụng các file Manifests
```bash
# 1. Tạo namespace
kubectl apply -f deploy/k8s/00-namespace.yaml

# 2. Triển khai PostgreSQL StatefulSet & Redis
kubectl apply -f deploy/k8s/01-postgres/
kubectl apply -f deploy/k8s/02-redis/

# 3. Triển khai Backend API, Web Store và Web Admin
kubectl apply -f deploy/k8s/03-backend/backend.yaml
kubectl apply -f deploy/k8s/04-web-store/web-store.yaml
kubectl apply -f deploy/k8s/05-web-admin/web-admin.yaml

# 4. Triển khai Ingress NGINX định tuyến domain
kubectl apply -f deploy/k8s/06-ingress/ingress.yaml
```

### Bước 3: Kiểm tra trạng thái Pods trên cụm
```bash
kubectl get pods,svc,pvc -n camera-shop
```

---

## 🔄 5. Cấu Hình GitHub Actions CI/CD Tự Động Hóa

Để GitHub Actions tự động build và deploy vào cụm `k8s-hulk-lab` mỗi khi bạn push code lên GitHub:

1. Tạo một Azure Service Principal:
   ```bash
   az ad sp create-for-rbac --name "github-actions-camera-shop" --role contributor \
     --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/<YOUR_RG> \
     --sdk-auth
   ```
2. Sao chép toàn bộ chuỗi JSON trả về.
3. Trên GitHub Repository của bạn, vào **Settings -> Secrets and variables -> Actions -> New repository secret**:
   - Tên: `AZURE_CREDENTIALS`
   - Giá trị: Dán chuỗi JSON của Service Principal ở trên.
4. Mỗi lần bạn `git push origin main`, workflow `.github/workflows/ci-cd.yml` sẽ tự động:
   - Build 3 Docker images: `backend`, `camera-store`, `camera-admin`.
   - Push lên GitHub Container Registry (`ghcr.io`).
   - Kết nối vào cụm AKS `k8s-hulk-lab` và thực hiện rolling update Pods với **Zero-downtime**.
