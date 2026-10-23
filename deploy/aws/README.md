# AWS EC2 deployment

Target: Amazon Linux 2023 ARM64 with Docker Compose.

## Safety model

- The Java application binds to `127.0.0.1:8090`; Caddy owns ports `80` and `443`, redirects HTTP to HTTPS, and exposes `https://java-aws.54.179.55.104.nip.io`.
- PostgreSQL is reachable only on the private Compose network.
- Runtime credentials live in `.env` on EC2 and must never be committed.
- The container image is published for both `linux/amd64` and `linux/arm64`.

## Deploy

```bash
mkdir -p ~/progear-java
cd ~/progear-java
cp .env.example .env
chmod 600 .env
# Edit .env with production secrets.
docker compose pull
docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:8090/actuator/health
```

On a `t4g.micro`, stop unrelated workloads or resize the instance before starting this stack. Recommended minimum is `t4g.small`; `t4g.medium` provides safer production headroom.
