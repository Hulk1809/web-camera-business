# Kế hoạch AWS mục tiêu 0 USD tiền mặt/tháng

## 1. Số dư hiện tại

Kiểm tra ngày 26/10/2026:

| Credit | Còn ghi nhận | Còn ước tính sau chi phí mở |
|---|---:|---:|
| AWS Free Tier promotion | 33,08 USD | 22,10 USD |
| RDS promotion | 20,00 USD | 20,00 USD |
| **Tổng** | **53,08 USD** | **42,10 USD** |

Hai credit hết hạn ngày **12/05/2027**. Mục tiêu `0 USD` nghĩa hóa đơn tiền mặt bằng 0 nhờ Free Tier/credit; không có cam kết AWS miễn phí vĩnh viễn.

## 2. Kiến trúc zero-cash

- Một EC2 `t4g.small` ARM64 chạy Spring Boot, PostgreSQL và Caddy bằng Docker Compose.
- EBS gp3 tối đa 20–30 GB.
- Không dùng RDS mặc định; giữ 20 USD RDS credit cho restore drill hoặc thử nghiệm có thời hạn.
- Không dùng ALB, NAT Gateway, ECS, EKS, WAF trả phí hoặc Multi-AZ.
- Dùng domain `nip.io` trong giai đoạn MVP để tránh phí domain/Route 53.
- Lưu ảnh đã tối ưu trên EBS lúc đầu; chỉ bật S3/CloudFront khi dung lượng hoặc traffic yêu cầu.
- GitHub Container Registry và GitHub Actions thay ECR/CodeBuild nếu quota GitHub còn đủ.
- CloudWatch tối thiểu; log chính giữ local, rotate 7–14 ngày.
- Secret truyền từ GitHub Actions vào file `.env` quyền `600`; không commit secret.

## 3. Ngân sách tháng

| Hạng mục | Gross ước tính | Tiền mặt mục tiêu |
|---|---:|---:|
| EC2 `t4g.small` | 0–18 USD | 0 USD nhờ trial/credit khi đủ điều kiện |
| EBS gp3 20–30 GB | 2–4 USD | 0 USD nhờ credit |
| Public IPv4 | khoảng 3,65 USD | 0 USD nhờ credit |
| Snapshot 10–20 GB | 1–2 USD | 0 USD nhờ credit |
| Data transfer thấp | 0–3 USD | 0 USD nhờ allowance/credit |
| Monitoring tối thiểu | 0–1 USD | 0 USD nhờ allowance/credit |
| **Tổng gross** | **7–29 USD/tháng** | **0 USD/tháng khi credit đủ** |

Với credit khả dụng ước tính **42,10 USD**, runway khoảng:

- **6 tháng** nếu gross 7 USD/tháng.
- **2 tháng** nếu gross 20 USD/tháng.
- **1–2 tháng** nếu gross gần 29 USD/tháng.

Không tạo RDS chạy 24/7 cùng EC2 trong giai đoạn zero-cash vì burn rate tăng mạnh.

## 4. Giới hạn bắt buộc

- Tối đa 1 EC2 đang chạy.
- Không tạo NAT Gateway hoặc Load Balancer.
- Không cấp Elastic IP/Public IPv4 thứ hai.
- EBS tổng tối đa 30 GB; snapshot tối đa 20 GB.
- Không bật paid support.
- Không dùng Secrets Manager nếu SSM Standard/CI secret đủ.
- Không giữ CloudWatch log quá 14 ngày.
- Không upload ảnh gốc dung lượng lớn; sinh WebP/AVIF trước khi lưu.
- Không chạy staging AWS 24/7; test staging bằng stack ephemeral local/CI.

## 5. Cost guardrails

1. Bật Cost Explorer; hiện account chưa được enable.
2. Tạo AWS Budget **10 USD/tháng** dù credit đang bù chi phí.
3. Alert tại 5 USD, 8 USD và 10 USD gross usage.
4. Tạo Cost Anomaly Detection.
5. Tag mọi resource: `Project=progear`, `Environment=production`, `Owner=<owner>`.
6. Chạy kiểm kê resource hằng tuần: EC2, EBS, snapshot, IPv4, RDS, NAT, ELB, S3.
7. Dừng/xóa resource thử nghiệm trong ngày.

## 6. Backup trong ngân sách thấp

- PostgreSQL `pg_dump` hằng ngày, nén gzip.
- Giữ 7 daily backup local.
- Đồng bộ 1–2 bản gần nhất sang S3 nếu chi phí vẫn dưới budget.
- Snapshot EBS trước migration lớn, xóa sau khi xác minh.
- Restore drill hàng tháng vào container PostgreSQL tạm trên cùng EC2 hoặc local; xóa ngay sau test.

Một EC2 là single point of failure. Kế hoạch này phù hợp MVP/lưu lượng thấp, không đáp ứng HA.

## 7. Điều kiện nâng cấp

Chuyển khỏi zero-cash khi một điều kiện xảy ra:

- Credit còn dưới 15 USD hoặc còn dưới 60 ngày tới hạn.
- Gross usage vượt 10 USD/tháng hai tháng liên tiếp.
- Dữ liệu/đơn hàng thật yêu cầu RPO/RTO tốt hơn single EC2.
- CPU > 60%, RAM > 75%, disk > 70% kéo dài.
- Doanh thu đủ trả RDS và HA.

Thứ tự nâng cấp: RDS Single-AZ → S3/CloudFront → app replica + ALB → Multi-AZ. Không nhảy thẳng Kubernetes.

## 8. Cảnh báo

- Free Tier và promotion có điều kiện dịch vụ, khu vực và ngày hết hạn.
- `remainingAmount` có thể chưa gồm toàn bộ usage đang xử lý; dùng `estimatedAmount` làm số an toàn hơn.
- Mục tiêu 0 USD có thể bị phá bởi traffic spike, IPv4, snapshot, log hoặc resource quên xóa.
- Cần thẻ thanh toán hợp lệ; AWS vẫn có thể thu phần vượt credit.

Nguồn kiểm tra cuối: AWS Billing Credits API, AWS Budgets và https://calculator.aws/.
