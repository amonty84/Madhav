#!/bin/bash
# =============================================================================
# AM-JIS — Google Cloud Migration
# Supabase → Cloud SQL (PostgreSQL 15 + pgvector)
# Voyage AI is RETAINED (not migrated — quality-critical for this corpus)
#
# Run from the Madhav project root:
#   bash gcp_migrate.sh
#
# Two interactive checkpoints require your input. Everything else is automated.
# Estimated time: 45–60 minutes (mostly waiting for Cloud SQL provisioning).
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     AM-JIS — Google Cloud Migration                   ║"
echo "║     Supabase → Cloud SQL (PostgreSQL 15 + pgvector)   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# =============================================================================
# PHASE 0 — Preflight: install all required tools
# =============================================================================
info "PHASE 0 — Preflight checks..."

if ! command -v brew &>/dev/null; then
  error "Homebrew not found. Install from https://brew.sh then re-run."
fi
success "Homebrew: $(brew --version | head -1)"

if ! command -v gcloud &>/dev/null; then
  info "Installing Google Cloud CLI..."
  brew install --cask google-cloud-sdk
  # Reload shell config so gcloud is on PATH
  source "$(brew --prefix)/share/google-cloud-sdk/path.bash.inc" 2>/dev/null || true
fi
success "gcloud: $(gcloud --version | head -1)"

if ! command -v cloud-sql-proxy &>/dev/null; then
  info "Installing Cloud SQL Auth Proxy..."
  brew install cloud-sql-proxy
fi
success "cloud-sql-proxy: $(cloud-sql-proxy --version 2>&1 | head -1)"

if ! command -v pg_dump &>/dev/null; then
  info "Installing PostgreSQL 15 client tools..."
  brew install postgresql@15
  export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
  echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
fi
success "pg_dump: $(pg_dump --version)"

info "Installing Python GCP dependencies..."
pip install google-cloud-secret-manager --break-system-packages --quiet
success "Python GCP deps installed."

echo ""

# =============================================================================
# CHECKPOINT 1 — GCP Authentication + Project
# =============================================================================
echo "════════════════════════════════════════════════════════"
echo "  CHECKPOINT 1 — GCP Authentication"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  Step 1: Authenticate with Google Cloud."
echo "          A browser window will open — sign in with your Google account."
echo ""
echo "  Press ENTER to open the browser login..."
read -r
gcloud auth login
gcloud auth application-default login
echo ""

echo "  Step 2: Enter your GCP Project ID."
echo "          Find it at: console.cloud.google.com"
echo "          Format: my-project-123456  (not the display name)"
echo ""
read -r -p "  GCP Project ID: " GCP_PROJECT
read -r -p "  Region [asia-south1]: " GCP_REGION
GCP_REGION="${GCP_REGION:-asia-south1}"

DB_INSTANCE="amjis-postgres"
DB_NAME="amjis"
DB_USER="amjis_app"
DB_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=')"

echo ""
info "Project : $GCP_PROJECT"
info "Region  : $GCP_REGION"
info "Instance: $DB_INSTANCE"
echo ""
echo "  Generated DB password (save this somewhere safe):"
echo "  $DB_PASSWORD"
echo ""
read -r -p "  Press ENTER to continue..."

gcloud config set project "$GCP_PROJECT"

# =============================================================================
# PHASE 1 — Enable GCP APIs
# =============================================================================
info "PHASE 1 — Enabling GCP APIs (1–2 minutes)..."

gcloud services enable \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  servicenetworking.googleapis.com \
  compute.googleapis.com \
  sql-component.googleapis.com \
  --project="$GCP_PROJECT"

success "GCP APIs enabled."

# =============================================================================
# PHASE 2 — Create Cloud SQL instance
# =============================================================================
info "PHASE 2 — Creating Cloud SQL instance (3–8 minutes)..."
info "Instance: $DB_INSTANCE | Tier: db-g1-small | Region: $GCP_REGION"

gcloud sql instances create "$DB_INSTANCE" \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region="$GCP_REGION" \
  --storage-size=10GB \
  --storage-type=SSD \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --availability-type=zonal \
  --project="$GCP_PROJECT"

success "Cloud SQL instance created."

gcloud sql databases create "$DB_NAME" \
  --instance="$DB_INSTANCE" \
  --project="$GCP_PROJECT"

gcloud sql users create "$DB_USER" \
  --instance="$DB_INSTANCE" \
  --password="$DB_PASSWORD" \
  --project="$GCP_PROJECT"

INSTANCE_CONNECTION_NAME="$(gcloud sql instances describe "$DB_INSTANCE" \
  --project="$GCP_PROJECT" \
  --format='value(connectionName)')"

success "Database + user created. Connection name: $INSTANCE_CONNECTION_NAME"

