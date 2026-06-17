'use client'

import { useState } from 'react'
import { Car, Clock, User, Zap, ChevronRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuth, useTickets, useStaff, useOperation } from '@/lib/store'
import type { Ticket, TicketStatus } from '@/lib/store'

const columns: { key: string; label: string; color: string; dot: string; statuses: TicketStatus[] }[] = [
  { key: 'WAITING_VALET',  label: 'En Piscina',    color: 'text-foreground',       dot: 'bg-muted-foreground', statuses: ['WAITING_VALET'] },
  { key: 'ASSIGNED',  label: 'Asignado',    color: 'text-primary',          dot: 'bg-primary',          statuses: ['ASSIGNED', 'IN_TRANSIT'] },
  { key: 'SECURED',    label: 'Estacionado', color: 'text-warning',          dot: 'bg-warning',          statuses: ['SECURED'] },
  { key: 'REQUESTED_BY_CLIENT', label: 'Solicitados', color: 'text-destructive', dot: 'bg-destructive', statuses: ['REQUESTED_BY_CLIENT', 'IN_RETRIEVAL'] },
  { key: 'COMPLETED', label: 'Entregado',   color: 'text-success',          dot: 'bg-success',          statuses: ['COMPLETED'] },
]

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  WAITING_VALET:       { bg: 'bg-muted',         text: 'text-foreground',       label: 'En piscina'    },
  ASSIGNED:       { bg: 'bg-primary/20',    text: 'text-primary',          label: 'Asignado'    },
  IN_TRANSIT:     { bg: 'bg-primary/20',    text: 'text-primary',          label: 'En tránsito' },
  SECURED:         { bg: 'bg-warning/20',    text: 'text-warning',          label: 'Estacionado' },
  REQUESTED_BY_CLIENT: { bg: 'bg-destructive/20',text: 'text-destructive',      label: 'Solicitado'  },
  IN_RETRIEVAL:     { bg: 'bg-destructive/20',text: 'text-destructive',      label: 'Retornando'  },
  COMPLETED:      { bg: 'bg-success/20',    text: 'text-success',          label: 'Entregado'   },
}

