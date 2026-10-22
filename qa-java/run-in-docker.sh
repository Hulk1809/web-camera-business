#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="${QA_DOCKER_IMAGE:-progear-qa-java:local}"

docker build --tag "$IMAGE" "$ROOT"
docker run --rm --init --shm-size=2g \
  --volume "$ROOT:/workspace" \
  --volume "${HOME}/.m2:/root/.m2" \
  --env QA_BASE_URL \
  --env QA_TIMEOUT_SECONDS \
  --env QA_ALLOW_INSECURE_TLS \
  --env QA_ALLOW_WRITES \
  --env QA_FIXTURE_API_URL \
  --env QA_FIXTURE_API_TOKEN \
  --env QA_PERF_REQUESTS \
  --env QA_PERF_CONCURRENCY \
  --env QA_PERF_P95_MS \
  "$IMAGE" "$@"
