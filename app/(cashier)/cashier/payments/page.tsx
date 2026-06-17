'use client'

import { DollarSign } from 'lucide-react'
import { useTickets } from '@/lib/store'

const serviceColors: Record<string, { bg: string; text: string }> = {
  Regular:   { bg: 'bg-primary/20',   text: 'text-primary'   },
  VIP:       { bg: 'bg-warning/20',   text: 'text-warning'   },
  Overnight: { bg: 'bg-secondary/20', text: 'text-secondary' },
}

export default function CashierPaymentsPage() {
  const { tickets } = useTickets()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayMs = today.getTime()

  // Filtramos tickets del día con pago
  const todayPayments = tickets.filter(
    (t) => t.paymentAmount !== null && (t.deliveredAt || 0) >= todayMs
  ).sort((a, b) => (b.deliveredAt || 0) - (a.deliveredAt || 0))

  const total = todayPayments.reduce((s, p) => s + (p.paymentAmount || 0), 0)
  const average = todayPayments.length > 0 ? Math.round(total / todayPayments.length) : 0

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Historial de Cobros</h1>
        <p className="text-muted-foreground text-sm">Turno actual</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="clay-card p-4 text-center flex flex-col justify-center">
          <div className="clay-input p-3 rounded-2xl mb-2 flex flex-col items-center">
            <DollarSign className="h-5 w-5 mb-1 text-success drop-shadow-md" />
            <p className="text-2xl lg:text-3xl font-bold font-mono text-success drop-shadow-sm">${total}</p>
          </div>
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Total turno</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col justify-center">
          <div className="clay-input p-3 rounded-2xl mb-2 flex flex-col items-center">
            <p className="text-2xl lg:text-3xl font-bold font-mono text-slate-800 drop-shadow-sm">{todayPayments.length}</p>
          </div>
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Transacciones</p>
        </div>
        <div className="clay-card p-4 text-center flex flex-col justify-center">
          <div className="clay-input p-3 rounded-2xl mb-2 flex flex-col items-center">
            <p className="text-2xl lg:text-3xl font-bold font-mono text-primary drop-shadow-sm">
              ${average}
            </p>
          </div>
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Promedio</p>
        </div>
      </div>

      <div className="clay-card flex flex-col p-6">
        <h2 className="text-xl font-bold font-serif text-foreground mb-4">Transacciones</h2>
        <div className="clay-input rounded-2xl p-2 overflow-hidden flex-1">
          <div className="divide-y divide-white/20">
            {todayPayments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground font-medium text-sm">
                No hay transacciones registradas en este turno.
              </div>
            )}
            {todayPayments.map((p) => {
              const svcKey = p.serviceType.charAt(0).toUpperCase() + p.serviceType.slice(1)
              const svc = serviceColors[svcKey] ?? serviceColors.Regular
              const timeString = p.deliveredAt ? new Date(p.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
              
              return (
                <div key={p.id} className="flex items-center gap-4 px-4 py-4 hover:bg-white/10 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-lg font-bold text-foreground drop-shadow-sm">{p.vehiclePlate || 'N/A'}</span>
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-white/30 px-2 py-0.5 rounded-md shadow-inner">#{p.id.slice(-4)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${svc.bg} ${svc.text}`}>
                        {svcKey}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{p.clientName || 'Sin nombre'} · {timeString}</p>
                  </div>
                  <div className="clay-input px-4 py-2 rounded-xl border border-white/30">
                    <span className="font-mono font-bold text-success text-xl drop-shadow-sm">${p.paymentAmount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
