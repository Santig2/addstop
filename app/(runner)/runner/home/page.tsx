'use client'

import { Car, Check, Clock, MapPin, Timer, Zap, Activity, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth, useOperation, useTickets } from '@/lib/store'

export default function RunnerHomePage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { notifications, clearNotification, highVolumeMode } = useOperation()
  const { tickets } = useTickets()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  // Asignaciones pendientes (igual que Valet)
  const pendingAssignments = notifications.filter(
    (n) => n.type === 'assignment' && n.toUserId === currentUser?.id && !n.read
  )

  const handleAccept = (notifId: string, ticketId: string) => {
    clearNotification(notifId)
    router.push(`/runner/quick-checkin?ticketId=${ticketId}`)
  }

  // Stats: Active tickets for this runner
  const activeTicketsCount = tickets.filter(
    t => t.assignedValetId === currentUser?.id && t.status !== 'COMPLETED'
  ).length

  return (
    <div className="p-4 pb-32 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="mb-8 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
              {greeting}, <br/><span className="text-warning">{currentUser?.name?.split(' ')[0] || 'Rampero'}</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1 capitalize">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-warning/20 text-warning">
            Rampero
          </span>
        </div>
      </div>

      {/* Alto Volumen Indicator */}
      {highVolumeMode && (
        <div className="mb-8 bg-destructive border-2 border-destructive/50 shadow-[0_10px_30px_rgba(239,68,68,0.3)] text-white px-5 py-4 rounded-3xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-lg">Modo Alto Volumen</span>
          </div>
          <span className="text-sm uppercase tracking-wider font-bold px-3 py-1 bg-white/20 rounded-full">Rápido</span>
        </div>
      )}

      {/* Active Shift */}
      <div className="clay-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--success)]" />
          <span className="text-sm font-bold uppercase tracking-wider text-success">Turno Activo</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mt-2">
              <MapPin className="h-4 w-4 text-primary" />
              Valet Luxe · Zona Rápida
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono text-foreground">{(currentUser?.carsToday || 0) * 15}<span className="text-xl">m</span></p>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">tiempo prom.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="clay-card p-5 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-3">
            <Car className="h-6 w-6 text-warning" />
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{currentUser?.carsToday || 0}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Autos Hoy</p>
        </div>
        <div className="clay-card p-5 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mb-3">
            <Timer className="h-6 w-6 text-cyan" />
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{activeTicketsCount}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">En Curso</p>
        </div>
      </div>

      {/* Pending assignments */}
      <div>
        <h2 className="font-bold mb-4 flex items-center gap-2 text-warning text-lg uppercase tracking-wider">
          <Zap className="h-5 w-5" />
          Asignaciones rápidas ({pendingAssignments.length})
        </h2>
        {pendingAssignments.length === 0 ? (
          <div className="clay-card p-10 flex flex-col items-center justify-center text-center opacity-80">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-success" />
            </div>
            <p className="text-xl font-bold font-serif text-foreground">Zona despejada</p>
            <p className="text-sm font-medium text-muted-foreground mt-2">Sin asignaciones pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAssignments.map((a) => {
              const ticket = tickets.find(t => t.id === a.ticketId)
              
              return (
                <div key={a.id} className="clay-card p-5 border-2 border-warning/50 shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-3xl font-bold text-foreground">{ticket?.vehiclePlate || 'N/A'}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-warning/20 text-warning">
                      {ticket?.serviceType || 'Regular'}
                    </span>
                  </div>
                  <p className="text-base font-bold text-foreground mb-4">
                    {ticket?.clientName || 'Cliente Sin Nombre'}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Asignado: {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAccept(a.id, a.ticketId)}
                    className="w-full h-16 rounded-[2rem] bg-warning hover:bg-warning/90 text-warning-foreground font-bold text-lg flex items-center justify-center transition-transform active:scale-95 shadow-[0_8px_20px_rgba(245,158,11,0.3)]"
                  >
                    Aceptar Rápido <ArrowRight className="h-6 w-6 ml-2" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