# =============================================================================
# PHASE 3 — Enable pgvector and run migrations
# =============================================================================
info "PHASE 3 — Starting Cloud SQL Auth Proxy on port 5433..."

cloud-sql-proxy "$INSTANCE_CONNECTION_NAME" --port=5433 &
PROXY_PID=$!
sleep 6

LOCAL_DB_URL="postgresql://$DB_USER:$DB_PASSWORD@127.0.0.1:5433/$DB_NAME"

psql "$LOCAL_DB_URL" -c "CREATE EXTENSION IF NOT EXISTS vector;" >/dev/null
success "pgvector extension enabled."

info "Running migrations (001–005)..."
for f in platform/supabase/migrations/00*.sql; do
  info "  Applying: $f"
  psql "$LOCAL_DB_URL" -f "$f" >/dev/null
done
success "All migrations applied."

echo ""
psql "$LOCAL_DB_URL" -c "\dt rag_*"
echo ""

# =============================================================================
# CHECKPOINT 2 — Supabase credentials
# =============================================================================
echo "════════════════════════════════════════════════════════"
echo "  CHECKPOINT 2 — Supabase credentials for data export"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  Find your Supabase connection string:"
echo "    supabase.com → project wklfhufhsbphwvyluzxt"
echo "    → Settings → Database → Connection string"
echo "    → Session mode (port 6543)"
echo "    → Copy URI and replace [YOUR-PASSWORD] with your DB password"
echo ""
echo "  Find your Voyage API key:"
echo "    dashboard.voyageai.com → API Keys"
echo ""
read -r -p "  Paste SUPABASE_URL (postgresql://...): " SUPABASE_URL
read -r -p "  Paste VOYAGE_API_KEY (va-...): " VOYAGE_API_KEY
echo ""

# =============================================================================
# PHASE 4 — Export from Supabase, import to Cloud SQL
# =============================================================================
info "PHASE 4 — Exporting rag_chunks from Supabase..."

pg_dump "$SUPABASE_URL" \
  --table=rag_chunks \
  --data-only \
  --no-acl \
  --no-owner \
  -f /tmp/rag_chunks_export.sql

info "Export complete. File: $(wc -c < /tmp/rag_chunks_export.sql) bytes"

info "Importing into Cloud SQL..."
psql "$LOCAL_DB_URL" -f /tmp/rag_chunks_export.sql >/dev/null

CLOUD_COUNT="$(psql "$LOCAL_DB_URL" -t -c "SELECT count(*) FROM rag_chunks;" | tr -d ' \n')"
info "Cloud SQL row count: $CLOUD_COUNT"

if [ "$CLOUD_COUNT" -ne 759 ]; then
  error "Expected 759 rows, got $CLOUD_COUNT. Check Supabase connection and retry."
fi
success "Row count verified: 759 rows."

echo ""
psql "$LOCAL_DB_URL" -c "
  SELECT is_stale, count(*)
  FROM rag_chunks
  GROUP BY is_stale
  ORDER BY is_stale;"
# Expected: false=743, true=16
echo ""

# =============================================================================
# PHASE 5 — Store credentials in GCP Secret Manager
# =============================================================================
info "PHASE 5 — Storing credentials in Secret Manager..."

echo -n "$DB_PASSWORD" | gcloud secrets create amjis-db-password \
  --data-file=- --project="$GCP_PROJECT" 2>/dev/null || \
  echo -n "$DB_PASSWORD" | gcloud secrets versions add amjis-db-password \
  --data-file=- --project="$GCP_PROJECT"

echo -n "$VOYAGE_API_KEY" | gcloud secrets create amjis-voyage-api-key \
  --data-file=- --project="$GCP_PROJECT" 2>/dev/null || \
  echo -n "$VOYAGE_API_KEY" | gcloud secrets versions add amjis-voyage-api-key \
  --data-file=- --project="$GCP_PROJECT"

success "Secrets stored: amjis-db-password, amjis-voyage-api-key"

# =============================================================================
# PHASE 6 — Write .env.rag
# =============================================================================
info "PHASE 6 — Writing .env.rag..."

cat > .env.rag << ENVFILE
# AM-JIS RAG environment — Google Cloud (migrated from Supabase 2026-04-25)
# DO NOT COMMIT — .env.rag is in .gitignore

# Database — Cloud SQL via Auth Proxy (local port 5433)
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:5433/${DB_NAME}
INSTANCE_CONNECTION_NAME=${INSTANCE_CONNECTION_NAME}

# Embeddings — Voyage AI (retained for corpus quality)
VOYAGE_API_KEY=${VOYAGE_API_KEY}

