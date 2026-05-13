-- ============================================================================
-- SIMRS Batin Tikal — Migration 0003: Seed initial RS row
-- ============================================================================
-- Purpose : Insert RS Batin Tikal as initial tenant.
--           First user signup will auto-attach to this RS via the
--           handle_new_auth_user trigger.
-- ============================================================================

BEGIN;

INSERT INTO public.rs (kode_rs, nama_rs, profil_rs)
VALUES (
  'RS-BT-020703',
  'RS Tk.IV 02.07.03 Batin Tikal',
  jsonb_build_object(
    'satker', 'Sub-Satker non-BLU',
    'kotama', 'Kodam II/Sriwijaya',
    'tingkat', 'IV',
    'kode_satker', '685784',
    'alamat', 'Pangkal Pinang',
    'kpa', 'Kakesdam II/Sriwijaya'
  )
)
ON CONFLICT (kode_rs) DO NOTHING;

COMMIT;

-- Verify:
-- SELECT id, kode_rs, nama_rs FROM public.rs;
