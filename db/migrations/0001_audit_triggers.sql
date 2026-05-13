-- ============================================================================
-- SIMRS Batin Tikal — Migration 0001: Audit triggers (§5.6.1 cascade)
-- ============================================================================
-- Purpose : Implement universal audit trigger pattern per Blueprint §5.6.1.
--           Trigger reads current_setting('app.current_user_id', true) — the
--           service layer sets this via SET LOCAL before each request transaction.
--
-- Tables audited: patient, encounter
-- (audit_log itself is NOT audited — would be infinite recursion)
-- (rs, users — separate lifecycle, audit deferred — Phase 2.2)
--
-- Per §5.6.1 cascade benefit: this trigger is THE single allowed exception to
-- DB-passive philosophy (P7-B preserved at service layer). Single source of
-- truth — can't be forgotten by future developers.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Audit population function (BEFORE INSERT/UPDATE) — fills audit columns
-- ---------------------------------------------------------------------------
-- Pattern: trigger reads session-local current_setting('app.current_user_id').
-- Service layer ALWAYS sets this via:
--   SET LOCAL app.current_user_id = '<uuid>';
-- before executing INSERT/UPDATE. Missing context => function raises EXCEPTION
-- (fail loud — prevent silent attribution loss).

CREATE OR REPLACE FUNCTION public.fn_fill_audit_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id_text TEXT;
  current_user_id_uuid UUID;
BEGIN
  current_user_id_text := current_setting('app.current_user_id', true);

  IF current_user_id_text IS NULL OR current_user_id_text = '' THEN
    -- For Supabase service-role-key calls (server-side scripts), allow NULL
    -- to fall through ONLY if NEW.created_by/updated_by already populated
    -- explicitly. This catches "service layer forgot to SET LOCAL" without
    -- blocking trusted seed scripts.
    IF TG_OP = 'INSERT' AND NEW.created_by IS NULL THEN
      RAISE EXCEPTION
        'audit context missing: SET LOCAL app.current_user_id required before INSERT on %.%',
        TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.updated_by IS NULL THEN
      RAISE EXCEPTION
        'audit context missing: SET LOCAL app.current_user_id required before UPDATE on %.%',
        TG_TABLE_SCHEMA, TG_TABLE_NAME;
    END IF;
    RETURN NEW;
  END IF;

  current_user_id_uuid := current_user_id_text::UUID;

  IF TG_OP = 'INSERT' THEN
    NEW.created_at := COALESCE(NEW.created_at, now());
    NEW.created_by := COALESCE(NEW.created_by, current_user_id_uuid);
    NEW.updated_at := NEW.created_at;
    NEW.updated_by := NEW.created_by;
    NEW.version := COALESCE(NEW.version, 1);
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
    NEW.updated_by := current_user_id_uuid;
    -- Optimistic locking: version increments here. Service layer checks
    -- expected version via WHERE clause; trigger increments for next time.
    NEW.version := OLD.version + 1;
    -- Preserve immutable creation metadata
    NEW.created_at := OLD.created_at;
    NEW.created_by := OLD.created_by;
  END IF;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- audit_log writer function (AFTER INSERT/UPDATE/DELETE) — capture changes
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id_text TEXT;
  current_user_id_uuid UUID;
  row_rs_id            UUID;
  row_id_val           UUID;
BEGIN
  current_user_id_text := current_setting('app.current_user_id', true);
  IF current_user_id_text IS NOT NULL AND current_user_id_text <> '' THEN
    current_user_id_uuid := current_user_id_text::UUID;
  END IF;

  IF TG_OP = 'DELETE' THEN
    row_id_val := OLD.id;
    row_rs_id  := OLD.rs_id;
  ELSE
    row_id_val := NEW.id;
    row_rs_id  := NEW.rs_id;
  END IF;

  INSERT INTO public.audit_log (
    table_name, row_id, operation,
    old_values, new_values,
    user_id, rs_id, occurred_at
  ) VALUES (
    TG_TABLE_NAME, row_id_val, TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    current_user_id_uuid, row_rs_id, now()
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Apply triggers to audit-grade tables
-- ---------------------------------------------------------------------------

-- patient
DROP TRIGGER IF EXISTS trg_patient_fill_audit ON public.patient;
CREATE TRIGGER trg_patient_fill_audit
  BEFORE INSERT OR UPDATE ON public.patient
  FOR EACH ROW EXECUTE FUNCTION public.fn_fill_audit_columns();

DROP TRIGGER IF EXISTS trg_patient_audit_log ON public.patient;
CREATE TRIGGER trg_patient_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON public.patient
  FOR EACH ROW EXECUTE FUNCTION public.fn_write_audit_log();

-- encounter
DROP TRIGGER IF EXISTS trg_encounter_fill_audit ON public.encounter;
CREATE TRIGGER trg_encounter_fill_audit
  BEFORE INSERT OR UPDATE ON public.encounter
  FOR EACH ROW EXECUTE FUNCTION public.fn_fill_audit_columns();

DROP TRIGGER IF EXISTS trg_encounter_audit_log ON public.encounter;
CREATE TRIGGER trg_encounter_audit_log
  AFTER INSERT OR UPDATE OR DELETE ON public.encounter
  FOR EACH ROW EXECUTE FUNCTION public.fn_write_audit_log();

-- ---------------------------------------------------------------------------
-- audit_log immutability (defense in depth — RLS will reinforce)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_audit_log_immutable()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only — % on audit_log not permitted', TG_OP;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_log_no_update ON public.audit_log;
CREATE TRIGGER trg_audit_log_no_update
  BEFORE UPDATE OR DELETE ON public.audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION public.fn_audit_log_immutable();

COMMIT;

-- ============================================================================
-- Smoke test (run after migration — verify trigger behavior)
-- ============================================================================
-- Need an existing rs row + users row + auth setup. After seed data:
--
-- BEGIN;
--   SET LOCAL app.current_user_id = '<an-existing-user-uuid>';
--   INSERT INTO public.patient (nomor_rekam_medis, nama_lengkap, tanggal_lahir,
--     jenis_kelamin, rs_id, created_by, updated_by)
--   VALUES ('RM-TEST-001', 'Test Pasien', '1990-01-01', 'L',
--           (SELECT id FROM rs LIMIT 1),
--           '<an-existing-user-uuid>', '<an-existing-user-uuid>')
--   RETURNING id, version, created_at;
--   -- Expect: version=1, created_at = now()
-- ROLLBACK;  -- discard test data
--
-- Then:
-- SELECT * FROM audit_log WHERE table_name = 'patient' ORDER BY occurred_at DESC LIMIT 5;
-- Expect: row with operation='INSERT', new_values JSONB.
