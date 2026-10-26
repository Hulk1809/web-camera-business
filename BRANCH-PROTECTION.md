# Checklist bảo vệ `main`

Người quản trị cấu hình trong GitHub → Settings → Rules → Rulesets (hoặc Branch protection rules). PR này không thay đổi repo settings.

- [ ] Áp dụng rule cho `main`; không cho push trực tiếp và không cho bypass ngoài quản trị được phê duyệt.
- [ ] Bắt buộc pull request với ít nhất **1 approval** trước merge; hủy approval cũ khi có commit mới.
- [ ] Bắt buộc các status checks **`verify`**, **`compose`**, **`security`** từ workflow CI; yêu cầu branch cập nhật với `main` trước merge.
- [ ] Không cho merge khi check đang pending, fail hoặc bị skip; không đặt `continue-on-error` cho scan.
- [ ] Kiểm tra rule bằng PR thử nghiệm: không có review hoặc một check đỏ phải chặn merge.

`security` chặn khi tìm thấy secret hoặc CVE **CRITICAL** ở dependency/image; lỗi scanner hoặc tải vulnerability DB cũng làm job fail. HIGH/MEDIUM/LOW vẫn hiện trong log nhưng không chặn merge ở phase này; nâng ngưỡng sau khi có quy trình xử lý và baseline. Không push image, không deploy; artifact gồm CycloneDX SBOM, digest và build metadata của image tag theo commit SHA. CI không dùng production secret hoặc AWS credential.
