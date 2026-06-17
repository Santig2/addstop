'use client'

import { useRouter } from 'next/navigation'
import { Car, Check, Clock, MapPin, Zap, Key, ChevronRight, Plus, ArrowRight, Activity, Hand } from 'lucide-react'
import { useAuth, useTickets, useOperation } from '@/lib/store'

// Map ticket status → next action route
const statusNextRoute: Record<string, string> = {
  WAITING_VALET:  '/valet/checkin',
  ASSIGNED:       '/valet/checkin',
  IN_TRANSIT:     '/valet/spot-select',
  SECURED:        '/valet/home', // Depende del modo, por ahora lo dejamos aquí
  REQUESTED_BY_CLIENT: '/valet/deliver',
  IN_RETRIEVAL:   '/valet/deliver',
}

const statusLabel: Record<string, { label: string; color: string }> = {
  WAITING_VALET:  { label: 'Piscina',         color: 'bg-muted text-foreground' },
  ASSIGNED:       { label: 'Asignado',        color: 'bg-cyan/20 text-cyan'            },
  IN_TRANSIT:     { label: 'En tránsito',     color: 'bg-cyan/20 text-cyan'            },
  SECURED:        { label: 'Estacionado',     color: 'bg-success/20 text-success'      },
  REQUESTED_BY_CLIENT: { label: '🔔 Urgente', color: 'bg-destructive text-destructive-foreground animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  IN_RETRIEVAL:   { label: 'Buscando',        color: 'bg-warning/20 text-warning'      },
  COMPLETED:      { label: 'Entregado',       color: 'bg-muted text-muted-foreground'  },
}

const actionLabel: Record<string, string> = {
  WAITING_VALET:  'Reclamar Ticket',
  ASSIGNED:       'Iniciar Check-in',
  IN_TRANSIT:     'Aparcar Auto',
  SECURED:        'Gestionar Llaves',
  REQUESTED_BY_CLIENT: 'Ir a Entregar',
  IN_RETRIEVAL:   'Completar Entrega',
}

export default function ValetHomePage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { tickets, updateTicket } = useTickets()
  const { notifications, clearNotification } = useOperation()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  // Pool global de tickets esperando valet
  const poolTickets = tickets.filter(t => t.status === 'WAITING_VALET')

  // Notificaciones de asignación directa (Forzada por cajero)
  const pendingNotifications = notifications.filter(
    (n) => n.type === 'assignment' && n.toUserId === currentUser?.id && !n.read
  )

  // Mis Tickets
  const myTickets = tickets.filter(
    (t) => t.assignedValetId === currentUser?.id && t.status !== 'COMPLETED' && t.status !== 'WAITING_VALET'
  )

  // Urgentes
  const urgentTickets = myTickets.filter((t) => t.status === 'REQUESTED_BY_CLIENT')

  // Entregas
  const deliveryTickets = myTickets.filter((t) => t.status === 'IN_RETRIEVAL')

  // En Progreso
  const inProgressTickets = myTickets.filter(
    (t) => ['ASSIGNED', 'IN_TRANSIT', 'SECURED'].includes(t.status)
  )

  // Stats
  const todayMs = new Date().setHours(0, 0, 0, 0)
  const carsToday = tickets.filter(
    (t) => t.assignedValetId === currentUser?.id && t.createdAt >= todayMs
  ).length
  const tipsToday = currentUser?.tipsToday || 0

  const handleClaim = (ticketId: string) => {
    if (!currentUser) return
    updateTicket(ticketId, {
      status: 'ASSIGNED',
      assignedValetId: currentUser.id
    })
    router.push(`/valet/checkin?ticketId=${ticketId}`)
  }

  const handleAcceptAssignment = (notifId: string, ticketId: string) => {
    clearNotification(notifId)
    router.push(`/valet/checkin?ticketId=${ticketId}`)
  }

  const navigateTo = (status: string, ticketId: string) => {
    const route = statusNextRoute[status]
    if (route) router.push(`${route}?ticketId=${ticketId}`)
  }

  return (
    <div className="p-4 pb-32 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="mb-8 mt-2">
        <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
          {greeting}, <br/><span className="text-primary">{currentUser?.name?.split(' ')[0] || 'Valet'}</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1 capitalize">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Car className="h-5 w-5 text-primary drop-shadow-sm" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground drop-shadow-sm">{carsToday}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">Autos Hoy</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <span className="text-xl font-bold text-success drop-shadow-sm">$</span>
          </div>
          <p className="text-2xl font-bold font-mono text-success drop-shadow-sm">{tipsToday}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">Propinas</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col items-center">
          <div className="clay-input w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Key className="h-5 w-5 text-cyan-500 drop-shadow-sm" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground drop-shadow-sm">{myTickets.length}</p>
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mt-1">Activos</p>
        </div>
      </div>

      {/* ── URGENT: Customer requests delivery ── */}
      {urgentTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-destructive text-lg uppercase tracking-wider">
            <Key className="h-5 w-5" />
            Entregas Urgentes ({urgentTickets.length})
          </h2>
          <div className="space-y-4">
            {urgentTickets.map((ticket) => (
              <div key={ticket.id} className="clay-card p-5 border-2 border-destructive/50 shadow-[0_10px_30px_rgba(239,68,68,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-3xl font-bold text-foreground">{ticket.vehiclePlate || 'Sin placa'}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-destructive text-white animate-pulse">
                    ¡Solicitado!
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-foreground mb-4">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg"><MapPin className="h-4 w-4 text-primary" /> {ticket.spotId || ticket.locationNote || 'Sin spot'}</span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg"><Key className="h-4 w-4 text-primary" /> {ticket.hookId || 'Sin gancho'}</span>
                </div>
                <button 
                  onClick={() => navigateTo(ticket.status, ticket.id)} 
                  className="clay-btn-primary w-full h-16 !bg-destructive !text-white !shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),0_10px_20px_rgba(239,68,68,0.5)] font-bold text-lg flex items-center justify-center"
                >
                  <ArrowRight className="h-6 w-6 mr-2" /> {actionLabel[ticket.status] || 'Continuar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POOL DE TICKETS (WAITING_VALET) ── */}
      {poolTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-primary text-lg uppercase tracking-wider">
            <Activity className="h-5 w-5" />
            Piscina de Llegadas ({poolTickets.length})
          </h2>
          <div className="space-y-4">
            {poolTickets.map((ticket) => (
              <div key={ticket.id} className="clay-card p-5 border-2 border-primary/20 hover:border-primary/50 transition-all shadow-[0_10px_30px_rgba(91,127,255,0.1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-3xl font-bold text-foreground">{ticket.vehiclePlate || 'Sin placa'}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
                    {ticket.serviceType}
                  </span>
                </div>
                <p className="text-base font-medium text-muted-foreground mb-4">
                  {ticket.clientName ? `${ticket.clientName} · ` : ''} 
                  {[ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ')}
                </p>
                <button 
                  onClick={() => handleClaim(ticket.id)} 
                  className="clay-btn-primary w-full h-14 text-lg flex items-center justify-center gap-2 font-bold"
                >
                  <Hand className="h-5 w-5" /> Reclamar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEW ASSIGNMENTS (via notifications from cashier) ── */}
      {pendingNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-primary text-lg uppercase tracking-wider">
            <Zap className="h-5 w-5" />
            Asignaciones Directas ({pendingNotifications.length})
          </h2>
          <div className="space-y-4">
            {pendingNotifications.map((notif) => {
              const ticket = tickets.find((t) => t.id === notif.ticketId)
              if (!ticket) return null
              return (
                <div key={notif.id} className="clay-card p-5 border-2 border-primary/50 shadow-[0_10px_30px_rgba(91,127,255,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-3xl font-bold text-foreground">{ticket.vehiclePlate || 'Sin placa'}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
                      {ticket.serviceType}
                    </span>
                  </div>
                  <p className="text-base font-bold text-foreground mb-2">{ticket.clientName || 'Cliente sin registro'}</p>
                  <button 
                    onClick={() => handleAcceptAssignment(notif.id, ticket.id)} 
                    className="clay-btn-primary w-full h-16 text-lg flex items-center justify-center gap-2"
                  >
                    <Check className="h-6 w-6" /> Aceptar Vehículo
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MY ACTIVE TICKETS (progress-based) ── */}
      {inProgressTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-foreground text-lg uppercase tracking-wider">
            <Car className="h-5 w-5 text-muted-foreground" />
            Mis Autos ({inProgressTickets.length})
          </h2>
          <div className="space-y-4">
            {inProgressTickets.map((ticket, i) => {
              const sl = statusLabel[ticket.status] || { label: ticket.status, color: 'bg-muted text-muted-foreground' }
              const action = actionLabel[ticket.status]
              return (
                <div 
                  key={ticket.id} 
                  className="clay-card p-5 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-2xl font-bold text-foreground">{ticket.vehiclePlate || 'Sin placa'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sl.color}`}>
                      {sl.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-4">
                    {[ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ')} {ticket.vehicleColor ? `· ${ticket.vehicleColor}` : ''}
                  </p>
                  {(ticket.spotId || ticket.locationNote || ticket.hookId) && (
                    <div className="flex items-center gap-3 text-sm font-bold text-foreground mb-5 bg-muted/30 p-2.5 rounded-xl">
                      {(ticket.spotId || ticket.locationNote) && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {ticket.spotId || 'Nota'}</span>}
                      {(ticket.spotId || ticket.locationNote) && ticket.hookId && <span className="text-muted-foreground/50">|</span>}
                      {ticket.hookId && <span className="flex items-center gap-1.5"><Key className="h-4 w-4 text-primary" /> {ticket.hookId}</span>}
                    </div>
                  )}
                  {action && (
                    <button
                      onClick={() => navigateTo(ticket.status, ticket.id)}
                      className="clay-btn-secondary w-full h-14 flex items-center justify-between px-5 text-base"
                    >
                      <span>{action}</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── DELIVERY IN PROGRESS ── */}
      {deliveryTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2 text-warning text-lg uppercase tracking-wider">
            <Key className="h-5 w-5" />
            Entregas en Curso ({deliveryTickets.length})
          </h2>
          <div className="space-y-4">
            {deliveryTickets.map((ticket, i) => {
              const sl = statusLabel[ticket.status] || { label: ticket.status, color: 'bg-warning/20 text-warning' }
              return (
                <div 
                  key={ticket.id} 
                  className="clay-card p-5 border-2 border-warning/50 shadow-[0_10px_30px_rgba(245,158,11,0.15)] animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-foreground">{ticket.vehiclePlate || 'Sin placa'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sl.color}`}>
                      {sl.label}
                    </span>
                  </div>
                  <button 
                    onClick={() => navigateTo(ticket.status, ticket.id)} 
                    className="clay-btn-primary w-full h-16 !bg-warning !text-warning-foreground !shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),0_10px_20px_rgba(245,158,11,0.5)] font-bold text-lg flex items-center justify-center"
                  >
                    Completar Entrega <ChevronRight className="h-6 w-6 ml-1" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {myTickets.length === 0 && pendingNotifications.length === 0 && poolTickets.length === 0 && (
        <div className="clay-card p-10 flex flex-col items-center justify-center text-center mt-12 opacity-80">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <Check className="h-10 w-10 text-success" />
          </div>
          <p className="text-xl font-bold font-serif text-foreground">Todo al día</p>
          <p className="text-sm font-medium text-muted-foreground mt-2">No hay vehículos en piscina ni activos.</p>
        </div>
      )}

      {/* ── FAB: Nuevo Check-in manual ── */}
      <div className="fixed bottom-6 right-4 md:right-8 z-50">
        <button
          onClick={() => router.push('/valet/checkin')}
          className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-[0_10px_25px_rgba(91,127,255,0.5),inset_2px_2px_5px_rgba(255,255,255,0.4),inset_-3px_-3px_10px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-90 transition-all duration-300"
          title="Nuevo Check-in"
        >
          <Plus className="h-10 w-10 text-white" />
        </button>
      </div>
    </div>
  )
}
