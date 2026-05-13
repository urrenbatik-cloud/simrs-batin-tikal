import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentSession } from "@/lib/session"
import { logoutAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getCurrentSession()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto flex h-14 items-center gap-4 px-4">
          <Link href="/patients" className="font-semibold">
            SIMRS Batin Tikal
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/patients">Pasien</NavLink>
            <NavLink href="/encounters">Kunjungan</NavLink>
            <NavLink href="/audit">Audit Log</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <div className="text-right hidden sm:block">
              <div className="font-medium">{session.namaLengkap}</div>
              <div className="text-xs text-muted-foreground">
                {session.email} · {session.role}
              </div>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        SIMRS Batin Tikal · MVP Phase 2.1 · {new Date().getFullYear()}
      </footer>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  )
}
