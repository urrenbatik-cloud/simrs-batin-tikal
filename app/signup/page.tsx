import Link from "next/link"
import { SignupForm } from "./signup-form"

export const metadata = { title: "Daftar — SIMRS Batin Tikal" }

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Daftar Akun Baru</h1>
          <p className="text-sm text-muted-foreground">SIMRS Batin Tikal</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  )
}
