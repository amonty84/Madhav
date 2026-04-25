SUPABASE FULL MIGRATION — SESSION 1: INFRASTRUCTURE
====================================================

PRE-FLIGHT (run in terminal before starting this session):
  cd /Users/Dev/Vibe-Coding/Apps/Madhav
  mv CLAUDECODE_BRIEF.md CLAUDECODE_BRIEF.md.hold

POST-SESSION (run in terminal after Claude Code confirms complete):
  cd /Users/Dev/Vibe-Coding/Apps/Madhav
  mv CLAUDECODE_BRIEF.md.hold CLAUDECODE_BRIEF.md

---

OBJECTIVE
---------
Migrate the AM-JIS app database tables and file storage out of Supabase onto
Google Cloud (Cloud SQL + GCS). This is pure infrastructure — no application
code changes in this session. The app will keep talking to Supabase until
Session 2, so do NOT touch any TypeScript source files.

---

ENVIRONMENT
-----------
GCP credentials and connection details are in .env.rag at the project root.
Key variables: DATABASE_URL, INSTANCE_CONNECTION_NAME, GCP_PROJECT, GCP_REGION,
DB_INSTANCE, DB_NAME, DB_USER, DB_PASSWORD (this is the Cloud SQL password).

The Cloud SQL Auth Proxy connects on port 5433.

