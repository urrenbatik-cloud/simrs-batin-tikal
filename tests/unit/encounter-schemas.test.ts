/**
 * Schema tests — validate Zod input contracts for encounter service.
 *
 * These run without a DB. They verify that the input validation surface
 * (consumed by Server Actions before they call the service layer) rejects
 * malformed payloads + accepts valid ones.
 *
 * Targets per Blueprint v2.0 §5.6.8 (inline Zod for MVP):
 *   - createEncounterSchema: required fields + enum for jenis_kunjungan
 *   - updateEncounterSchema: requires expectedVersion (optimistic locking)
 *   - closeEncounterSchema: requires expectedVersion
 */
import { describe, it, expect } from "vitest"
import {
  createEncounterSchema,
  updateEncounterSchema,
  closeEncounterSchema,
} from "@/services/encounterService"

describe("createEncounterSchema", () => {
  it("accepts a valid minimum payload", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "550e8400-e29b-41d4-a716-446655440000",
      tanggalKunjungan: "2026-05-14",
      jenisKunjungan: "rawat_jalan",
    })
    expect(result.success).toBe(true)
  })

  it("rejects non-UUID patientId", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "not-a-uuid",
      tanggalKunjungan: "2026-05-14",
      jenisKunjungan: "rawat_jalan",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty tanggalKunjungan", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "550e8400-e29b-41d4-a716-446655440000",
      tanggalKunjungan: "",
      jenisKunjungan: "rawat_jalan",
    })
    expect(result.success).toBe(false)
  })

  it.each(["rawat_jalan", "rawat_inap", "igd", "observasi"] as const)(
    "accepts jenisKunjungan='%s'",
    (jenis) => {
      const result = createEncounterSchema.safeParse({
        patientId: "550e8400-e29b-41d4-a716-446655440000",
        tanggalKunjungan: "2026-05-14",
        jenisKunjungan: jenis,
      })
      expect(result.success).toBe(true)
    },
  )

  it("rejects unknown jenisKunjungan", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "550e8400-e29b-41d4-a716-446655440000",
      tanggalKunjungan: "2026-05-14",
      jenisKunjungan: "bedah",
    })
    expect(result.success).toBe(false)
  })

  it("accepts optional keluhanUtama as empty string", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "550e8400-e29b-41d4-a716-446655440000",
      tanggalKunjungan: "2026-05-14",
      jenisKunjungan: "igd",
      keluhanUtama: "",
    })
    expect(result.success).toBe(true)
  })

  it("accepts dataKlinis as arbitrary object", () => {
    const result = createEncounterSchema.safeParse({
      patientId: "550e8400-e29b-41d4-a716-446655440000",
      tanggalKunjungan: "2026-05-14",
      jenisKunjungan: "rawat_jalan",
      dataKlinis: { tekanan_darah: "120/80", suhu: 36.8 },
    })
    expect(result.success).toBe(true)
  })
})

describe("updateEncounterSchema", () => {
  it("requires expectedVersion (optimistic locking)", () => {
    const result = updateEncounterSchema.safeParse({
      jenisKunjungan: "rawat_jalan",
    })
    expect(result.success).toBe(false)
  })

  it("requires expectedVersion to be a positive integer", () => {
    const zeroResult = updateEncounterSchema.safeParse({
      expectedVersion: 0,
    })
    expect(zeroResult.success).toBe(false)

    const negResult = updateEncounterSchema.safeParse({
      expectedVersion: -1,
    })
    expect(negResult.success).toBe(false)

    const floatResult = updateEncounterSchema.safeParse({
      expectedVersion: 1.5,
    })
    expect(floatResult.success).toBe(false)
  })

  it("accepts minimal payload (version only — partial update OK)", () => {
    const result = updateEncounterSchema.safeParse({ expectedVersion: 1 })
    expect(result.success).toBe(true)
  })
})

describe("closeEncounterSchema", () => {
  it("requires expectedVersion", () => {
    const empty = closeEncounterSchema.safeParse({})
    expect(empty.success).toBe(false)
  })

  it("accepts a positive integer version", () => {
    const result = closeEncounterSchema.safeParse({ expectedVersion: 1 })
    expect(result.success).toBe(true)
  })

  it("rejects version=0 (initial INSERT produces version=1)", () => {
    const result = closeEncounterSchema.safeParse({ expectedVersion: 0 })
    expect(result.success).toBe(false)
  })
})