export default function CashierQueuePage() {
  const { currentUser } = useAuth()
  const { tickets, updateTicket } = useTickets()
  const { staff, setStaff } = useStaff()
  const { highVolumeMode, addNotification } = useOperation()

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const byColumn = (col: typeof columns[0]) => {
    let filtered = tickets.filter((t) => col.statuses.includes(t.status))
    if (col.key === 'COMPLETED') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayMs = today.getTime()
      filtered = filtered
        .filter((t) => (t.deliveredAt || 0) >= todayMs || (t.completedAt || 0) >= todayMs)
        .sort((a, b) => (b.deliveredAt || b.completedAt || 0) - (a.deliveredAt || a.completedAt || 0))
        .slice(0, 10)
    }
    return filtered
  }

  const elapsedColor = (min: number) =>
    min < 3 ? 'text-success' : min < 7 ? 'text-warning' : 'text-destructive'

  const activeCount = tickets.filter(t => t.status !== 'COMPLETED').length

  const handleAssign = (ticket: Ticket, valetId: string) => {
    const valet = staff.find(s => s.id === valetId)
    if (!valet || !currentUser) return

    updateTicket(ticket.id, { 
      status: 'ASSIGNED', 
      assignedValetId: valetId, 
      assignedBy: currentUser.id 
    })

    const isFirstCar = valet.activeTickets === 0
    const newStatus = isFirstCar ? 'in_transit' : valet.status

    setStaff(staff.map(s => s.id === valetId ? { 
      ...s, 
      activeTickets: s.activeTickets + 1,
      status: newStatus 
    } : s))

    addNotification({
      type: 'assignment',
      fromRole: 'cashier',
      toRole: valet.role,
      fromUserId: currentUser.id,
      toUserId: valetId,
      ticketId: ticket.id,
      message: 'Auto asignado: ' + (ticket.vehiclePlate || ticket.clientName || 'Sin placa'),
    })

    setSelectedTicket(null)
  }

  const handleAutoAssign = (ticket: Ticket) => {
    const availableStaff = staff.filter(s => (s.role === 'valet' || s.role === 'runner') && s.status === 'available')
    if (availableStaff.length === 0) {
      alert('No hay personal disponible para auto-asignar.')
      return
    }
    const bestValet = availableStaff.sort((a, b) => {
      if (a.role === 'runner' && b.role !== 'runner') return -1;
      if (a.role !== 'runner' && b.role === 'runner') return 1;
      return a.activeTickets - b.activeTickets;
    })[0]
    handleAssign(ticket, bestValet.id)
  }

  return (
    <div className="pb-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground drop-shadow-sm">Cola de Tickets</h1>
          <p className="text-muted-foreground font-medium mt-1">{activeCount} vehículos activos en operación</p>
        </div>
        {highVolumeMode && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-warning/20 border border-warning/30 text-warning shadow-inner animate-pulse">
            <Zap className="h-4 w-4 fill-warning" />
            <span className="font-bold uppercase text-xs tracking-wider">Alto Volumen</span>
          </div>
        )}
      </div>

      {/* Kanban grid with Claymorphism */}
      <div className="flex xl:grid xl:grid-cols-4 gap-4 xl:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 xl:mx-0 xl:px-0 hide-scrollbar">
        {columns.map((col) => {
          const columnTickets = byColumn(col)
          return (
            <div key={col.key} className="clay-card p-4 xl:p-5 min-h-[65vh] flex flex-col w-[85vw] sm:w-[45vw] xl:w-auto shrink-0 snap-center">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className={`w-3 h-3 rounded-full shadow-[0_0_8px] shadow-current ${col.dot}`} />
                <span className={`text-base font-bold uppercase tracking-wider ${col.color}`}>{col.label}</span>
                <span className="ml-auto text-xs font-bold px-2 py-1 bg-surface rounded-full shadow-sm">
                  {columnTickets.length}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                {columnTickets.length === 0 && (
                  <div className="h-32 clay-input opacity-70 border-2 border-dashed border-muted rounded-2xl flex items-center justify-center text-muted-foreground font-bold text-sm">
                    Sin tickets en esta zona
                  </div>
                )}
                {columnTickets.map((ticket) => {
                  const badge = statusBadge[ticket.status] || statusBadge.WAITING_VALET
                  const elapsedMin = Math.floor((Date.now() - ticket.createdAt) / 60000)
                  const valetName = staff.find((s) => s.id === ticket.assignedValetId)?.name || 'Sin asignar'
                  const vehicleStr = [ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'
                  const plateStr = ticket.vehiclePlate || 'Sin placa'
                  const clientStr = ticket.clientName || 'Sin nombre'

                  return (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="clay-input w-full p-5 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(91,127,255,0.1)] active:scale-95 flex flex-col group border border-white/40"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-bold text-foreground tracking-tight">{plateStr}</span>
                          {ticket.isHighVolume && (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-warning/20 text-warning" title="Alto Volumen">
                              <Zap className="h-3.5 w-3.5 fill-warning" />
                            </span>
                          )}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-muted-foreground mb-4 line-clamp-1">
                        {vehicleStr} {ticket.vehicleColor ? `· ${ticket.vehicleColor}` : ''}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-muted/50">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="h-3.5 w-3.5 text-primary" />
                          {valetName}
                        </span>
                        <span className={`flex items-center gap-1.5 font-mono font-bold ${elapsedColor(elapsedMin)}`}>
                          <Clock className="h-3.5 w-3.5" />
                          {elapsedMin} min
                        </span>
                      </div>
                      
                      {clientStr !== 'Sin nombre' && (
                        <p className="text-xs font-medium text-muted-foreground mt-2 px-2 py-1 bg-muted/30 rounded-md inline-block">
                          {clientStr}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="bg-white/70 backdrop-blur-3xl border-l border-white/40 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] overflow-y-auto sm:max-w-md rounded-l-[2rem]">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-serif text-2xl text-foreground font-bold drop-shadow-sm">
              {selectedTicket?.status === 'WAITING_VALET' ? 'Asignar Operador' : 'Detalle del Ticket'}
            </SheetTitle>
          </SheetHeader>
          
          {selectedTicket && (
            <div className="space-y-6">
              {/* Common Ticket Summary Header */}
              <div className="clay-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-3xl font-bold text-foreground">{selectedTicket.vehiclePlate || 'Sin placa'}</span>
                  <span className="text-xs font-mono font-bold px-2 py-1 bg-muted rounded-md text-muted-foreground">#{selectedTicket.id.slice(-4)}</span>
                </div>
                <p className="font-medium text-muted-foreground mb-3 text-sm">
                  {[selectedTicket.vehicleMake, selectedTicket.vehicleModel].filter(Boolean).join(' ') || 'Vehículo Pendiente'}
                  {selectedTicket.vehicleColor ? ` · ${selectedTicket.vehicleColor}` : ''}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-muted">
                  <p className="font-bold text-sm text-foreground">{selectedTicket.clientName || 'Cliente No Registrado'}</p>
                  <p className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
                    {selectedTicket.serviceType}
                  </p>
                </div>
              </div>

              {selectedTicket.status === 'WAITING_VALET' ? (
                // Arriving specific view
                <div className="clay-input p-5 rounded-3xl">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-base text-foreground">Personal Disponible</h3>
                    <button onClick={() => handleAutoAssign(selectedTicket)} className="clay-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Auto-asignar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {staff
                      .filter(s => (s.role === 'valet' || s.role === 'runner') && s.status === 'available')
                      .sort((a, b) => {
                        if (a.role === 'runner' && b.role !== 'runner') return -1;
                        if (a.role !== 'runner' && b.role === 'runner') return 1;
                        return a.activeTickets - b.activeTickets;
                      })
                      .map(valet => (
                        <div key={valet.id} className="clay-card p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-foreground">{valet.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{valet.role}</span>
                              <span className="text-xs font-medium text-muted-foreground">{valet.activeTickets} en curso</span>
                            </div>
                          </div>
                          <button onClick={() => handleAssign(selectedTicket, valet.id)} className="clay-btn-primary px-4 py-2 text-xs">
                            Asignar
                          </button>
                        </div>
                      ))}
                    {staff.filter(s => (s.role === 'valet' || s.role === 'runner') && s.status === 'available').length === 0 && (
                      <p className="text-sm font-medium text-muted-foreground text-center py-6">No hay personal operativo disponible.</p>
                    )}
                  </div>
                </div>
              ) : (
                // Standard details view for other statuses
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="clay-input p-4 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Operador</p>
                      <p className="font-bold text-foreground">
                        {staff.find((s) => s.id === selectedTicket.assignedValetId)?.name || 'N/A'}
                      </p>
                    </div>
                    <div className="clay-input p-4 rounded-2xl flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Check-in</p>
                      <p className="font-mono font-bold text-foreground">
                        {new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="clay-input p-4 rounded-2xl col-span-2 flex flex-col items-center text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Tiempo Transcurrido</p>
                      <p className={`font-mono text-3xl font-bold drop-shadow-sm ${elapsedColor(Math.floor((Date.now() - selectedTicket.createdAt) / 60000))}`}>
                        {Math.floor((Date.now() - selectedTicket.createdAt) / 60000)} min
                      </p>
                    </div>
                  </div>

                  {(selectedTicket.spotId || selectedTicket.hookId) && (
                    <div className="clay-card p-4 flex items-center justify-around text-center">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Spot</p>
                        <p className="font-mono text-xl font-bold text-primary">{selectedTicket.spotId || '--'}</p>
                      </div>
                      <div className="w-px h-10 bg-muted"></div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Gancho</p>
                        <p className="font-mono text-xl font-bold text-primary">{selectedTicket.hookId || '--'}</p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.status !== 'COMPLETED' && (
                    <button className="clay-btn-secondary w-full h-14 flex items-center justify-center gap-2 mt-6 text-sm">
                      <Car className="h-5 w-5" />
                      Reasignar Vehículo
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
