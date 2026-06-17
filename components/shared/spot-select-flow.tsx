'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, ChevronLeft, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useSpots, useTickets } from '@/lib/store'

interface SpotSelectFlowProps {
  ticketId: string | null
  nextRoute: string
}

export function SpotSelectFlow({ ticketId, nextRoute }: SpotSelectFlowProps) {
  const router = useRouter()
  const { zones, spots, updateSpotStatus } = useSpots()
  const { updateTicket } = useTickets()

  const [activeZone, setActiveZone] = useState<string>('manual')
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [locationNote, setLocationNote] = useState<string>('')
  const [spotPhoto, setSpotPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (zones.length > 0 && activeZone === '') {
      setActiveZone(zones[0].id)
    }
  }, [zones, activeZone])

  const canConfirm = (selectedSpot !== null || locationNote.trim() !== '') && spotPhoto !== null

  const handleConfirm = () => {
    if (!ticketId || !canConfirm) return

    if (selectedSpot && activeZone !== 'manual') {
      updateSpotStatus(selectedSpot, true, ticketId)
      updateTicket(ticketId, { 
        spotId: selectedSpot, 
        locationNote: null,
        status: 'SECURED', 
        parkedAt: Date.now() 
      })
    } else {
      updateTicket(ticketId, { 
        spotId: null, 
        locationNote: locationNote.trim(),
        status: 'SECURED', 
        parkedAt: Date.now() 
      })
    }
    router.push(`${nextRoute}?ticketId=${ticketId}`)
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full clay-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-foreground drop-shadow-sm">Aparcar Vehículo</h1>
        </div>
      </div>

      {/* Content */}
      <div className="clay-card p-5 pb-32">
        <Tabs value={activeZone} onValueChange={(v) => {
          setActiveZone(v)
          if (v === 'manual') setSelectedSpot(null)
        }} className="w-full">
          <TabsList className="w-full flex overflow-x-auto h-14 p-1.5 mb-6 scrollbar-none clay-input rounded-2xl gap-2">
            <TabsTrigger
              value="manual"
              className="text-sm font-bold flex-shrink-0 min-w-[100px] rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Manual
            </TabsTrigger>
            {zones.map((zone) => (
              <TabsTrigger
                key={zone.id}
                value={zone.id}
                className="text-sm font-bold flex-shrink-0 min-w-[90px] rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
              >
                {zone.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="manual">
            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Nota de Ubicación Libre</p>
              <Input 
                placeholder="Ej. Frente a la entrada, detrás del pilar 3..."
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                className="h-16 clay-input text-lg font-medium text-foreground focus-visible:ring-0"
              />
            </div>
          </TabsContent>

          {zones.map((zone) => (
            <TabsContent key={zone.id} value={zone.id}>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {spots
                  .filter((s) => s.zoneId === zone.id)
                  .map((spot) => {
                    const isOccupied = spot.occupied
                    const isSelected = selectedSpot === spot.id

                    return (
                      <button
                        key={spot.id}
                        onClick={() => !isOccupied && setSelectedSpot(spot.id)}
                        disabled={isOccupied}
                        className={`h-14 rounded-[1.2rem] font-mono text-lg font-bold transition-all shadow-sm ${
                          isOccupied
                            ? 'bg-destructive/10 border-2 border-destructive/20 text-destructive opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'clay-btn-primary !bg-primary !text-white !shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(91,127,255,0.4)] scale-110'
                            : 'clay-input text-foreground hover:bg-white/40'
                        }`}
                      >
                        {spot.code}
                      </button>
                    )
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {(selectedSpot || locationNote.trim() !== '') && (
          <div className="clay-input p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Spot seleccionado:</span>
              <span className="font-mono text-xl font-black text-primary drop-shadow-sm flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {activeZone === 'manual' ? 'Nota Manual' : spots.find(s => s.id === selectedSpot)?.code}
              </span>
            </div>

            {!spotPhoto ? (
              <div className="relative w-full h-14">
                <Button
                  type="button"
                  className="w-full h-14 clay-btn-secondary pointer-events-none font-bold text-base"
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Tomar foto del auto aparcado
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader()
                      reader.onload = (evt) => setSpotPhoto(evt.target?.result as string)
                      reader.readAsDataURL(e.target.files[0])
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={spotPhoto} alt="Foto del spot" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-success/90 backdrop-blur-md rounded-full p-2 shadow-lg">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-success text-center uppercase tracking-wider drop-shadow-sm">Foto obligatoria capturada</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      {canConfirm && (
        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={handleConfirm}
            className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider"
          >
            <Check className="h-6 w-6 mr-2" />
            Confirmar Aparcamiento
          </Button>
        </div>
      )}
    </div>
  )
}
