'use client'

import { useState } from 'react'
import { AlertTriangle, Check, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useKeyBoard, useTickets, useStaff, useOperation } from '@/lib/store'

export default function KeyholderAuditPage() {
  const { hooks } = useKeyBoard()
  const { tickets } = useTickets()
  const { staff } = useStaff()
  const { addNotification } = useOperation()

  const occupiedHooks = hooks.filter((h) => h.status === 'occupied')

  const [verified, setVerified] = useState<Set<string>>(new Set())
  const [complete, setComplete] = useState(false)

  const toggle = (id: string) =>
    setVerified((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const handleFinish = () => setComplete(true)

  const reportMissing = (hook: any) => {
    if (hook.ticketId) {
      addNotification({
        type: 'key_missing',
        toRole: 'admin',
        fromRole: 'keyholder',
        fromUserId: 'system',
        toUserId: null,
        ticketId: hook.ticketId,
        message: 'Llave faltante en gancho ' + hook.code
      })
    }
  }

  if (complete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
        <div className="text-center max-w-sm clay-card p-8 border-2 border-success/30">
          <div className="w-24 h-24 clay-input !bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-50" />
            <Check className="h-12 w-12 text-success drop-shadow-md" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2 text-foreground drop-shadow-sm">Auditoría completada</h1>
          <p className="text-muted-foreground font-medium mb-8">
            <span className="font-bold text-foreground text-lg">{verified.size}</span> de <span className="font-bold text-foreground text-lg">{occupiedHooks.length}</span> ganchos verificados físicamente
          </p>
          <Button
            onClick={() => setComplete(false)}
            className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
          >
            Nueva auditoría
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">Auditoría de Turno</h1>
          <p className="text-muted-foreground text-sm">
            {verified.size} de {occupiedHooks.length} ganchos verificados
          </p>
        </div>
        <span className="font-mono text-sm text-muted-foreground px-3 py-1.5 bg-surface border border-border rounded-xl">
          {verified.size}/{occupiedHooks.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface border border-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-300"
          style={{ width: occupiedHooks.length > 0 ? `${(verified.size / occupiedHooks.length) * 100}%` : '0%' }}
        />
      </div>

      <div className="space-y-4 mb-8">
        {occupiedHooks.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground clay-input rounded-3xl mx-2 border-dashed border-2 border-white/30">
            <Check className="h-12 w-12 mx-auto mb-4 text-success opacity-80" />
            <p className="text-lg font-bold">Todos los ganchos están libres.</p>
          </div>
        ) : (
          occupiedHooks.map((hook) => {
            const isVerified = verified.has(hook.id)
            const ticket = tickets.find(t => t.id === hook.ticketId)
            const valet = staff.find(s => s.id === ticket?.assignedValetId)
            
            return (
              <div
                key={hook.id}
                className={`transition-all duration-300 ${isVerified ? 'clay-input !bg-success/10 border-2 border-success/40 scale-[0.98] opacity-80' : 'clay-card'}`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center">
                      <Checkbox
                        id={hook.id}
                        checked={isVerified}
                        onCheckedChange={() => toggle(hook.id)}
                        className={`h-8 w-8 rounded-xl border-2 transition-all ${isVerified ? 'bg-success border-success text-white' : 'border-white/50 bg-white/10'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-2xl font-black text-foreground drop-shadow-sm">{ticket?.vehiclePlate || 'Sin ticket'}</span>
                        <span className="flex items-center gap-1.5 text-sm text-cyan-600 font-bold font-mono px-3 py-1 rounded-xl clay-input !bg-cyan-500/10 border-cyan-500/20 shadow-inner">
                          <Key className="h-4 w-4" />
                          G-{hook.code}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">
                        {[ticket?.vehicleMake, ticket?.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'} · {ticket?.vehicleColor}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Valet: <strong className="text-foreground">{valet?.name || 'N/A'}</strong></span>
                        <span>Spot: <strong className="text-primary">{ticket?.spotId || 'N/A'}</strong></span>
                      </div>
                      {ticket?.keysReceivedAt && (
                        <p className="text-xs font-bold text-muted-foreground mt-2 opacity-70">
                          Recibido: {new Date(ticket.keysReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    {isVerified && <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/20 flex-shrink-0 animate-in zoom-in"><Check className="h-6 w-6 text-white" /></div>}
                  </div>

                  {/* Report missing */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="mt-4 w-max flex items-center gap-2 px-3 py-1.5 rounded-lg clay-input !bg-destructive/10 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4" />
                        Reportar llave faltante
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="clay-card border-white/20 rounded-[2rem] max-w-[90vw] w-[360px] p-6 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-destructive/20 via-transparent to-transparent opacity-50 z-[-1]" />
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-serif text-2xl font-bold drop-shadow-sm text-foreground">Reportar llave faltante</AlertDialogTitle>
                        <AlertDialogDescription className="pt-2 font-medium text-muted-foreground">
                          Se enviará una alerta urgente al administrador para el vehículo{' '}
                          <span className="font-mono font-bold text-foreground bg-white/10 px-2 py-0.5 rounded-md">{ticket?.vehiclePlate}</span> (Gancho{' '}
                          {hook.code}).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6 gap-3 sm:gap-3 flex flex-col sm:flex-row">
                        <AlertDialogCancel className="w-full sm:w-1/2 h-14 rounded-2xl clay-btn-secondary text-foreground font-bold mt-0 border-0">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => reportMissing(hook)}
                          className="w-full sm:w-1/2 h-14 rounded-2xl clay-btn-primary !bg-destructive text-white font-bold tracking-wider mt-0"
                        >
                          Enviar alerta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="sticky bottom-4 left-0 right-0 z-10 animate-in slide-in-from-bottom-4 pt-4">
        <Button
          onClick={handleFinish}
          disabled={verified.size === 0 && occupiedHooks.length > 0}
          className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider shadow-[0_10px_30px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:shadow-none"
        >
          <Check className="h-6 w-6 mr-3" />
          Completar auditoría ({verified.size}/{occupiedHooks.length})
        </Button>
      </div>
    </div>
  )
}
