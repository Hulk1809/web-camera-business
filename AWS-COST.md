# Kế hoạch AWS mục tiêu 0 USD tiền mặt/tháng

## 1. Số dư hiện tại

Kiểm tra ngày 26/10/2026:

| Credit | Còn ghi nhận | Còn ước tính sau chi phí mở |
|---|---:|---:|
| AWS Free Tier promotion | 33,08 USD | 22,10 USD |
| RDS promotion | 20,00 USD | 20,00 USD |
| **Tổng** | **53,08 USD** | **42,10 USD** |

Hai credit hết hạn ngày **12/05/2027**. Tuy nhiên, credit RDS 20 USD chỉ dùng cho RDS/Aurora đủ điều kiện, không bù EC2/EBS/Public IPv4. Stack hiện tại chỉ có **22,10 USD credit ước tính sử dụng được**. Mục tiêu `0 USD` nghĩa hóa đơn tiền mặt bằng 0 khi credit còn đủ; không có cam kết AWS miễn phí vĩnh viễn.

## 2. Tài nguyên và chi phí tháng hiện tại đã kiểm tra

Kiểm kê read-only toàn bộ region ngày 26/10/2026:

- 1 EC2 `t4g.small` đang chạy tại Singapore.
- 1 EBS gp3 30 GB.
- 1 Elastic IP/Public IPv4.
- Không có RDS, NAT Gateway, Load Balancer, snapshot, S3, CloudFront hoặc Route 53.
- Không có CloudWatch Log Group hoặc AWS Backup recovery point tại Singapore.
- Chưa có AWS Budget; Cost Explorer chưa được bật.

Credit allocation ước tính của tháng 10/2026:

| Service | Chi phí đang khấu trừ credit |
|---|---:|
| Amazon EC2, gồm compute/storage liên quan | 7,99 USD |
| Amazon VPC/Public IPv4 | 3,00 USD |
| **Tổng usage ước tính tháng 10 đến lúc kiểm tra** | **10,99 USD** |

Không được coi 10,99 USD là steady-state chính xác: instance hiện tại khởi chạy ngày 23/10 và Billing API có thể gồm resource đã xóa trước đó. Cost Explorer đang bị tắt nên chưa tách được cost theo ngày/resource.

Kịch bản bảo thủ, nếu mỗi tháng tiếp tục dùng 10,99 USD, credit dùng được cho stack hiện tại còn khoảng:

```text
22,10 / 10,99 = 2,01 tháng
```

Sau đó có thể phát sinh khoảng **10,99 USD/tháng**, tương đương khoảng **280.000 VND/tháng**, trước traffic tăng, thuế và phí khác. Con số steady-state phải tính lại sau một tháng đầy đủ hoặc sau khi bật Cost Explorer.

## 3. Kiến trúc zero-cash

- Một EC2 `t4g.small` ARM64 chạy Spring Boot, PostgreSQL và Caddy bằng Docker Compose.
- EBS gp3 tối đa 20–30 GB.
- Không dùng RDS mặc định; giữ 20 USD RDS credit cho restore drill hoặc thử nghiệm có thời hạn.
- Không dùng ALB, NAT Gateway, ECS, EKS, WAF trả phí hoặc Multi-AZ.
- Dùng domain `nip.io` trong giai đoạn MVP để tránh phí domain/Route 53.
- Lưu ảnh đã tối ưu trên EBS lúc đầu; chỉ bật S3/CloudFront khi dung lượng hoặc traffic yêu cầu.
- GitHub Container Registry và GitHub Actions thay ECR/CodeBuild nếu quota GitHub còn đủ.
- CloudWatch tối thiểu; log chính giữ local, rotate 7–14 ngày.
- Secret truyền từ GitHub Actions vào file `.env` quyền `600`; không commit secret.

## 4. Ngân sách tháng

