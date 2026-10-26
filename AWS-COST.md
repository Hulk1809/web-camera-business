# Ước tính chi phí AWS

## 1. Giả định

- Region: Singapore `ap-southeast-1`.
- 730 giờ/tháng, Linux ARM64 khi dependency hỗ trợ.
- Một ứng dụng Java modular monolith.
- PostgreSQL managed trên RDS cho production.
- 20–100 GB ảnh/tháng và 50–500 GB CDN/tháng tùy mức.
- Giá On-Demand trước thuế, domain, support plan và phí thanh toán ngân hàng.
- Không lấy Free Tier làm baseline. Giá cần xác nhận lại bằng AWS Pricing Calculator trước mua.

Tỷ giá kế hoạch: `1 USD = 25.500 VND`.

## 2. Phương án A — Dev/demo tiết kiệm

Một EC2 chạy app + PostgreSQL bằng Docker. Không phù hợp production vì app và DB chung failure domain.

| Hạng mục | Giả định | USD/tháng |
|---|---|---:|
| EC2 | `t4g.small`, 2 vCPU/2 GiB | 12–18 |
| EBS | gp3 30 GB | 3–4 |
| Public IPv4 | 1 địa chỉ, 730 giờ | khoảng 3.65 |
| S3 | 20 GB ảnh | 1 |
| CloudFront | 50 GB transfer | 0–6 |
| Route 53 | 1 hosted zone + queries thấp | 0.5–1 |
| CloudWatch | Log/metric thấp | 2–5 |
| Backup | Snapshot/EBS thấp | 1–3 |
| **Tổng** |  | **23–42 USD** |

Khoảng **587.000–1.071.000 VND/tháng**.

## 3. Phương án B — MVP production khuyến nghị

Một EC2 app, RDS PostgreSQL Single-AZ, S3/CloudFront. Chấp nhận downtime khi EC2 hoặc AZ lỗi; có backup và rollback.

| Hạng mục | Giả định | USD/tháng |
|---|---|---:|
| EC2 app | `t4g.small` hoặc `t4g.medium` | 15–35 |
| EBS | gp3 30 GB | 3–4 |
| RDS PostgreSQL | `db.t4g.micro/small`, Single-AZ | 18–45 |
| RDS storage/backup | gp3 30–50 GB + backup dư | 4–10 |
| Public IPv4 | 1 địa chỉ | khoảng 3.65 |
| S3 | 50 GB ảnh | 1–2 |
| CloudFront | 100–300 GB APAC | 8–36 |
| Route 53 | Hosted zone + DNS queries | 0.5–2 |
| CloudWatch | Logs, metrics, alarms | 5–15 |
| Secrets Manager/SSM | 5–10 secret/parameter | 0–5 |
| Data transfer khác | API/backup nhỏ | 2–10 |
| **Tổng** |  | **60–165 USD** |

Khoảng **1.530.000–4.208.000 VND/tháng**.

Ngân sách vận hành nên đặt **120 USD/tháng** và budget alert tại 50%, 80%, 100%.

## 4. Phương án C — HA production

Hai app task/instance qua ALB, RDS Multi-AZ, NAT hoặc VPC endpoints, WAF và giám sát đầy đủ.

| Hạng mục | Giả định | USD/tháng |
|---|---|---:|
| ECS/EC2 app | 2 task/instance | 50–120 |
| ALB | Giờ chạy + LCU | 20–40 |
| RDS PostgreSQL | `db.t4g.small`, Multi-AZ | 80–140 |
| RDS storage/backup | 50–100 GB | 10–25 |
| NAT Gateway | Giờ chạy + data, nếu dùng | 35–80 |
| S3 + CloudFront | 100 GB storage, 500 GB transfer | 30–70 |
| Route 53 | DNS + health checks | 1–5 |
| WAF | Web ACL + rules + requests | 10–30 |
| CloudWatch | Logs, metrics, alarms | 15–40 |
| Secrets/KMS | Secrets và key | 3–10 |
| **Tổng** |  | **254–560 USD** |

Khoảng **6.477.000–14.280.000 VND/tháng**.

## 5. Chi phí dễ bị bỏ sót

- Public IPv4 tính theo giờ.
- NAT Gateway có phí giờ và phí mỗi GB; tránh ở MVP nếu thiết kế mạng cho phép.
- CloudWatch log giữ vô hạn gây tăng phí; đặt retention 14–30 ngày.
- Snapshot và RDS backup vượt dung lượng miễn phí.
- CloudFront APAC đắt hơn US/EU.
- RDS CPU credit khi T-family chạy vượt baseline kéo dài.
- Cross-AZ transfer, ECR/GHCR pull và data egress.
- AWS Support, thuế VAT và phí domain không nằm trong tổng trên.

## 6. Tối ưu chi phí

1. Bắt đầu phương án B với `t4g.small`; đo heap/CPU trước khi tăng size.
2. Dùng ARM64 và multi-stage image.
3. S3 lifecycle cho ảnh gốc/backup cũ.
4. CloudFront cache ảnh theo content hash.
5. CloudWatch retention 14–30 ngày.
6. Không dùng NAT Gateway nếu chưa cần private egress.
7. Sau 2–3 tháng tải ổn định, mua Compute Savings Plan/RDS Reserved Instance.
8. AWS Budgets và Cost Anomaly Detection ngay ngày đầu.

## 7. Mốc mở rộng

- CPU app > 60% hoặc heap > 70% kéo dài: tăng app size hoặc thêm replica.
- RDS CPU/connection/storage > 70%: nâng DB trước peak.
- Cần uptime theo AZ: chuyển Multi-AZ và ít nhất hai app replicas.
- Media egress tăng: tối ưu ảnh WebP/AVIF, cache và lifecycle trước khi tăng hạ tầng.

## 8. Nguồn giá cần đối chiếu

- EC2 On-Demand: https://aws.amazon.com/ec2/pricing/on-demand/
- RDS PostgreSQL: https://aws.amazon.com/rds/postgresql/pricing/
- S3: https://aws.amazon.com/s3/pricing/
- CloudFront: https://aws.amazon.com/cloudfront/pricing/
- Route 53: https://aws.amazon.com/route53/pricing/
- AWS Pricing Calculator: https://calculator.aws/

Con số cuối phải xuất từ Calculator với region, traffic, storage, backup retention và topology đã chốt.
