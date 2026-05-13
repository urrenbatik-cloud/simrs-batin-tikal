/**
 * Build-smoke test: Server Action module load verification.
 *
 * Origin: Session 1 Bug 5 — `export type { ActionState }` in a
 * "use server" file caused Turbopack to emit a runtime reference to the
 * type, which then ReferenceError'd at module evaluation. The error
 * fired BEFORE any action body ran, so try/catch wrappers couldn't surface
 * it. tsc --noEmit and next build both passed; only live POST surfaced the
 * crash.
 *
 * This test imports every Server Action module from a Node runtime. If a
 * module has a non-erasable export, an illegal directive, or any other
 * module-evaluation-time error, the test fails before deploy.
 *
 * Run as part of CI before `next build`.
 */
import { describe, it, expect } from "vitest"

// Env vars are populated by tests/setup.ts before this module evaluates.

describe("Server Action modules — build-smoke (module evaluation)", () => {
  it("auth-actions module evaluates without ReferenceError", async () => {
    const mod = await import("@/app/actions/auth-actions")
    expect(typeof mod.loginAction).toBe("function")
    expect(typeof mod.signupAction).toBe("function")
    expect(typeof mod.logoutAction).toBe("function")
  })

  it("patient-actions module evaluates without ReferenceError", async () => {
    const mod = await import("@/app/actions/patient-actions")
    expect(typeof mod.createPatientAction).toBe("function")
    expect(typeof mod.updatePatientAction).toBe("function")
    expect(typeof mod.softDeletePatientAction).toBe("function")
    // ActionState is the inline export interface (the form that works in
    // "use server" — see Bug 5 lesson). Type-only — no runtime check needed.
  })

  it("encounter-actions module evaluates without ReferenceError", async () => {
    // This is the exact test that would have caught Bug 5 of Session 1.
    // Before fix `1af51e2`, this import threw:
    //   ReferenceError: ActionState is not defined
    //     at module evaluation
    const mod = await import("@/app/actions/encounter-actions")
    expect(typeof mod.createEncounterAction).toBe("function")
    expect(typeof mod.closeEncounterAction).toBe("function")
    expect(typeof mod.cancelEncounterAction).toBe("function")
  })
})

describe("Service layer modules — module load", () => {
  it("patientService module evaluates", async () => {
    const mod = await import("@/services/patientService")
    expect(typeof mod.listPatients).toBe("function")
    expect(typeof mod.createPatient).toBe("function")
  })

  it("encounterService module evaluates", async () => {
    const mod = await import("@/services/encounterService")
    expect(typeof mod.listEncountersForPatient).toBe("function")
    expect(typeof mod.createEncounter).toBe("function")
    expect(typeof mod.closeEncounter).toBe("function")
  })

  it("auditService module evaluates", async () => {
    const mod = await import("@/services/auditService")
    expect(typeof mod.getAuditTrailForEntity).toBe("function")
    expect(typeof mod.queryAuditLog).toBe("function")
  })
})
