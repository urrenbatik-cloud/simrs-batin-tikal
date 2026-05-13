import Link from "next/link"
import { LoginForm } from "./login-form"

export const metadata = { title: "Masuk — SIMRS Batin Tikal" }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">SIMRS Batin Tikal</h1>
          <p className="text-sm text-muted-foreground">
            RS Tk.IV 02.07.03 Batin Tikal — TNI AD
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  )
}
