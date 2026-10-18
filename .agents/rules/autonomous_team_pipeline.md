# Autonomous 3-Role Engineering Pipeline (Tester ➔ Fixer ➔ Deployer)

Khi người dùng yêu cầu quy trình làm việc tự động (Autonomous Teamwork) hoặc dùng lệnh `/goal`, Antigravity sẽ tự động kích hoạt chu trình khép kín gồm **3 chuyên gia kỹ thuật** tự giao việc cho nhau theo vòng lặp cho đến khi hoàn thiện 100%:

---

## 👥 Đội Ngũ 3 Chuyên Gia & Trách Nhiệm

### 1. 🧪 Role 1: QA Automation Tester (Người Kiểm Thử)
* **Trách nhiệm:**
  1. Chạy toàn bộ bộ test tự động của hệ thống (`npm run test:e2e`, test đơn vị, hoặc test API).
  2. Quét lỗi giao diện, logic dữ liệu, trạng thái API hoặc lỗi build.
  3. Nếu phát hiện bất kỳ test case nào bị **FAIL**:
     * Trích xuất thông tin lỗi: Tên test, file bị lỗi, dòng code, nội dung lỗi (`AssertionError` / `TypeError`).
     * **Bàn giao (Handoff)** ngay sang cho **Role 2 (Bug Fixer)** kèm tài liệu mô tả bug ngắn gọn.
  4. Nếu toàn bộ test case đều **PASS 100%**:
     * Ký duyệt nghiệm thu (`QA SIGN-OFF: APPROVED`).
     * **Bàn giao (Handoff)** sang cho **Role 3 (DevOps Deployer)**.

---

### 2. 👨‍💻 Role 2: Core Dev & Bug Fixer (Người Sửa Mã Nguồn)
* **Trách nhiệm:**
  1. Tiếp nhận báo cáo lỗi từ **Role 1 (Tester)**.
  2. Phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA).
  3. Tiến hành sửa mã nguồn trực tiếp trong workspace (`apps/web-store`, `apps/web-admin`, `apps/backend`).
  4. Tuân thủ nguyên tắc:
     * Sửa dứt điểm lỗi, không viết code chữa cháy tạm thời.
     * Bảo toàn tính toàn vẹn của hệ thống, không làm hỏng tính năng đã chạy tốt.
  5. Sau khi sửa xong:
     * **Bàn giao ngược lại cho Role 1 (Tester)** để chạy lại toàn bộ test suites kiểm chứng hồi quy (`Regression Testing`).

---

### 3. 🚀 Role 3: DevOps & Release Deployer (Người Đóng Gói & Triển Khai)
* **Trách nhiệm:**
  1. Chỉ làm việc sau khi nhận được `QA SIGN-OFF: APPROVED` từ **Role 1**.
  2. Chạy kiểm tra build đóng gói toàn bộ monorepo:
     ```bash
     npm run build:all
     ```
  3. Kiểm tra tính sẵn sàng của Docker Compose / Kubernetes (`deploy/docker-compose.yml`, `deploy/k8s/`).
  4. Tự động commit mã nguồn với định dạng conventional commit chuẩn:
     ```bash
     git add -A && git commit -m "feat/fix: [nội dung hoàn thiện]"
     ```
  5. Đẩy code lên remote branch (`git push origin main`) hoặc kích hoạt quy trình deploy.
  6. Báo cáo kết quả tổng kết toàn diện cho người dùng:
     * Danh sách bug đã sửa.
     * Số test cases đã pass.
     * Trạng thái build & deploy thành công.

---

## 🔄 Chu Trình Vòng Lặp Tự Động (Feedback Loop)

```
       [ BẮT ĐẦU TASK ]
              │
              ▼
    ┌───────────────────┐
    │  1. QA Tester     │ ◄───────────────────────────┐
    │  (Chạy test E2E)  │                             │
    └─────────┬─────────┘                             │
              │                                       │
         Có bug?                                      │
        /        \                                    │
   [CÓ]           [KHÔNG - PASS 100%]                 │
    │                      │                          │
    ▼                      ▼                          │
┌──────────────┐     ┌─────────────────────┐          │
│ 2. Bug Fixer │     │ 3. DevOps Deployer  │          │
│ (Sửa mã code)│     │ (Build & Push Deploy│          │
└───────┬──────┘     └──────────┬──────────┘          │
        │                       │                     │
        └───────────────────────┼─────────────────────┘
                                │
                                ▼
                       [ HOÀN THÀNH 100% ]
```

## ⚙️ Quy Tắc Tự Động Hóa (Autonomous Guardrails)
1. **Không dừng giữa chừng:** Nếu có lỗi, Fixer phải tiếp tục sửa và Tester phải tiếp tục test lại cho đến khi pass hoàn toàn.
2. **Dừng an toàn:** Nếu một lỗi lặp đi lặp lại quá 5 lần mà không thể tự giải quyết do thiếu thông tin từ bên thứ ba hoặc xung đột môi trường, Agent sẽ dừng lại và đưa ra câu hỏi làm rõ với người dùng.
