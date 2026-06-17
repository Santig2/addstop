'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, Check, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useTickets } from '@/lib/store'

function QuickCheckinContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  const { updateTicket } = useTickets()

  const [plate, setPlate] = useState('')
  const [photoTaken, setPhotoTaken] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (!plate || !photoTaken || !ticketId) return
    
    updateTicket(ticketId, {
      vehiclePlate: plate,
      photos: ['quick-front.jpg'],
      status: 'IN_TRANSIT'
    })

    setConfirmed(true)
    setTimeout(() => router.push(`/runner/tracking?ticketId=${ticketId}`), 1500)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Registrado</h1>
          <p className="text-muted-foreground">Redirigiendo al GPS…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="sticky top-0 bg-white/20 backdrop-blur-md border-b border-white/40 p-4 z-10 -mx-4 px-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 clay-input rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-xl font-bold drop-shadow-sm">Quick Check-in</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Plate input — large for fast entry */}
        <div className="space-y-2">
          <Label className="text-muted-foreground font-bold uppercase tracking-wider text-xs ml-1">Placa del vehículo</Label>
          <Input
            autoFocus
            placeholder="ABC-1234"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="h-24 clay-input text-4xl font-mono font-bold text-center tracking-widest uppercase placeholder:text-2xl placeholder:font-sans placeholder:font-normal placeholder:tracking-normal focus-visible:ring-0"
          />
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <Label className="text-muted-foreground font-bold uppercase tracking-wider text-xs ml-1">Foto frontal</Label>
          {photoTaken ? (
            <div className="clay-card bg-success/20 border-success/30">
              <div className="p-6 text-center">
                <Check className="h-10 w-10 text-success mx-auto mb-2 drop-shadow-md" />
                <p className="text-success font-bold text-lg drop-shadow-sm">Foto tomada</p>
                <button
                  onClick={() => setPhotoTaken(false)}
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 px-4 py-1.5 clay-input rounded-full hover:text-foreground active:scale-95 transition-all"
                >
                  Volver a tomar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setPhotoTaken(true)}
              className="w-full h-40 clay-input border-2 border-dashed border-white/60 rounded-3xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-white transition-all active:scale-95 group"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Camera className="h-8 w-8 drop-shadow-md" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Tomar foto frontal</span>
            </button>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!plate || !photoTaken}
          className="w-full h-16 clay-btn-primary !bg-warning shadow-[0_10px_30px_rgba(245,158,11,0.3),inset_0_2px_5px_rgba(255,255,255,0.4)] hover:brightness-110 text-white font-bold text-lg disabled:opacity-50 uppercase tracking-wider mt-4"
        >
          <Check className="h-6 w-6 mr-2" />
          Confirmar y salir
        </Button>
      </div>
    </div>
  )
}

export default function RunnerQuickCheckinPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
      <QuickCheckinContent />
    </Suspense>
  )
}
