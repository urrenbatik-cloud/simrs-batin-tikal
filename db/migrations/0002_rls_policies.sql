-- ============================================================================
-- SIMRS Batin Tikal — Migration 0002: RLS policies (DEFINED, DEFERRED ACTIVATION)
-- ============================================================================
-- Purpose : Define Row Level Security policies for multi-tenant + audit
--           immutability per Blueprint v2.0 §5.6.6 + §5.6.1.
--
-- Activation status (per Phase 0 EXIT):
--   - ENABLED: audit_log (immutability is critical day 1)
--   - DEFERRED: rs/users/patient/encounter (single-RS MVP; enable later)
--
-- When 2+ RS reality arrives, the deferred policies need only one statement:
--   ALTER TABLE public.<tablename> ENABLE ROW LEVEL SECURITY;
-- Policies themselves don't need editing.
--
-- App connects with service_role JWT (server side) — service_role bypasses RLS
-- by default; client-side anon JWT subjects to RLS. We design policies for that
-- future eventuality NOW so retrofit cost is zero.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Helper: get tenant scope from current authenticated user
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_current_user_rs_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT rs_id FROM public.users WHERE id = auth.uid() AND deleted_at IS NULL LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.fn_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid() AND deleted_at IS NULL LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- rs — Policies defined; activation DEFERRED
-- ---------------------------------------------------------------------------
-- Pattern: user sees only their own RS row + auditor role sees all.

CREATE POLICY rs_select_own_or_auditor
  ON public.rs FOR SELECT
  USING (
    id = public.fn_current_user_rs_id()
    OR public.fn_current_user_role() = 'auditor'
  );

-- DEFERRED: ALTER TABLE public.rs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- users — Policies defined; activation DEFERRED
-- ---------------------------------------------------------------------------

CREATE POLICY users_select_same_rs
  ON public.users FOR SELECT
  USING (rs_id = public.fn_current_user_rs_id());

CREATE POLICY users_self_update
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- DEFERRED: ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- patient — Policies defined; activation DEFERRED
-- ---------------------------------------------------------------------------

CREATE POLICY patient_select_same_rs
  ON public.patient FOR SELECT
  USING (rs_id = public.fn_current_user_rs_id());

CREATE POLICY patient_insert_same_rs
  ON public.patient FOR INSERT
  WITH CHECK (rs_id = public.fn_current_user_rs_id());

CREATE POLICY patient_update_same_rs
  ON public.patient FOR UPDATE
  USING (rs_id = public.fn_current_user_rs_id())
  WITH CHECK (rs_id = public.fn_current_user_rs_id());

-- Soft delete only — physical DELETE not exposed to app
-- (Service layer always issues UPDATE deleted_at = now() instead.)

-- DEFERRED: ALTER TABLE public.patient ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- encounter — Policies defined; activation DEFERRED
-- ---------------------------------------------------------------------------

CREATE POLICY encounter_select_same_rs
  ON public.encounter FOR SELECT
  USING (rs_id = public.fn_current_user_rs_id());

CREATE POLICY encounter_insert_same_rs
  ON public.encounter FOR INSERT
  WITH CHECK (rs_id = public.fn_current_user_rs_id());

CREATE POLICY encounter_update_same_rs
  ON public.encounter FOR UPDATE
  USING (rs_id = public.fn_current_user_rs_id())
  WITH CHECK (rs_id = public.fn_current_user_rs_id());

-- DEFERRED: ALTER TABLE public.encounter ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- audit_log — RLS ENABLED day 1 (immutability is critical)
-- ---------------------------------------------------------------------------
-- Append-only enforced both via trigger (0001) AND RLS policies here.

CREATE POLICY audit_log_select_same_rs_or_auditor
  ON public.audit_log FOR SELECT
  USING (
    rs_id = public.fn_current_user_rs_id()
    OR public.fn_current_user_role() = 'auditor'
  );

-- Anon/authenticated clients CANNOT INSERT/UPDATE/DELETE on audit_log directly.
-- Only the trigger functions (running as SECURITY DEFINER or table owner) insert.
-- Service-role bypasses RLS anyway (server-side only).

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Grants — service_role can do everything; anon/authenticated subject to RLS
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.rs, public.users, public.patient, public.encounter
  TO authenticated;
GRANT SELECT ON public.audit_log TO authenticated;

COMMIT;

-- ============================================================================
-- Activation playbook (run later when ready)
-- ============================================================================
-- When ready to activate multi-RS RLS (e.g., second RS provisioning):
--
--   ALTER TABLE public.rs ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.patient ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE public.encounter ENABLE ROW LEVEL SECURITY;
--
-- All 4 statements at once. No policy edits needed. Verify with:
--   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';