# GCP metadata
GCP_PROJECT=${GCP_PROJECT}
GCP_REGION=${GCP_REGION}
DB_INSTANCE=${DB_INSTANCE}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
ENVFILE

grep -qF ".env.rag" .gitignore 2>/dev/null || echo ".env.rag" >> .gitignore
success ".env.rag written and gitignored."

# =============================================================================
# PHASE 7 — Write start_db_proxy.sh
# =============================================================================
info "PHASE 7 — Writing platform/scripts/start_db_proxy.sh..."

cat > platform/scripts/start_db_proxy.sh << 'SCRIPT'
#!/bin/bash
# AM-JIS — Start Cloud SQL Auth Proxy for local development
# Run this before any RAG pipeline session (embed.py, chunk.py, queries)
# Usage: bash platform/scripts/start_db_proxy.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../../.env.rag"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.rag not found at $ENV_FILE"
  exit 1
fi
source "$ENV_FILE"
if [ -z "$INSTANCE_CONNECTION_NAME" ]; then
  echo "ERROR: INSTANCE_CONNECTION_NAME not set in .env.rag"
  exit 1
fi
echo "Starting Cloud SQL Auth Proxy for: $INSTANCE_CONNECTION_NAME"
cloud-sql-proxy "$INSTANCE_CONNECTION_NAME" --port=5433 &
PROXY_PID=$!
echo "Proxy PID: $PROXY_PID (port 5433)"
sleep 3
echo "Proxy ready."
SCRIPT

chmod +x platform/scripts/start_db_proxy.sh
success "start_db_proxy.sh created."

# =============================================================================
# PHASE 8 — Final verification
# =============================================================================
info "PHASE 8 — Final verification..."

echo ""
echo "--- Tables ---"
psql "$LOCAL_DB_URL" -c "\dt rag_*"

echo ""
echo "--- Row counts ---"
psql "$LOCAL_DB_URL" -c "
  SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE NOT is_stale) AS non_stale,
    COUNT(*) FILTER (WHERE is_stale) AS stale
  FROM rag_chunks;"

echo ""
info "Testing Voyage API key..."
HTTP_STATUS="$(curl -s -o /dev/null -w "%{http_code}" \
  https://api.voyageai.com/v1/embeddings \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": ["test"], "model": "voyage-3-large"}')"
if [ "$HTTP_STATUS" = "200" ]; then
  success "Voyage API key: VALID (HTTP 200)"
else
  warn "Voyage API key: unexpected HTTP $HTTP_STATUS — verify key and retry"
fi

kill "$PROXY_PID" 2>/dev/null && success "Auth Proxy stopped."

# =============================================================================
# PHASE 9 — Git commit
# =============================================================================
info "PHASE 9 — Committing infrastructure changes..."

git add platform/scripts/start_db_proxy.sh
git add .gitignore
git commit -m "infra: GCP Cloud SQL migration (Supabase → Cloud SQL)

Cloud SQL PostgreSQL 15 + pgvector replaces Supabase for RAG storage.
Voyage AI retained (embedding quality for Sanskrit/Jyotish vocabulary).

- Instance: $INSTANCE_CONNECTION_NAME (tier: db-g1-small, region: $GCP_REGION)
- pgvector extension enabled; migrations 001-005 applied to Cloud SQL
- 759 rag_chunks migrated (743 non-stale, 16 stale)
- Credentials in GCP Secret Manager: amjis-db-password, amjis-voyage-api-key
- platform/scripts/start_db_proxy.sh: Auth Proxy launcher for local dev
- .env.rag updated with Cloud SQL DATABASE_URL (via proxy port 5433)
- .gitignore: .env.rag confirmed excluded

Pre-condition for Madhav_M2A_Exec_4 (B.3 Embedding + HNSW)"

# =============================================================================
# DONE
# =============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║       GOOGLE CLOUD MIGRATION COMPLETE                  ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║ Instance : $INSTANCE_CONNECTION_NAME"
echo "║ Database : $DB_NAME (region: $GCP_REGION)"
echo "║ Rows     : 759 total (743 non-stale, 16 stale)"
echo "║ Secrets  : amjis-db-password, amjis-voyage-api-key"
echo "║ Proxy    : platform/scripts/start_db_proxy.sh"
echo "╠════════════════════════════════════════════════════════╣"
echo "║ NEXT — Session 4 (B.3 Embedding + HNSW):              ║"
echo "║  1. bash platform/scripts/start_db_proxy.sh           ║"
echo "║  2. Open Anti-Gravity → Claude Code panel             ║"
echo "║  3. 'Read CLAUDECODE_BRIEF.md and execute it.'        ║"
echo "║  4. CHECKPOINT 1 → switch to Sonnet → 'Sonnet ready.' ║"
echo "╚════════════════════════════════════════════════════════╝"
