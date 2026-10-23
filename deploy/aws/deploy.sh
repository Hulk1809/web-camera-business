#!/usr/bin/env bash
set -euo pipefail

cd "${1:?deployment directory is required}"

legacy_id=""
legacy_name=""
legacy_restart=""

rollback_legacy_http() {
  if [[ -n "$legacy_id" ]]; then
    echo "Restoring legacy HTTP container after failed Java proxy deployment"
    sudo docker update --restart="$legacy_restart" "$legacy_id" >/dev/null || true
    sudo docker start "$legacy_id" >/dev/null || true
  fi
}

port_80_owner() {
  local container mappings
  for container in $(sudo docker ps -q); do
    mappings=$(sudo docker port "$container" 2>/dev/null || true)
    if grep -Eq -- '-> (0\.0\.0\.0|\[::\]):80$' <<<"$mappings"; then
      printf '%s' "$container"
      return
    fi
  done
}

listener=$(sudo ss -ltn '( sport = :80 )' | tail -n +2)
owner=$(port_80_owner)

if [[ -n "$listener" && -n "$owner" ]]; then
  owner_name=$(sudo docker inspect --format '{{.Name}}' "$owner" | sed 's#^/##')
  if [[ "$owner_name" != "progear-java-public-proxy-1" ]]; then
    headers=$(curl --silent --show-error --max-time 10 --head http://127.0.0.1/)
    if ! grep -Eiq '^X-Powered-By: Express\r?$' <<<"$headers"; then
      echo "Refusing to stop non-Express port 80 owner: $owner_name"
      sudo docker ps --filter "id=$owner" --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
      exit 1
    fi
    case "$owner_name" in
      progear-java-*|*postgres*|*database*|*caddy*)
        echo "Refusing to stop protected container: $owner_name"
        exit 1
        ;;
    esac
    legacy_id="$owner"
    legacy_name="$owner_name"
    legacy_restart=$(sudo docker inspect --format '{{.HostConfig.RestartPolicy.Name}}' "$owner")
    [[ -n "$legacy_restart" ]] || legacy_restart="no"
    echo "Retiring verified legacy Express HTTP container: $legacy_name"
    sudo docker update --restart=no "$legacy_id" >/dev/null
    sudo docker stop --time=20 "$legacy_id" >/dev/null
  fi
elif [[ -n "$listener" ]]; then
  echo "Port 80 is occupied by a non-Docker process; refusing automatic migration"
  sudo ss -ltnp '( sport = :80 )'
  exit 1
fi

if ! sudo docker compose pull || ! sudo docker compose up -d --remove-orphans; then
  rollback_legacy_http
  exit 1
fi

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
rollback_legacy_http
exit 1
