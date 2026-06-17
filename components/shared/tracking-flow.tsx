'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation, Timer, MapPin, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTickets } from '@/lib/store'

interface TrackingFlowProps {
  ticketId: string | null
  nextRoute: string
}

export function TrackingFlow({ ticketId, nextRoute }: TrackingFlowProps) {
  const router = useRouter()
  const { tickets, updateTicket } = useTickets()

  const ticket = tickets.find(t => t.id === ticketId)

  const [seconds, setSeconds] = useState(0)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
      setDistance(d => d + 15) // +15 meters per second
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleArrive = () => {
    if (ticketId) {
      updateTicket(ticketId, {
        gpsTrackOut: [{ lat: 25.7617, lng: -80.1918, ts: Date.now() }]
      })
      router.push(`${nextRoute}?ticketId=${ticketId}`)
    }
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-6 px-4 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full clay-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-foreground drop-shadow-sm">Navegando al Spot</h1>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {/* Ticket Info */}
        <div className="clay-input p-5 rounded-2xl mb-8 border border-white/20">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
            <span className="font-mono text-3xl font-black text-foreground drop-shadow-sm">{ticket?.vehiclePlate || 'ABC-1234'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold clay-card text-cyan-500 shadow-inner">
              {ticket?.status === 'in_transit' ? 'En tránsito' : ticket?.status || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Vehículo</span>
            <span className="font-bold text-foreground text-right drop-shadow-sm">
              {[ticket?.vehicleMake, ticket?.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Cliente</span>
            <span className="font-bold text-foreground text-right drop-shadow-sm">
              {ticket?.clientName || 'Sin nombre'}
            </span>
          </div>
        </div>

        {/* Tracking UI */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50" />
            <div className="absolute inset-[-20px] border-2 border-primary/20 rounded-full animate-[spin_4s_linear_infinite] border-dashed" />
            <div className="relative clay-btn-primary !bg-primary w-36 h-36 rounded-full flex items-center justify-center pointer-events-none">
              <Navigation className="w-16 h-16 text-white drop-shadow-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="clay-card p-5 text-center flex flex-col items-center">
              <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Timer className="w-6 h-6 text-primary drop-shadow-sm" />
              </div>
              <p className="font-mono text-3xl font-black text-foreground drop-shadow-sm">{formatTime(seconds)}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Tiempo</p>
            </div>

            <div className="clay-card p-5 text-center flex flex-col items-center">
              <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-cyan-500 drop-shadow-sm" />
              </div>
              <p className="font-mono text-3xl font-black text-foreground drop-shadow-sm">{distance}m</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Distancia</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12">
          <Button
            onClick={handleArrive}
            className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider"
          >
            Llegué al spot
          </Button>
        </div>
      </div>
    </div>
  )
}
