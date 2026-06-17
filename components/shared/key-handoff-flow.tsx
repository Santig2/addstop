'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Key, Loader2, ArrowRight, ChevronLeft, UserCheck, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTickets, useOperation, useAuth, useStaff, useStore, useKeyBoard, useOperationMode } from '@/lib/store'

interface KeyHandoffFlowProps {
  ticketId: string | null
  homeRoute: string
  role: 'valet' | 'runner'
}

export function KeyHandoffFlow({ ticketId, homeRoute, role }: KeyHandoffFlowProps) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { tickets, updateTicket } = useTickets()
  const { addNotification } = useOperation()
  const { staff } = useStaff()
  const { hooks, updateHookStatus } = useKeyBoard()
  const { operationMode } = useOperationMode()
  
  const ticket = tickets.find(t => t.id === ticketId)
  
  const [isWaiting, setIsWaiting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedHook, setSelectedHook] = useState<string | null>(null)
  const [keyPhoto, setKeyPhoto] = useState<string | null>(null)

  const isTeamMode = operationMode === 'TEAM'

  const handleNotify = () => {
    if (!ticket || !currentUser) return
    
    // Notify Keyholder. The ticket remains IN_TRANSIT or SECURED but missing hookId
    addNotification({
      type: 'keys_handoff',
      fromRole: role,
      toRole: 'keyholder',
      fromUserId: currentUser.id,
      toUserId: '', 
      ticketId: ticket.id,
      message: 'Llaves para entregar: ' + (ticket.vehiclePlate || 'Sin placa')
    })
    setIsWaiting(true)
  }

  const handleSelfStore = () => {
    if (!ticket || !currentUser || !selectedHook || !keyPhoto) return
    
    const hookObj = hooks.find(h => h.id === selectedHook)
    if (!hookObj) return

    updateHookStatus(selectedHook, 'occupied', ticket.id)
    updateTicket(ticket.id, { 
      status: 'SECURED', // Auto and keys are fully secured
      keyReceivedBy: currentUser.id,
      hookId: hookObj.code
    })
    setIsComplete(true)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isWaiting && ticketId) {
      interval = setInterval(() => {
        const currentTicket = useStore.getState().tickets.find((t: any) => t.id === ticketId)
        // If team mode, keyholder will set hookId and SECURED
        if (currentTicket && currentTicket.status === 'SECURED' && currentTicket.hookId) {
          clearInterval(interval)
          setIsWaiting(false)
          setIsComplete(true)
        }
      }, 2000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isWaiting, ticketId])

  if (isComplete) {
    const keyholder = staff.find(s => s.id === ticket?.keyReceivedBy)
    const receiverName = keyholder?.name || 'Llavero'
    const finalHook = ticket?.hookId || (selectedHook ? hooks.find(h => h.id === selectedHook)?.code : 'N/A')
    
    return (
      <div className="min-h-screen bg-[#E8F0FE] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA] z-[-1]" />
        
        <div className="text-center w-full max-w-sm animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-success/20 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-50" />
            <Check className="h-12 w-12 text-success drop-shadow-md" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2 text-foreground drop-shadow-sm">¡Completado!</h1>
          
          <div className="clay-card p-6 my-8">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Llaves seguras en Gancho:</p>
            <p className="font-mono text-5xl font-black text-cyan-500 drop-shadow-sm mb-4">{finalHook}</p>
            <div className="clay-input p-3 rounded-xl inline-flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm text-foreground">Asegurado por {receiverName}</span>
            </div>
          </div>

          <Button
            onClick={() => router.push(homeRoute)}
            className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-[#E8F0FE] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA] z-[-1]" />

        <div className="text-center w-full max-w-sm animate-in fade-in duration-300">
          <div className="w-24 h-24 clay-input rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin drop-shadow-md" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2 text-foreground drop-shadow-sm">Esperando al Llavero...</h1>
          <p className="text-muted-foreground mb-8 text-sm px-4">
            Entrega las llaves físicamente. Esta pantalla te avisará y mostrará el gancho cuando el llavero las guarde.
          </p>
          <Button
            variant="outline"
            className="w-full mt-4 h-14 border-dashed border-primary/50 text-primary font-bold bg-white/40 hover:bg-white/60 rounded-[1.2rem] transition-all"
            onClick={() => {
              if (ticketId) {
                updateTicket(ticketId, { status: 'SECURED', keyReceivedBy: 'k1', hookId: 'A3' })
              }
            }}
          >
            (Dev) Simular Llavero Guardando Llave
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full clay-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-foreground drop-shadow-sm">Asegurar Llaves</h1>
        </div>
      </div>

      <div className="clay-card p-5">
        <div className="text-center mb-6">
          <div className="w-20 h-20 clay-input rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="h-8 w-8 text-cyan-500 drop-shadow-sm" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">
            {isTeamMode ? 'Entrega las llaves al llavero' : 'Guarda la llave en el tablero'}
          </h1>
          <p className="text-muted-foreground text-sm font-medium px-4">
            {isTeamMode 
              ? 'Acércate al llavero para entregar las llaves del vehículo'
              : 'Selecciona el gancho y toma una foto de la llave colgada.'}
          </p>
        </div>

        <div className="clay-input p-4 rounded-2xl mb-8 border border-white/20">
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Vehículo</span>
            <span className="font-mono font-bold text-xl drop-shadow-sm">{ticket?.vehiclePlate || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Modelo</span>
            <span className="font-bold text-foreground text-right drop-shadow-sm">
              {[ticket?.vehicleMake, ticket?.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Ubicación</span>
            <span className="font-mono text-cyan-600 font-black text-lg drop-shadow-sm">Spot {ticket?.spotId || ticket?.locationNote || 'N/A'}</span>
          </div>
        </div>

        {isTeamMode ? (
          <Button
            onClick={handleNotify}
            className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
          >
            Notificar al llavero <ArrowRight className="h-6 w-6 ml-2" />
          </Button>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">1. Selecciona un Gancho</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1 scrollbar-none">
                {hooks.map((hook) => {
                  const isOccupied = hook.status !== 'free'
                  const isSelected = selectedHook === hook.id
                  return (
                    <button
                      key={hook.id}
                      onClick={() => !isOccupied && setSelectedHook(hook.id)}
                      disabled={isOccupied}
                      className={`h-14 rounded-[1.2rem] font-mono text-lg font-bold transition-all shadow-sm ${
                        isOccupied
                          ? 'bg-destructive/10 border-2 border-destructive/20 text-destructive opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'clay-btn-primary !bg-cyan-500 !text-white !shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),0_8px_15px_rgba(6,182,212,0.4)] scale-110'
                          : 'clay-input text-foreground hover:bg-white/40'
                      }`}
                    >
                      {hook.code}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedHook && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">2. Foto de la Llave en Gancho</h3>
                {!keyPhoto ? (
                  <div className="relative w-full h-14">
                    <Button
                      type="button"
                      className="w-full h-14 clay-btn-secondary pointer-events-none font-bold text-base"
                    >
                      <Camera className="h-6 w-6 mr-2" />
                      Tomar foto de la llave
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader()
                          reader.onload = (evt) => setKeyPhoto(evt.target?.result as string)
                          reader.readAsDataURL(e.target.files[0])
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                      <img src={keyPhoto} alt="Foto de la llave" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-success/90 backdrop-blur-md rounded-full p-2 shadow-lg">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-success text-center uppercase tracking-wider drop-shadow-sm">Foto de llave guardada</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4">
              <Button
                onClick={handleSelfStore}
                disabled={!selectedHook || !keyPhoto}
                className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider disabled:opacity-50"
              >
                <Check className="h-6 w-6 mr-2" />
                Guardar Llave
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
