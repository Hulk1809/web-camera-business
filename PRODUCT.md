# PRO GEAR

## Mục tiêu

Xây lại nền tảng commerce từ đầu. Phạm vi chức năng phải được duyệt trước khi scaffold application.

## Nguyên tắc cố định

- AWS là môi trường cloud duy nhất.
- Không hardcode secret hoặc dữ liệu khách thật.
- Production QA chỉ đọc.
- Write E2E chạy trên môi trường ephemeral tự hủy.
- Security, accessibility, backup/restore và rollback là release gate.

## Cần chốt

- Actor và role.
- Catalog, cart, checkout, payment, order, inventory, POS và warranty scope.
- Payment provider và quy trình xác nhận.
- SLA, RPO, RTO và ngân sách AWS.
- Browser/viewport hỗ trợ.
