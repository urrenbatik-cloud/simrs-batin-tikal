"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import {
  closeEncounterAction,
  cancelEncounterAction,
} from "@/app/actions/encounter-actions"
import type { Encounter } from "@/db/schema/encounter"

interface Props {
  encounter: Encounter
  patientId: string
}

export function EncounterActions({ encounter, patientId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClose = () => {
    if (!confirm("Tutup kunjungan ini? Setelah ditutup tidak dapat diedit.")) return
    startTransition(async () => {
      const res = await closeEncounterAction(
        encounter.id,
        encounter.version,
        patientId,
      )
      if (res.success) {
        toast.success("Kunjungan ditutup.")
        router.refresh()
      } else {
        toast.error(res.message ?? "Gagal menutup kunjungan.")
      }
    })
  }

  const handleCancel = () => {
    if (!confirm("Batalkan kunjungan ini?")) return
    startTransition(async () => {
      const res = await cancelEncounterAction(
        encounter.id,
        encounter.version,
        patientId,
      )
      if (res.success) {
        toast.success("Kunjungan dibatalkan.")
        router.refresh()
      } else {
        toast.error(res.message ?? "Gagal membatalkan.")
      }
    })
  }

  if (encounter.statusKunjungan !== "open") {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleClose}>Tutup Kunjungan</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCancel} variant="destructive">
          Batalkan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
