#!/bin/bash
# AM-JIS — Start Cloud SQL Auth Proxy for local development
# Run this before any RAG pipeline session (embed.py, chunk.py, queries)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../../.env.rag"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.rag not found at $ENV_FILE"
  exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"
if [ -z "$INSTANCE_CONNECTION_NAME" ]; then
  echo "ERROR: INSTANCE_CONNECTION_NAME not set in .env.rag"
  exit 1
fi
export PATH="/opt/homebrew/opt/postgresql@15/bin:/opt/homebrew/bin:$PATH"
echo "Starting Cloud SQL Auth Proxy for: $INSTANCE_CONNECTION_NAME"
cloud-sql-proxy "$INSTANCE_CONNECTION_NAME" --port=5433 &
PROXY_PID=$!
echo "Proxy PID: $PROXY_PID (port 5433)"
sleep 3
echo "Proxy ready. Connect via: postgresql://${DB_USER}:*****@127.0.0.1:5433/${DB_NAME}"
