#!/usr/bin/env bash
set -euo pipefail

cd "${1:?deployment directory is required}"

sudo docker compose pull
sudo docker compose up -d --remove-orphans

sudo docker compose ps
for attempt in $(seq 1 30); do
  if curl --fail --silent http://127.0.0.1:8090/actuator/health/readiness | grep -q UP; then
    echo 'AWS Java health check passed'
    exit 0
  fi
  sleep 5
done

echo 'AWS Java health check failed'
sudo docker compose logs --tail=150 java-platform database public-proxy
exit 1
