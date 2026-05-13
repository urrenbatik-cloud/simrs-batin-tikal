-- ============================================================================
-- SIMRS Batin Tikal — Migration 0000: Core schema
-- ============================================================================
-- Created : 2026-05-13 — Session 1 (MVP scaffolding)
-- Purpose : Establish Patient Registrasi + Encounter Hub foundation
-- Refs    : Blueprint v2.0 §5.6.1 (audit), §5.6.6 (multi-tenant), §4.7.3 +
--           Appendix A.3 P3-D (Encounter-as-Convergence), Phase 0 EXIT
--
-- Run as  : postgres superuser via Supabase Dashboard SQL Editor
-- Mode    : All-or-nothing transaction; ROLLBACK on any error
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- rs — Master Rumah Sakit (Tenants)
-- ---------------------------------------------------------------------------
-- Per §5.6.6: rs_id propagates everywhere; rs itself is the tenant definition.
-- No audit columns on rs (it's root); created/updated tracked via audit_log.

CREATE TABLE IF NOT EXISTS public.rs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_rs     TEXT NOT NULL UNIQUE,
  nama_rs     TEXT NOT NULL,
  profil_rs   JSONB,  -- { satker, kotama, alamat, kontak, akreditasi, ... }
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.rs IS 'Master tenant — Rumah Sakit. Multi-tenant ready per §5.6.6.';

-- ---------------------------------------------------------------------------
-- users — Application user profile (joined to Supabase Auth)
-- ---------------------------------------------------------------------------
-- id mirrors auth.users.id (1:1).
-- Simple role TEXT per Phase 0 EXIT; full 4-table RBAC (§5.6.7) deferred.

CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  nama_lengkap  TEXT NOT NULL,
  rs_id         UUID NOT NULL REFERENCES public.rs(id),
  role          TEXT NOT NULL DEFAULT 'pendaftaran'
                CHECK (role IN ('admin', 'dokter', 'perawat', 'pendaftaran', 'kasir', 'auditor')),
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.users IS 'Application user profile mirroring auth.users; simple role TEXT for MVP.';

-- Auto-create users row when a new auth.users row is created.
-- Pattern from Supabase docs (trigger on auth schema).
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  default_rs_id UUID;
BEGIN
  -- Pick first available RS (single-tenant MVP); refine when multi-RS active.
  SELECT id INTO default_rs_id FROM public.rs LIMIT 1;

  IF default_rs_id IS NULL THEN
    RAISE EXCEPTION 'No RS configured. Seed at least one row in rs before creating users.';
  END IF;

  INSERT INTO public.users (id, email, nama_lengkap, rs_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', split_part(NEW.email, '@', 1)),
    default_rs_id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'pendaftaran')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- patient — Master rekam medis
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.patient (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_rekam_medis    TEXT NOT NULL,
  nik                  TEXT,
  nama_lengkap         TEXT NOT NULL,
  tanggal_lahir        DATE NOT NULL,
  jenis_kelamin        TEXT NOT NULL,
  tempat_lahir         TEXT,
  alamat               JSONB,
  data_kontak          JSONB,
  data_demografi       JSONB,

  -- Universal audit + tenancy (§5.6.1 + §5.6.6 + §5.6.2)
  rs_id                UUID NOT NULL REFERENCES public.rs(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID NOT NULL REFERENCES public.users(id),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by           UUID NOT NULL REFERENCES public.users(id),
  deleted_at           TIMESTAMPTZ,
  deleted_by           UUID REFERENCES public.users(id),
  version              BIGINT NOT NULL DEFAULT 1,

  CONSTRAINT patient_jenis_kelamin_check CHECK (jenis_kelamin IN ('L', 'P')),
  CONSTRAINT patient_nik_format_check CHECK (nik IS NULL OR nik ~ '^[0-9]{16}$')
);

-- Uniqueness: same RM number can exist in different RS but not within
CREATE UNIQUE INDEX IF NOT EXISTS patient_rm_per_rs_uidx
  ON public.patient (rs_id, nomor_rekam_medis)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS patient_nik_idx          ON public.patient (nik);
CREATE INDEX IF NOT EXISTS patient_nama_idx         ON public.patient (nama_lengkap);
CREATE INDEX IF NOT EXISTS patient_rs_id_idx        ON public.patient (rs_id);
CREATE INDEX IF NOT EXISTS patient_deleted_at_idx   ON public.patient (deleted_at);

COMMENT ON TABLE public.patient IS 'Master rekam medis pasien. Universal audit + rs_id per Blueprint v2.0.';

-- ---------------------------------------------------------------------------
-- encounter — Kunjungan (the P3-D convergence hub ⭐⭐)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.encounter (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_kunjungan      TEXT NOT NULL,
  patient_id           UUID NOT NULL REFERENCES public.patient(id),

  tanggal_kunjungan    TIMESTAMPTZ NOT NULL,
  jenis_kunjungan      TEXT NOT NULL,
  status_kunjungan     TEXT NOT NULL DEFAULT 'open',
  keluhan_utama        TEXT,
  data_klinis          JSONB,

  closed_at            TIMESTAMPTZ,
  closed_by            UUID REFERENCES public.users(id),

  -- Universal audit + tenancy
  rs_id                UUID NOT NULL REFERENCES public.rs(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by           UUID NOT NULL REFERENCES public.users(id),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by           UUID NOT NULL REFERENCES public.users(id),
  deleted_at           TIMESTAMPTZ,
  deleted_by           UUID REFERENCES public.users(id),
  version              BIGINT NOT NULL DEFAULT 1,

  CONSTRAINT encounter_jenis_check
    CHECK (jenis_kunjungan IN ('rawat_jalan', 'rawat_inap', 'igd', 'observasi')),
  CONSTRAINT encounter_status_check
    CHECK (status_kunjungan IN ('open', 'closed', 'cancelled')),
  CONSTRAINT encounter_closed_coherence_check
    CHECK ((status_kunjungan = 'closed') = (closed_at IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS encounter_nomor_per_rs_uidx
  ON public.encounter (rs_id, nomor_kunjungan)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS encounter_patient_idx    ON public.encounter (patient_id);
CREATE INDEX IF NOT EXISTS encounter_tanggal_idx    ON public.encounter (tanggal_kunjungan);
CREATE INDEX IF NOT EXISTS encounter_status_idx     ON public.encounter (status_kunjungan);
CREATE INDEX IF NOT EXISTS encounter_rs_id_idx      ON public.encounter (rs_id);

COMMENT ON TABLE public.encounter IS
  'Kunjungan — convergence hub per Blueprint §4.7.3 + Appendix A.3 (Khanza P3-D ⭐⭐). All clinical detail tables FK here.';

-- ---------------------------------------------------------------------------
-- audit_log — Universal append-only audit trail
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name   TEXT NOT NULL,
  row_id       UUID NOT NULL,
  operation    TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values   JSONB,
  new_values   JSONB,
  user_id      UUID,
  rs_id        UUID,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_table_row_idx  ON public.audit_log (table_name, row_id);
CREATE INDEX IF NOT EXISTS audit_log_user_idx       ON public.audit_log (user_id);
CREATE INDEX IF NOT EXISTS audit_log_occurred_idx   ON public.audit_log (occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_log_rs_idx         ON public.audit_log (rs_id);

COMMENT ON TABLE public.audit_log IS
  'Append-only audit log per §5.6.1. No UPDATE/DELETE allowed (enforced via RLS in next migration).';

COMMIT;

-- ============================================================================
-- Verification queries (run after migration to confirm schema)
-- ============================================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('rs', 'users', 'patient', 'encounter', 'audit_log')
-- ORDER BY table_name;
-- Expected: 5 rows.
