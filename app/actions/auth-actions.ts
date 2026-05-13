"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface AuthState {
  success: boolean
  message?: string
}

export async function loginAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { success: false, message: "Email dan password wajib diisi." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return {
      success: false,
      message:
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : error.message,
    }
  }

  revalidatePath("/", "layout")
  redirect("/patients")
}

export async function signupAction(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const namaLengkap = String(formData.get("namaLengkap") ?? "").trim()

  if (!email || !password || !namaLengkap) {
    return { success: false, message: "Semua kolom wajib diisi." }
  }
  if (password.length < 8) {
    return { success: false, message: "Password minimal 8 karakter." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nama_lengkap: namaLengkap, role: "pendaftaran" } },
  })

  if (error) {
    return { success: false, message: error.message }
  }
  return {
    success: true,
    message:
      "Akun berhasil dibuat. Cek email untuk konfirmasi (atau langsung login jika email confirmation OFF di Supabase).",
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