| Hạng mục | Gross ước tính | Tiền mặt mục tiêu |
|---|---:|---:|
| EC2 `t4g.small` | 0–18 USD | 0 USD nhờ trial/credit khi đủ điều kiện |
| EBS gp3 20–30 GB | 2–4 USD | 0 USD nhờ credit |
| Public IPv4 | khoảng 3,65 USD | 0 USD nhờ credit |
| Snapshot 10–20 GB | 1–2 USD | 0 USD nhờ credit |
| Data transfer thấp | 0–3 USD | 0 USD nhờ allowance/credit |
| Monitoring tối thiểu | 0–1 USD | 0 USD nhờ allowance/credit |
| **Kịch bản bảo thủ** | **khoảng 10,99 USD/tháng** | **0 USD/tháng khoảng 2 tháng nữa** |

Credit RDS 20 USD không kéo dài runway của kiến trúc EC2 hiện tại. Chỉ dùng credit này nếu chuyển PostgreSQL sang RDS có kiểm soát; chạy đồng thời EC2 + RDS có thể tăng burn tổng.

Không tạo RDS chạy 24/7 cùng EC2 trong giai đoạn zero-cash vì burn rate tăng mạnh.

## 5. Giới hạn bắt buộc

- Tối đa 1 EC2 đang chạy.
- Không tạo NAT Gateway hoặc Load Balancer.
- Không cấp Elastic IP/Public IPv4 thứ hai.
- EBS tổng tối đa 30 GB; snapshot tối đa 20 GB.
- Không bật paid support.
- Không dùng Secrets Manager nếu SSM Standard/CI secret đủ.
- Không giữ CloudWatch log quá 14 ngày.
- Không upload ảnh gốc dung lượng lớn; sinh WebP/AVIF trước khi lưu.
- Không chạy staging AWS 24/7; test staging bằng stack ephemeral local/CI.

## 6. Cost guardrails

1. Bật Cost Explorer; hiện account chưa được enable.
2. Tạo AWS Budget **12 USD/tháng** dù credit đang bù chi phí.
3. Alert tại 8 USD, 10 USD và 12 USD gross usage.
4. Tạo Cost Anomaly Detection.
5. Tag mọi resource: `Project=progear`, `Environment=production`, `Owner=<owner>`.
6. Chạy kiểm kê resource hằng tuần: EC2, EBS, snapshot, IPv4, RDS, NAT, ELB, S3.
7. Dừng/xóa resource thử nghiệm trong ngày.

## 7. Backup trong ngân sách thấp

- PostgreSQL `pg_dump` hằng ngày, nén gzip.
- Giữ 7 daily backup local.
- Đồng bộ 1–2 bản gần nhất sang S3 nếu chi phí vẫn dưới budget.
- Snapshot EBS trước migration lớn, xóa sau khi xác minh.
- Restore drill hàng tháng vào container PostgreSQL tạm trên cùng EC2 hoặc local; xóa ngay sau test.

Một EC2 là single point of failure. Kế hoạch này phù hợp MVP/lưu lượng thấp, không đáp ứng HA.

## 8. Điều kiện nâng cấp

Chuyển khỏi zero-cash khi một điều kiện xảy ra:

- Credit EC2/general còn dưới 15 USD hoặc còn dưới 60 ngày runway.
- Gross usage vượt 12 USD/tháng hai tháng liên tiếp.
- Dữ liệu/đơn hàng thật yêu cầu RPO/RTO tốt hơn single EC2.
- CPU > 60%, RAM > 75%, disk > 70% kéo dài.
- Doanh thu đủ trả RDS và HA.

Thứ tự nâng cấp: RDS Single-AZ → S3/CloudFront → app replica + ALB → Multi-AZ. Không nhảy thẳng Kubernetes.

## 9. Cảnh báo

- Free Tier và promotion có điều kiện dịch vụ, khu vực và ngày hết hạn.
- `remainingAmount` có thể chưa gồm toàn bộ usage đang xử lý; dùng `estimatedAmount` làm số an toàn hơn.
- Mục tiêu 0 USD có thể bị phá bởi traffic spike, IPv4, snapshot, log hoặc resource quên xóa.
- Cần thẻ thanh toán hợp lệ; AWS vẫn có thể thu phần vượt credit.

Nguồn kiểm tra cuối: AWS Billing Credits API, AWS Budgets và https://calculator.aws/.