Supabase project URL and service role key are in platform/.env.local (check
first) or platform/.env.production:
  NEXT_PUBLIC_SUPABASE_URL  (e.g. https://wklfhufhsbphwvyluzxt.supabase.co)
  SUPABASE_SERVICE_ROLE_KEY

---

PHASE 1: START CLOUD SQL AUTH PROXY
-------------------------------------
Source .env.rag to load all GCP variables:
  set -o allexport && source .env.rag && set +o allexport

Start the proxy:
  cloud-sql-proxy "$INSTANCE_CONNECTION_NAME" --port=5433 &
  PROXY_PID=$!
  sleep 6

Set the local connection URL:
  LOCAL_DB_URL="postgresql://$DB_USER:$DB_PASSWORD@127.0.0.1:5433/$DB_NAME"

---

PHASE 2: APPLY MIGRATIONS 006 AND 007 TO CLOUD SQL
----------------------------------------------------
Cloud SQL does not have Supabase's auth schema or storage schema.
Strip the three incompatible lines from migration 006 before applying:
  - DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  - DROP POLICY IF EXISTS "storage: astrologer all" ON storage.objects;
  - DROP POLICY IF EXISTS "storage: client read own" ON storage.objects;

Create a patched version with sed and apply it:

  sed '/on_auth_user_created ON auth\.users/d;
       /storage: astrologer all.*storage\.objects/d;
       /storage: client read own.*storage\.objects/d' \
    platform/supabase/migrations/006_firebase_uid_schema.sql \
    > /tmp/006_cloud_sql.sql

  psql "$LOCAL_DB_URL" -f /tmp/006_cloud_sql.sql

Then apply migration 007 (no Supabase-specific schema refs):
  psql "$LOCAL_DB_URL" -f platform/supabase/migrations/007_user_management.sql

Verify migrations applied:
  psql "$LOCAL_DB_URL" -c "\d profiles"

Confirm: profiles.id is text type; columns username, email, status, approved_at,
approved_by exist; role check constraint includes 'super_admin'.

---

PHASE 3: MIGRATE APP TABLE DATA FROM SUPABASE TO CLOUD SQL
------------------------------------------------------------
Write a Python script at /tmp/migrate_app_data.py using these steps:

  1. Load SUPABASE_URL and SERVICE_ROLE_KEY from platform/.env.local
     (fall back to platform/.env.production).
  2. Load DATABASE_URL from .env.rag for the Cloud SQL connection.
  3. Install dependencies: pip install psycopg2-binary requests --break-system-packages -q
  4. For each table below, fetch ALL rows from Supabase via PostgREST:
       GET {SUPABASE_URL}/rest/v1/{table}?select=*
       Headers: apikey: {SERVICE_ROLE_KEY}
                Authorization: Bearer {SERVICE_ROLE_KEY}
                Range: 0-9999
  5. Insert each row into Cloud SQL using psycopg2 with ON CONFLICT DO NOTHING.
     Parameterize all values to avoid SQL injection.
  6. Print: table name, rows fetched from Supabase, rows inserted into Cloud SQL.

Migrate in this FK-safe order:
  profiles, charts, conversations, messages, pyramid_layers,
  message_feedback, chat_attachments, conversation_shares, access_requests

Run the script:
  python /tmp/migrate_app_data.py

After the script completes, verify row counts in Cloud SQL:
  psql "$LOCAL_DB_URL" -c "
    SELECT 'profiles'           AS tbl, COUNT(*) FROM profiles
    UNION ALL SELECT 'charts',           COUNT(*) FROM charts
    UNION ALL SELECT 'conversations',    COUNT(*) FROM conversations
    UNION ALL SELECT 'messages',         COUNT(*) FROM messages
    UNION ALL SELECT 'pyramid_layers',   COUNT(*) FROM pyramid_layers
    UNION ALL SELECT 'message_feedback', COUNT(*) FROM message_feedback
    UNION ALL SELECT 'chat_attachments', COUNT(*) FROM chat_attachments
    UNION ALL SELECT 'conversation_shares', COUNT(*) FROM conversation_shares
    UNION ALL SELECT 'access_requests',  COUNT(*) FROM access_requests
    ORDER BY tbl;"

---

PHASE 4: CREATE GCS BUCKETS
-----------------------------
Source .env.rag and ensure GCP_PROJECT + GCP_REGION are set.
Create two private GCS buckets with uniform access control:

  gcloud storage buckets create "gs://${GCP_PROJECT}-chat-attachments" \
    --location="$GCP_REGION" --uniform-bucket-level-access --project="$GCP_PROJECT"

  gcloud storage buckets create "gs://${GCP_PROJECT}-chart-documents" \
    --location="$GCP_REGION" --uniform-bucket-level-access --project="$GCP_PROJECT"

Set CORS on chat-attachments (required for signed-URL uploads from the browser):
  cat > /tmp/cors.json << 'EOF'
  [{"origin":["https://madhav.marsys.in","http://localhost:3000"],
    "method":["GET","PUT","POST","HEAD"],
    "responseHeader":["Content-Type","Content-Length","Authorization"],
    "maxAgeSeconds":3600}]
  EOF

  gcloud storage buckets update "gs://${GCP_PROJECT}-chat-attachments" \
    --cors-file=/tmp/cors.json

Confirm both buckets exist:
  gcloud storage buckets list --project="$GCP_PROJECT" | grep "$GCP_PROJECT-"

---

PHASE 5: MIGRATE SUPABASE STORAGE FILES
-----------------------------------------
Write a Python script at /tmp/migrate_storage.py:

  1. Load SUPABASE_URL + SERVICE_ROLE_KEY from platform/.env.local or .env.production.
  2. Load GCP_PROJECT from .env.rag.
  3. List all Supabase storage buckets:
       GET {SUPABASE_URL}/storage/v1/bucket
       Headers: apikey: {SERVICE_ROLE_KEY}, Authorization: Bearer {SERVICE_ROLE_KEY}
  4. For each bucket, list all objects:
       POST {SUPABASE_URL}/storage/v1/object/list/{bucket_name}
       Body: {"prefix":"","limit":1000,"offset":0}
  5. For each file, download from Supabase:
       GET {SUPABASE_URL}/storage/v1/object/{bucket_name}/{object_path}
     Then save to a temp file and upload to the corresponding GCS bucket via:
       gcloud storage cp /tmp/... gs://{GCP_PROJECT}-{bucket_name}/{object_path}
  6. Print: bucket name, files migrated, any errors.
     If a bucket is empty, print "bucket {name}: 0 files (skipped)" and continue.

Run the script:
  python /tmp/migrate_storage.py

---

PHASE 6: STOP PROXY, UPDATE .env.rag, AND COMMIT
--------------------------------------------------
Kill the Auth Proxy:
  kill $PROXY_PID 2>/dev/null || pkill -f "cloud-sql-proxy" || true

Append bucket names to .env.rag (only if not already present):
  grep -q "GCS_BUCKET_CHAT" .env.rag || cat >> .env.rag << ENVAPPEND

# GCS Storage Buckets
GCS_BUCKET_CHAT_ATTACHMENTS=${GCP_PROJECT}-chat-attachments
GCS_BUCKET_CHART_DOCUMENTS=${GCP_PROJECT}-chart-documents
ENVAPPEND

Commit:
  git add .env.rag
  git commit -m "infra: app DB + storage migrated to Cloud SQL + GCS

  - Migrations 006 (uuid→text, RLS cleanup) + 007 (user mgmt, super_admin role)
    applied to Cloud SQL PostgreSQL 15
  - App table data migrated from Supabase via PostgREST API (row counts verified)
  - GCS buckets created: \${GCP_PROJECT}-chat-attachments,
    \${GCP_PROJECT}-chart-documents
  - CORS configured on chat-attachments bucket
  - Storage files migrated (or confirmed empty)
  - .env.rag updated with GCS_BUCKET_* names

  Pre-condition for Session 2 (drop @supabase/supabase-js, deploy to Cloud Run)"

Print a final COMPLETION SUMMARY showing:
  - Cloud SQL: schema version, row counts per table
  - GCS: both bucket names
  - Storage migration: files migrated per bucket
  - Status: READY FOR SESSION 2
