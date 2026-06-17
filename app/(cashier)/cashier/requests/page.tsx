'use client'

import { useState } from 'react'
import { Car, Clock, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuth, useTickets, useStaff, useOperation } from '@/lib/store'
import type { Ticket } from '@/lib/store'

function elapsedColor(min: number) {
  if (min < 3) return 'text-success'
  if (min < 7) return 'text-warning'
  return 'text-destructive'
}

function elapsedBg(min: number) {
  if (min < 3) return 'bg-success/20'
  if (min < 7) return 'bg-warning/20'
  return 'bg-destructive/20'
}

export default function CashierRequestsPage() {
  const { currentUser } = useAuth()
  const { tickets, updateTicket } = useTickets()
  const { staff } = useStaff()
  const { addNotification } = useOperation()

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const requestedTickets = tickets.filter(t => t.status === 'requested')
  const availableStaff = staff.filter(s => s.role === 'valet' || s.role === 'runner')

  const handleDispatch = (ticketId: string, valetId: string) => {
    const valet = staff.find(s => s.id === valetId)
    const ticket = tickets.find(t => t.id === ticketId)
    if (!valet || !ticket) return

    updateTicket(ticketId, { status: 'dispatched', assignedValetId: valetId })
    
    addNotification({
      type: 'delivery_request',
      fromRole: 'cashier',
      toRole: valet.role,
      fromUserId: currentUser?.id || 'system',
      toUserId: valetId,
      ticketId,
      message: 'Traer auto: ' + (ticket.vehiclePlate || ticket.clientName || 'Sin placa')
    })
    
    setSelectedTicket(null)
  }

  const handleAutoDispatch = (ticket: Ticket) => {
    const available = availableStaff.filter(s => s.status === 'available')
    if (available.length === 0) {
      alert('No hay personal disponible.')
      return
    }
    const bestValet = available.sort((a, b) => a.activeTickets - b.activeTickets)[0]
    handleDispatch(ticket.id, bestValet.id)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Solicitudes de Autos</h1>
        <p className="text-muted-foreground text-sm">
          Clientes esperando su vehículo · {requestedTickets.length} activas
        </p>
      </div>

      {requestedTickets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Sin solicitudes pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requestedTickets.map((ticket) => {
            const requestedTime = ticket.requestedAt || ticket.createdAt
            const elapsedMin = Math.floor((Date.now() - requestedTime) / 60000)
            const vehicleStr = [ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'
            const plateStr = ticket.vehiclePlate || 'Sin placa'
            const clientStr = ticket.clientName || 'Sin nombre'
            const reqTimeString = new Date(requestedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            return (
              <div
                key={ticket.id}
                className="clay-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(91,127,255,0.15)] group"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Elapsed indicator */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${elapsedBg(elapsedMin)} flex flex-col items-center justify-center shadow-inner border border-white/20`}>
                      <span className={`font-mono font-bold text-xl leading-none drop-shadow-sm ${elapsedColor(elapsedMin)}`}>
                        {elapsedMin}m
                      </span>
                      <Clock className={`h-4 w-4 mt-1 opacity-80 ${elapsedColor(elapsedMin)}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-xl font-bold text-foreground drop-shadow-sm">{plateStr}</span>
                        <span className="text-xs font-mono font-bold text-muted-foreground bg-white/30 px-2 py-0.5 rounded-md shadow-inner">#{ticket.id.slice(-4)}</span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {vehicleStr} {ticket.vehicleColor ? `· ${ticket.vehicleColor}` : ''}
                      </p>
                      <div className="mt-2 inline-flex items-center bg-white/40 border border-white/30 px-3 py-1 rounded-xl shadow-inner">
                        <User className="h-3 w-3 text-primary mr-1.5" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {clientStr} · <span className="font-mono">{reqTimeString}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="clay-btn-primary w-full sm:w-auto h-12 px-6 flex items-center justify-center font-bold text-sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Despachar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="bg-white/70 backdrop-blur-3xl border-l border-white/40 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] overflow-y-auto sm:max-w-md rounded-l-[2rem]">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl font-bold drop-shadow-sm">Seleccionar Valet</SheetTitle>
          </SheetHeader>
          {selectedTicket && (
            <div className="mt-6 space-y-4">
              <div className="bg-surface border border-border rounded-xl p-4">
                <span className="font-mono text-xl font-bold">{selectedTicket.vehiclePlate || 'Sin placa'}</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {[selectedTicket.vehicleMake, selectedTicket.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'}
                  {selectedTicket.spotId ? ` · Spot ${selectedTicket.spotId}` : ''}
                </p>
              </div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground font-medium">Personal disponible</p>
                <Button onClick={() => handleAutoDispatch(selectedTicket)} size="sm" variant="outline" className="h-7 text-xs">
                  Auto-asignar
                </Button>
              </div>

              <div className="space-y-2">
                {availableStaff
                  .filter((v) => v.status === 'available')
                  .map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleDispatch(selectedTicket.id, v.id)}
                      className="w-full clay-input flex items-center justify-between gap-3 p-3 rounded-2xl transition-all hover:scale-[0.98] active:scale-95 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary shadow-inner">
                          {v.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{v.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{v.role}</span>
                            <span className="text-xs font-medium text-muted-foreground">{v.activeTickets} activos</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success">
                        Disponible
                      </span>
                    </button>
                  ))}
                {availableStaff.filter((v) => v.status !== 'available').map((v) => (
                  <button
                    key={v.id}
                    disabled
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border opacity-50 cursor-not-allowed text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                        {v.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{v.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">{v.role}</span>
                          <span className="text-xs text-muted-foreground">{v.activeTickets} activos</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {v.status === 'in_transit' ? 'En tránsito' : 'Fuera'}
                    </span>
                  </button>
                ))}
                {availableStaff.filter(v => v.status === 'available').length === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-4">No hay personal disponible.</p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
