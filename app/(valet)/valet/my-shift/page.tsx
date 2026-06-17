'use client'

import { Car, Check, Clock, DollarSign, Key, Banknote, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth, useTickets } from '@/lib/store'
import { useRouter } from 'next/navigation'
import type { TicketStatus } from '@/lib/store'

const statusNextRoute: Partial<Record<TicketStatus, string>> = {
  WAITING_VALET:       '/valet/checkin',
  ASSIGNED:            '/valet/checkin',
  IN_TRANSIT:          '/valet/spot-select',
  SECURED:             '/valet/key-board',
  REQUESTED_BY_CLIENT: '/valet/deliver',
  IN_RETRIEVAL:        '/valet/deliver',
}

const statusLabel: Record<TicketStatus, { label: string; color: string }> = {
  WAITING_VALET:       { label: 'En Piscina',    color: 'bg-primary/20 text-primary border-primary/30'  },
  ASSIGNED:            { label: 'Asignado',      color: 'bg-cyan/20 text-cyan border-cyan/30'           },
  IN_TRANSIT:          { label: 'En tránsito',   color: 'bg-cyan/20 text-cyan border-cyan/30'           },
  SECURED:             { label: 'Estacionado',   color: 'bg-success/20 text-success border-success/30'  },
  REQUESTED_BY_CLIENT: { label: 'Solicitado 🔔', color: 'bg-warning/20 text-warning border-warning/30'  },
  IN_RETRIEVAL:        { label: 'Retornando',    color: 'bg-cyan/20 text-cyan border-cyan/30'           },
  COMPLETED:           { label: 'Entregado',     color: 'bg-muted text-muted-foreground border-border'  },
}

export default function MyShiftPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { tickets } = useTickets()

  const todayMs = new Date().setHours(0, 0, 0, 0)
  const myTickets = tickets.filter((t) => t.assignedValetId === currentUser?.id)
  const myTicketsToday = myTickets.filter((t) => t.createdAt >= todayMs)

  const activeTickets = myTickets.filter((t) => t.status !== 'COMPLETED')
  const completedToday = myTicketsToday.filter((t) => t.status === 'COMPLETED')

  const tipsTotal = myTicketsToday
    .filter((t) => t.tipAmount)
    .reduce((sum, t) => sum + (t.tipAmount || 0), 0)

  const tippedTickets = myTicketsToday.filter((t) => t.tipAmount && t.tipAmount > 0)

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <h1 className="font-serif text-3xl font-bold mb-8 text-foreground drop-shadow-sm px-2 mt-2">Mi Turno</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 px-2">
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <Car className="h-5 w-5 text-primary drop-shadow-sm" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground drop-shadow-sm">{completedToday.length}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">Completados</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <DollarSign className="h-5 w-5 text-success drop-shadow-sm" />
          </div>
          <p className="text-2xl font-bold font-mono text-success drop-shadow-sm">${tipsTotal}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-success/70 mt-1">Propinas</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-3">
            <Key className="h-5 w-5 text-warning drop-shadow-sm" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground drop-shadow-sm">{activeTickets.length}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">Activos</p>
        </div>
      </div>

      {/* Tips Breakdown */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-success/20 rounded-xl">
            <Banknote className="h-5 w-5 text-success" />
          </div>
          <h2 className="font-bold text-lg text-foreground tracking-tight">Propinas recibidas</h2>
        </div>
        
        {tippedTickets.length === 0 ? (
          <div className="clay-card p-8 text-center text-muted-foreground text-sm font-medium">
            <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Aún no hay propinas registradas hoy
          </div>
        ) : (
          <div className="space-y-3">
            {tippedTickets.map((t) => (
              <div key={t.id} className="clay-card p-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xl font-black block text-foreground drop-shadow-sm">{t.vehiclePlate || 'N/A'}</span>
                  <span className="text-xs font-medium text-muted-foreground mt-1 block">
                    {[t.vehicleMake, t.vehicleModel].filter(Boolean).join(' ') || 'Vehículo'}
                    {t.deliveredAt
                      ? ` · ${new Date(t.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : ''}
                  </span>
                </div>
                <div className="clay-input px-4 py-2 rounded-xl flex items-center justify-center shadow-inner">
                  <span className="text-success font-black font-mono text-lg drop-shadow-sm">+${t.tipAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Tickets */}
      <div className="px-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-bold text-lg text-foreground tracking-tight">
            Tickets Activos ({activeTickets.length})
          </h2>
        </div>

        {activeTickets.length === 0 ? (
          <div className="clay-card p-8 text-center">
            <div className="w-16 h-16 clay-input rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success drop-shadow-sm" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Sin tickets activos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTickets.map((ticket) => {
              const sl = statusLabel[ticket.status] || {
                label: ticket.status,
                color: 'bg-muted text-muted-foreground border-white/10',
              }
              const nextRoute = statusNextRoute[ticket.status]
              return (
                <div key={ticket.id} className="clay-card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-black text-2xl text-foreground drop-shadow-sm block">
                        {ticket.vehiclePlate || 'Sin placa'}
                      </span>
                      <p className="text-sm font-medium text-muted-foreground mt-1">
                        {[ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ') ||
                          'Vehículo pendiente'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border-2 ${sl.color}`}>
                      {sl.label}
                    </span>
                  </div>
                  
                  {nextRoute && (
                    <button
                      onClick={() => router.push(`${nextRoute}?ticketId=${ticket.id}`)}
                      className="w-full mt-4 h-14 clay-btn-secondary flex items-center justify-between px-5 font-bold text-primary group"
                    >
                      Continuar flujo
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
