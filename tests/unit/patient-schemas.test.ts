/**
 * Patient schema tests — validate Zod input contracts for patient service.
 *
 * NIK is Indonesia's national ID — 16 digits. The regex must enforce that
 * exactly. Other fields use Bahasa Indonesia per Khanza P10-A (Blueprint
 * v2.0 Appendix A).
 */
import { describe, it, expect } from "vitest"
import {
  createPatientSchema,
  updatePatientSchema,
  patientAlamatSchema,
  patientKontakSchema,
} from "@/services/patientService"

const validMinPayload = {
  nomorRekamMedis: "RM-001",
  namaLengkap: "Budi Santoso",
  tanggalLahir: "1990-01-15",
  jenisKelamin: "L" as const,
}

describe("createPatientSchema — minimum payload", () => {
  it("accepts minimum required fields", () => {
    const result = createPatientSchema.safeParse(validMinPayload)
    expect(result.success).toBe(true)
  })

  it("rejects missing nomorRekamMedis", () => {
    const { nomorRekamMedis: _, ...rest } = validMinPayload
    const result = createPatientSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it("rejects empty nomorRekamMedis", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      nomorRekamMedis: "",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty namaLengkap", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      namaLengkap: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("createPatientSchema — tanggalLahir format (YYYY-MM-DD)", () => {
  it.each([
    "1990-01-15",
    "2026-12-31",
    "1900-06-01",
  ])("accepts %s", (date) => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      tanggalLahir: date,
    })
    expect(result.success).toBe(true)
  })

  it.each([
    "15-01-1990", // wrong order
    "1990/01/15", // wrong separator
    "1990-1-15", // missing zero-pad
    "1990-01-15T00:00:00Z", // ISO datetime
    "not-a-date",
    "",
  ])("rejects %s", (badDate) => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      tanggalLahir: badDate,
    })
    expect(result.success).toBe(false)
  })
})

describe("createPatientSchema — jenisKelamin", () => {
  it.each(["L", "P"] as const)("accepts '%s'", (gender) => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      jenisKelamin: gender,
    })
    expect(result.success).toBe(true)
  })

  it("rejects 'M' (English shorthand — Bahasa Indonesia only)", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      jenisKelamin: "M",
    })
    expect(result.success).toBe(false)
  })

  it("rejects 'Laki-laki' (full word — schema is single-char code)", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      jenisKelamin: "Laki-laki",
    })
    expect(result.success).toBe(false)
  })
})

describe("createPatientSchema — NIK (Indonesian national ID, 16 digits)", () => {
  it("accepts a valid 16-digit NIK", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      nik: "3201234567890123",
    })
    expect(result.success).toBe(true)
  })

  it("accepts NIK omitted (optional)", () => {
    const result = createPatientSchema.safeParse(validMinPayload)
    expect(result.success).toBe(true)
  })

  it("accepts NIK as empty string (literal('') escape hatch)", () => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      nik: "",
    })
    expect(result.success).toBe(true)
  })

  it.each([
    "1234567890", // 10 digits — too short
    "12345678901234567", // 17 digits — too long
    "320123456789012a", // contains letter
    "3201-234-567-890-123", // contains separator
  ])("rejects malformed NIK: %s", (badNik) => {
    const result = createPatientSchema.safeParse({
      ...validMinPayload,
      nik: badNik,
    })
    expect(result.success).toBe(false)
  })
})

describe("updatePatientSchema — optimistic locking", () => {
  it("requires expectedVersion", () => {
    const result = updatePatientSchema.safeParse({ namaLengkap: "Foo" })
    expect(result.success).toBe(false)
  })

  it("rejects expectedVersion <= 0 (initial INSERT yields version=1)", () => {
    const zeroResult = updatePatientSchema.safeParse({ expectedVersion: 0 })
    expect(zeroResult.success).toBe(false)
    const negResult = updatePatientSchema.safeParse({ expectedVersion: -1 })
    expect(negResult.success).toBe(false)
  })

  it("accepts version-only payload (no other patch fields)", () => {
    const result = updatePatientSchema.safeParse({ expectedVersion: 3 })
    expect(result.success).toBe(true)
  })

  it("accepts partial patch with version", () => {
    const result = updatePatientSchema.safeParse({
      expectedVersion: 1,
      namaLengkap: "Budi Santoso Updated",
    })
    expect(result.success).toBe(true)
  })
})

describe("patientAlamatSchema — JSONB envelope", () => {
  it("accepts empty object", () => {
    const result = patientAlamatSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it("accepts a typical alamat", () => {
    const result = patientAlamatSchema.safeParse({
      jalan: "Jl. Merdeka No. 1",
      rt: "001",
      rw: "002",
      kelurahan: "Pangkal Pinang",
      kecamatan: "Pangkal Balam",
      kota: "Pangkal Pinang",
      provinsi: "Kepulauan Bangka Belitung",
      kode_pos: "33115",
    })
    expect(result.success).toBe(true)
  })

  it("accepts undefined (optional schema)", () => {
    const result = patientAlamatSchema.safeParse(undefined)
    expect(result.success).toBe(true)
  })
})

describe("patientKontakSchema — email validation", () => {
  it("accepts valid email", () => {
    const result = patientKontakSchema.safeParse({
      email: "user@example.com",
    })
    expect(result.success).toBe(true)
  })

  it("accepts empty email (literal('') escape hatch)", () => {
    const result = patientKontakSchema.safeParse({ email: "" })
    expect(result.success).toBe(true)
  })

  it("rejects malformed email", () => {
    const result = patientKontakSchema.safeParse({ email: "not-an-email" })
    expect(result.success).toBe(false)
  })

  it("accepts nested kontak_darurat", () => {
    const result = patientKontakSchema.safeParse({
      telepon_utama: "081234567890",
      kontak_darurat: {
        nama: "Sri Wahyuni",
        hubungan: "Istri",
        telepon: "087654321098",
      },
    })
    expect(result.success).toBe(true)
  })
})
