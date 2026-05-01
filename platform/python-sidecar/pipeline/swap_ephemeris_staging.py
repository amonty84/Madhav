"""
One-shot script: insert build_manifests entry for bootstrap-phase14c
and swap ephemeris_daily_staging → ephemeris_daily live.

Run once. Idempotent: exits 0 immediately if ephemeris_daily already has rows.
"""
import os
import sys
import logging
import psycopg2

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

BUILD_ID = "bootstrap-phase14c"
DB_URL = os.environ.get("DATABASE_URL", "postgresql://amjis_app:KO09dpIN3SvNZCij6t7YtHNji4uv10D@127.0.0.1:5433/amjis")


def main() -> None:
    with psycopg2.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM ephemeris_daily")
            live_count = cur.fetchone()[0]
            if live_count > 0:
                log.info("ephemeris_daily already has %d rows. Nothing to do.", live_count)
                return

            cur.execute("SELECT COUNT(*) FROM ephemeris_daily_staging WHERE build_id = %s", (BUILD_ID,))
            staging_count = cur.fetchone()[0]
            if staging_count == 0:
                log.error("No rows in ephemeris_daily_staging for build_id=%s", BUILD_ID)
                sys.exit(1)
            log.info("Staging has %d rows for %s", staging_count, BUILD_ID)

            # Ensure build manifest exists
            cur.execute("SELECT 1 FROM build_manifests WHERE build_id = %s", (BUILD_ID,))
            if not cur.fetchone():
                log.info("Inserting build_manifests row for %s", BUILD_ID)
                cur.execute("""
                    INSERT INTO build_manifests
                      (build_id, triggered_by, registry_fingerprint, pipeline_image_uri,
                       embedding_model, embedding_dim, chunk_count, embedding_count,
                       status, manifest_uri, notes)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (build_id) DO NOTHING
                """, (
                    BUILD_ID,
                    "bootstrap_ephemeris.py one-shot Phase 14C Stream C",
                    "n/a",
                    "asia-south1-docker.pkg.dev/madhav-astrology/marsys-pipeline/pipeline:v1.0.5",
                    "n/a", 0, 0, 0,
                    "staging",
                    "gs://madhav-marsys-build-artifacts/bootstrap-phase14c/manifest.json",
                    "Swiss Ephemeris bootstrap 1900-01-01..2100-12-31 Lahiri sidereal, 660726 rows",
                ))

        conn.commit()
        log.info("Manifest inserted. Starting swap transaction (660K rows — may take ~30s)...")

        with conn.cursor() as cur:
            # Swap: staging → live
            cur.execute("DELETE FROM ephemeris_daily")
            cur.execute("""
                INSERT INTO ephemeris_daily
                  (date, planet, longitude_deg, latitude_deg, speed_deg_per_day,
                   is_retrograde, sign, sign_degree, nakshatra, nakshatra_pada,
                   ayanamsha, ephemeris_version, build_id)
                SELECT
                  date, planet, longitude_deg, latitude_deg, speed_deg_per_day,
                  is_retrograde, sign, sign_degree, nakshatra, nakshatra_pada,
                  ayanamsha, ephemeris_version, build_id
                FROM ephemeris_daily_staging
                WHERE build_id = %s
            """, (BUILD_ID,))
            cur.execute("SELECT COUNT(*) FROM ephemeris_daily")
            inserted = cur.fetchone()[0]
            log.info("Inserted %d rows into ephemeris_daily", inserted)

            cur.execute("DELETE FROM ephemeris_daily_staging WHERE build_id = %s", (BUILD_ID,))
            cur.execute("UPDATE build_manifests SET status = 'live', promoted_at = NOW() WHERE build_id = %s", (BUILD_ID,))

        conn.commit()
        log.info("Swap complete. ephemeris_daily live with %d rows.", inserted)


if __name__ == "__main__":
    main()
