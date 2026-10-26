# PRO GEAR Java Platform

Nền tảng thương mại điện tử máy ảnh chạy Java 21, Spring Boot, Vaadin Flow và PostgreSQL trên AWS EC2.

## Thành phần

- `java-platform/`: ứng dụng Store, Admin, POS, đơn hàng, tồn kho và bảo hành.
- `qa-java/`: QA black-box 7 tầng và browser lifecycle trên PostgreSQL ephemeral.
- `deploy/aws/`: Docker Compose và script triển khai AWS EC2.
- `.github/workflows/java-platform-ci.yml`: build, test và publish image Java.
- `.github/workflows/aws-ec2-deploy.yml`: triển khai AWS.
- `.github/workflows/qa-java-7-layer.yml`: QA read-only sau triển khai.

## Chạy local

```bash
cd java-platform
docker compose up --build
```

## Kiểm thử

```bash
cd java-platform
mvn test
mvn -Pproduction -DskipTests package
```

QA deployed mặc định dùng `https://java-aws.54.179.55.104.nip.io` và chỉ đọc. Test ghi dữ liệu chỉ chạy local với PostgreSQL ephemeral cùng `QA_TARGET=java` và `QA_EPHEMERAL_WRITES=true`.
