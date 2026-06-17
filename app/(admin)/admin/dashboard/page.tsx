'use client'

import { AlertTriangle, Car, DollarSign, MapPin, MoveRight, Users, Zap, LayoutDashboard, Calendar, Activity } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'
import { roleColors } from '@/lib/mock-data'
import type { UserRole } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTickets, useStaff, useOperation } from '@/lib/store'
import type { TicketStatus } from '@/lib/store'

const statusColors: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-destructive',
  neutral: 'bg-muted-foreground',
  info:    'bg-cyan-500',
}

const actionLabels: Record<TicketStatus, string> = {
  WAITING_VALET: 'En Piscina',
  ASSIGNED: 'Asignado',
  IN_TRANSIT: 'En tránsito',
  SECURED: 'Aparcado',
  REQUESTED_BY_CLIENT: 'Urgente',
  IN_RETRIEVAL: 'Retornando',
  COMPLETED: 'Entregado',
}

const isToday = (ms: number) => {
  const d = new Date(ms)
  const today = new Date()
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear()
}

export default function DashboardPage() {
  const { tickets } = useTickets()
  const { staff } = useStaff()
  const { highVolumeMode, notifications } = useOperation()

  // 1. KPIs
  const activeCars = tickets.filter(t => t.status !== 'COMPLETED').length
  const inTransit = tickets.filter(t => t.status === 'IN_TRANSIT' || t.status === 'IN_RETRIEVAL').length
  const tipsToday = tickets
    .filter(t => t.deliveredAt && isToday(t.deliveredAt) && t.tipAmount)
    .reduce((sum, t) => sum + (t.tipAmount || 0), 0)
  const alertsCount = notifications.filter(n => n.toRole === 'admin' && !n.read).length

  const stats = [
    { label: 'Autos Activos',  value: activeCars.toString(), icon: Car,           color: 'text-primary',  bg: 'bg-primary/10' },
    { label: 'En Tránsito',   value: inTransit.toString(),  icon: MoveRight,     color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Propinas Hoy',   value: `$${tipsToday}`,       icon: DollarSign,    color: 'text-success',  bg: 'bg-success/10' },
    { label: 'Alertas',       value: alertsCount.toString(),icon: AlertTriangle, color: alertsCount > 0 ? 'text-destructive' : 'text-warning', bg: alertsCount > 0 ? 'bg-destructive/10' : 'bg-warning/10' },
  ]

  // 2. Staff Breakdown
  const roles: { role: UserRole; label: string }[] = [
    { role: 'cashier',   label: 'Cajeros' },
    { role: 'valet',     label: 'Valets' },
    { role: 'runner',    label: 'Ramperos' },
    { role: 'keyholder', label: 'Llaveros' },
  ]

  const roleBreakdown = roles.map(r => {
    const roleStaff = staff.filter(s => s.role === r.role)
    const activeRole = roleStaff.filter(s => s.status === 'available' || s.status === 'in_transit').length
    return {
      role: r.role,
      label: r.label,
      active: activeRole,
      total: roleStaff.length
    }
  })

  const activeCount = roleBreakdown.reduce((sum, r) => sum + r.active, 0)
  const totalCount = staff.length

  // 3. Log de actividad (Recent Activity)
  const recentTickets = [...tickets]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 15)

  // 4. Zero Fake Data: Hourly Analytics from Real Tickets
  const generateHourlyData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startOfDay = today.getTime()
    
    // Operating hours 8 AM to 10 PM
    const hours = Array.from({ length: 15 }).map((_, i) => ({
      hour: `${8 + i}:00`,
      cars: 0
    }))

    tickets.forEach(t => {
      if (t.createdAt >= startOfDay) {
        const ticketHour = new Date(t.createdAt).getHours()
        if (ticketHour >= 8 && ticketHour <= 22) {
          hours[ticketHour - 8].cars += 1
        }
      }
    })

    return hours
  }

  const realHourlyData = generateHourlyData()

  return (
    <div className="pb-12 animate-in fade-in zoom-in-95 duration-500 relative z-20">
      <AdminHeader title="Dashboard" breadcrumb={['Admin', 'Dashboard']} />

      {/* High volume indicator */}
      {highVolumeMode && (
        <div className="flex items-center gap-2 mb-6 px-5 py-3 clay-card !bg-warning/20 border-warning/50">
          <div className="p-2 rounded-full bg-warning/20 animate-pulse">
            <Zap className="h-5 w-5 text-warning" />
          </div>
          <div>
            <span className="text-foreground text-sm font-bold block">Modo Alto Volumen Activo</span>
            <span className="text-warning text-xs font-bold uppercase">Operación Acelerada</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="clay-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} shadow-inner`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold font-serif text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active staff by role */}
      <div className="clay-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
          <Users className="w-64 h-64" />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-foreground">
            <Activity className="h-5 w-5 text-primary" />
            Personal en Operación
          </h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {activeCount} de {totalCount} colaboradores en turno activo
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {roleBreakdown.map((rb) => {
            const rc = roleColors[rb.role] || { text: 'text-foreground' }
            return (
              <div key={rb.role} className="clay-input p-4 text-center rounded-2xl flex flex-col items-center justify-center">
                <div className="relative">
                  <p className={`text-3xl font-bold font-mono ${rc.text} drop-shadow-md`}>{rb.active}</p>
                  {rb.active > 0 && (
                    <span className="absolute -right-2 top-1 w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--success)] animate-pulse" />
                  )}
                </div>
                <p className="text-sm font-bold text-foreground mt-1">{rb.label}</p>
                <p className="text-xs font-medium text-muted-foreground">de {rb.total}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Map and Activity */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 clay-card p-6 flex flex-col">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-foreground mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            Live Map
          </h2>
          <div className="flex-1 min-h-[320px] clay-input rounded-2xl flex items-center justify-center relative overflow-hidden group">
            {/* Soft grid background representing map */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--border)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
            <div className="text-center relative z-10">
              <div className="p-4 rounded-full bg-primary/10 mx-auto w-20 h-20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <p className="font-bold text-foreground text-lg">Vista Satelital</p>
              <p className="text-sm font-medium text-muted-foreground">Monitoreo GPS en tiempo real</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 clay-card p-6 flex flex-col">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-foreground mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            Feed en Vivo
          </h2>
          <div className="flex-1 overflow-y-auto max-h-[320px] pr-2 space-y-4 custom-scrollbar">
            {recentTickets.length === 0 && (
              <p className="text-sm font-medium text-muted-foreground text-center py-8">No hay actividad reciente</p>
            )}
            {recentTickets.map((t) => {
              const valetName = staff.find((s) => s.id === t.assignedValetId)?.name || 'Sin asignar'
              const timeString = new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              
              let color = statusColors.neutral
              if (t.status === 'WAITING_VALET') color = statusColors.warning
              else if (t.status === 'ASSIGNED' || t.status === 'IN_TRANSIT' || t.status === 'IN_RETRIEVAL') color = statusColors.info
              else if (t.status === 'SECURED') color = statusColors.success
              else if (t.status === 'REQUESTED_BY_CLIENT') color = statusColors.error
              else if (t.status === 'COMPLETED') color = statusColors.neutral

              return (
                <div key={t.id} className="flex items-center gap-4 bg-muted/30 p-3 rounded-2xl hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_8px] ${color} shadow-current`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-sm font-bold text-foreground">{t.vehiclePlate || 'N/A'}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{actionLabels[t.status] || t.status}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {valetName} · {timeString}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="clay-card p-6">
        <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-foreground mb-6">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Afluencia de Vehículos (Hoy)
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={realHourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91, 127, 255, 0.1)" vertical={false} />
              <XAxis 
                dataKey="hour" 
                stroke="#64748B" 
                fontSize={12} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(91, 127, 255, 0.2)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px rgba(91, 127, 255, 0.1)',
                  fontWeight: 'bold',
                  color: '#1E293B'
                }}
                itemStyle={{ color: '#5B7FFF', fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="cars"
                stroke="#5B7FFF"
                strokeWidth={4}
                dot={{ fill: '#FFFFFF', stroke: '#5B7FFF', strokeWidth: 3, r: 5 }}
                activeDot={{ fill: '#5B7FFF', strokeWidth: 0, r: 8 }}
                style={{ filter: 'drop-shadow(0px 8px 12px rgba(91, 127, 255, 0.3))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
