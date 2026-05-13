"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createEncounterAction } from "@/app/actions/encounter-actions"
import type { ActionState } from "@/app/actions/patient-actions"
// ActionState is imported from patient-actions (where it's originally defined).
// Importing types from a "use server" file is unsafe in Next.js + Turbopack —
// see encounter-actions.ts header comment for full background.

interface Props {
  patientId: string
  patientNama: string
}

export function NewEncounterDialog({ patientId, patientNama }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(createEncounterAction, null)

  useEffect(() => {
    if (state?.success) {
      toast.success("Kunjungan berhasil dicatat.")
      setOpen(false)
      router.refresh()
    } else if (state?.message && !state.success) {
      toast.error(state.message)
    }
  }, [state, router])

  const nowLocal = new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" /> Kunjungan Baru
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kunjungan Baru</DialogTitle>
          <DialogDescription>Pasien: {patientNama}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="patientId" value={patientId} />

          <div className="space-y-2">
            <Label htmlFor="tanggalKunjungan">Tanggal & Waktu *</Label>
            <Input
              id="tanggalKunjungan"
              name="tanggalKunjungan"
              type="datetime-local"
              defaultValue={nowLocal}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenisKunjungan">Jenis Kunjungan *</Label>
            <Select name="jenisKunjungan" defaultValue="rawat_jalan" required>
              <SelectTrigger id="jenisKunjungan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rawat_jalan">Rawat Jalan</SelectItem>
                <SelectItem value="rawat_inap">Rawat Inap</SelectItem>
                <SelectItem value="igd">IGD</SelectItem>
                <SelectItem value="observasi">Observasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keluhanUtama">Keluhan Utama</Label>
            <Textarea
              id="keluhanUtama"
              name="keluhanUtama"
              rows={3}
              placeholder="Contoh: nyeri kepala 3 hari, demam ringan..."
            />
          </div>

          {state?.message && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Kunjungan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
