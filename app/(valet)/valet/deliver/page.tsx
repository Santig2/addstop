'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronLeft, Key, Loader2, MapPin, Navigation, QrCode, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { tipAmounts } from '@/lib/mock-data'
import { useTickets, useAuth, useOperation, useKeyBoard, useSpots, useStaff, useStore, useOperationMode } from '@/lib/store'

type DeliveryStep = 'details' | 'request-keys' | 'keys-waiting' | 'keys-received' | 'tracking' | 'qr' | 'qr-scanned' | 'tip' | 'complete'

function DeliverContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  
  const { tickets, updateTicket } = useTickets()
  const { currentUser } = useAuth()
  const { addNotification, clearNotification } = useOperation()
  const { hooks } = useKeyBoard()
  const { updateSpotStatus } = useSpots()
  const { staff, setStaff } = useStaff()
  const { operationMode } = useOperationMode()
  const isTeamMode = operationMode === 'TEAM'
  
  const ticket = tickets.find(t => t.id === ticketId)
  
  const hook = hooks.find(h => h.ticketId === ticketId) || hooks.find(h => h.code === ticket?.hookId)
  const hookCode = hook?.code || ticket?.hookId || 'N/A'
  
  const [step, setStep] = useState<DeliveryStep>('details')
  const [selectedTip, setSelectedTip] = useState<number | null>(null)
  const [customTip, setCustomTip] = useState('')
  
  const [waitingInterval, setWaitingInterval] = useState<NodeJS.Timeout | null>(null)

  // Tracking variables
  const [seconds, setSeconds] = useState(0)
  const [distance, setDistance] = useState(0)

  // QR Scanning
  const [isScanning, setIsScanning] = useState(false)

  const requestKeys = () => {
    if (!currentUser || !ticketId) return
    
    if (!isTeamMode) {
      // Valet toma la llave él mismo
      if (ticket?.hookId) {
        const hookObj = hooks.find(h => h.code === ticket.hookId)
        if (hookObj) {
          updateHookStatus(hookObj.id, 'free', null)
        }
      }
      setStep('keys-received')
      return
    }

    addNotification({
      type: 'keys_request',
      fromRole: 'valet',
      toRole: 'keyholder',
      fromUserId: currentUser.id,
      toUserId: null,
      ticketId: ticketId,
      message: 'Solicito llaves: ' + (ticket?.vehiclePlate || 'Sin placa')
    })
    
    setStep('keys-waiting')
  }

  // Polling para detectar cuando el llavero nos entregó las llaves (keys_released)
  useEffect(() => {
    if (step === 'keys-waiting' && ticketId && currentUser) {
      const interval = setInterval(() => {
        const notifs = useStore.getState().notifications
        const releasedNotif = notifs.find((n: any) => 
          n.type === 'keys_released' && 
          n.toUserId === currentUser.id && 
          n.ticketId === ticketId && 
          !n.read
        )
        
        if (releasedNotif) {
          useStore.getState().clearNotification(releasedNotif.id)
          setStep('keys-received')
        }
      }, 2000)
      
      setWaitingInterval(interval)
      
      return () => clearInterval(interval)
    }
  }, [step, ticketId, currentUser])

  useEffect(() => {
    return () => {
      if (waitingInterval) clearInterval(waitingInterval)
    }
  }, [waitingInterval])

  // Tracking Simulation
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'tracking') {
      timer = setInterval(() => {
        setSeconds(s => s + 1)
        setDistance(d => d + 15) // +15 meters per second
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [step])

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleArrive = () => {
    if (ticketId) {
      updateTicket(ticketId, {
        gpsTrackReturn: [{ lat: 25.7617, lng: -80.1918, ts: Date.now() }],
        status: 'IN_RETRIEVAL'
      })
    }
    setStep('qr')
  }

  const handleScanQR = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setStep('qr-scanned')
      setTimeout(() => {
        if (!isTeamMode) {
          setStep('tip')
        } else {
          completeDelivery()
        }
      }, 1500)
    }, 1500)
  }

  const completeDelivery = () => {
    if (ticketId && currentUser) {
      const tip = selectedTip || (customTip ? parseFloat(customTip) : 0)
      
      updateTicket(ticketId, {
        status: 'COMPLETED',
        deliveredAt: Date.now(),
        tipAmount: tip > 0 ? tip : null,
      })
      
      if (ticket?.spotId) {
        updateSpotStatus(ticket.spotId, false, null)
      }

      // Update staff stats
      const updatedStaff = staff.map(s => {
        if (s.id === currentUser.id) {
          return {
            ...s,
            status: 'available' as const,
            activeTickets: Math.max(0, s.activeTickets - 1),
            tipsToday: s.tipsToday + tip,
            carsToday: s.carsToday + 1
          }
        }
        return s
      })
      setStaff(updatedStaff)
    }
    setStep('complete')
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-[#E8F0FE] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA] z-[-1]" />
        
        <div className="text-center w-full max-w-sm animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-success/20 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-50" />
            <Check className="h-12 w-12 text-success drop-shadow-md" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2 text-foreground drop-shadow-sm">¡Auto Entregado!</h1>
          <p className="text-muted-foreground font-medium mb-6">El vehículo <span className="font-bold text-foreground">{ticket?.vehiclePlate}</span> ha sido entregado exitosamente.</p>
          
          {(selectedTip || customTip) && (
            <div className="clay-card p-4 mb-8">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Propina recibida</p>
              <p className="text-success font-mono text-4xl font-black drop-shadow-sm">+${selectedTip || customTip}</p>
            </div>
          )}
          
          <Button
            onClick={() => router.push('/valet/home')}
            className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
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
          <h1 className="font-serif text-2xl font-bold text-foreground drop-shadow-sm">Entrega</h1>
        </div>
      </div>

      <div className="p-4 pt-0">
        {/* Vehicle Details */}
        {step === 'details' && (
          <div className="animate-in fade-in duration-300">
            <div className="clay-input p-5 rounded-2xl mb-8 border border-white/20">
              <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                <span className="font-mono text-3xl font-black text-foreground drop-shadow-sm">{ticket?.vehiclePlate || 'N/A'}</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold clay-card text-warning shadow-inner uppercase tracking-wider">
                  Solicitado
                </span>
              </div>
              <p className="text-muted-foreground font-bold text-sm mb-4">
                {[ticket?.vehicleMake, ticket?.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'} · {ticket?.vehicleColor || 'N/A'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="clay-card p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">
                    <MapPin className="h-4 w-4" />
                    Spot
                  </div>
                  <p className="font-mono text-2xl font-black text-foreground drop-shadow-sm">{ticket?.spotId || 'N/A'}</p>
                </div>
                <div className="clay-card p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">
                    <Key className="h-4 w-4" />
                    Gancho
                  </div>
                  <p className="font-mono text-2xl font-black text-foreground drop-shadow-sm">{hookCode}</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setStep('request-keys')}
              className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
            >
              Aceptar Solicitud
            </Button>
          </div>
        )}

        {/* Request keys from keyholder */}
        {step === 'request-keys' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="clay-card p-8 text-center mb-8">
              <div className="w-20 h-20 clay-input rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-10 w-10 text-cyan-500 drop-shadow-sm" />
              </div>
              <p className="font-bold text-xl mb-2">{isTeamMode ? 'Solicitar llaves al llavero' : 'Recuperar Llaves'}</p>
              <p className="text-sm font-medium text-muted-foreground px-2">
                {isTeamMode ? 'El llavero confirmará la entrega antes de salir al spot' : 'Busca la llave en el tablero y libérala'}
              </p>
              <div className="mt-6 clay-input p-4 rounded-xl inline-block border border-white/20">
                <p className="font-mono font-black text-3xl text-cyan-500 drop-shadow-sm">{hookCode}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Gancho</p>
              </div>
            </div>
            <Button
              onClick={requestKeys}
              className="w-full h-16 clay-btn-primary !bg-cyan-500 !text-white font-bold text-lg uppercase tracking-wider"
            >
              <Key className="h-6 w-6 mr-2" />
              {isTeamMode ? 'Pedir llaves' : 'Tomar Llaves'}
            </Button>
          </div>
        )}

        {/* Waiting for keyholder */}
        {step === 'keys-waiting' && (
          <div className="animate-in fade-in duration-300">
            <div className="clay-card p-8 text-center">
              <div className="w-24 h-24 clay-input rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-10 w-10 text-primary animate-spin drop-shadow-md" />
              </div>
              <p className="font-bold text-xl mb-3">Esperando llaves...</p>
              <p className="text-sm font-medium text-muted-foreground">
                El llavero está preparando las llaves del gancho{' '}
                <span className="font-mono font-black text-primary text-lg ml-1">{hookCode}</span>
              </p>
              <Button
                className="w-full mt-8 h-14 clay-btn-secondary border-dashed border-primary/50 text-primary font-bold"
                onClick={() => setStep('keys-received')}
              >
                (Dev) Simular Llavero
              </Button>
            </div>
          </div>
        )}

        {/* Keys received */}
        {step === 'keys-received' && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="clay-input p-5 rounded-2xl mb-8 border border-success/30 !bg-success/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/20 flex-shrink-0">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-success font-bold text-lg">Llaves recibidas</p>
                <p className="text-xs font-medium text-muted-foreground">Gancho {hookCode} liberado</p>
              </div>
            </div>
            <Button
              onClick={() => setStep('tracking')}
              className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider"
            >
              Salir al spot {ticket?.spotId || 'N/A'}
            </Button>
          </div>
        )}

        {/* GPS Tracking */}
        {step === 'tracking' && (
          <div className="flex flex-col h-full animate-in fade-in duration-300">
            <div className="mb-4 flex items-center gap-3 clay-card px-4 py-2 w-max rounded-full">
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">Retornando Vehículo</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="relative mb-16">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50" />
                <div className="absolute inset-[-20px] border-2 border-primary/20 rounded-full animate-[spin_4s_linear_infinite] border-dashed" />
                <div className="relative clay-btn-primary !bg-primary w-40 h-40 rounded-full flex items-center justify-center pointer-events-none">
                  <Navigation className="w-16 h-16 text-white drop-shadow-md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
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

            <Button
              onClick={handleArrive}
              className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider"
            >
              Llegué con el cliente
            </Button>
          </div>
        )}

        {/* QR Scan */}
        {(step === 'qr' || step === 'qr-scanned') && (
          <div className="animate-in slide-in-from-right-8 duration-300">
            <div className="text-center mb-8 mt-4">
              <div className="w-20 h-20 clay-input rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-10 w-10 text-primary drop-shadow-sm" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2 text-foreground drop-shadow-sm">Escanear QR del Cliente</h2>
              <p className="text-muted-foreground font-medium text-sm px-4">Pide al cliente que muestre su ticket digital o Wallet Pass</p>
            </div>
            
            <div className={`h-72 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-500 ${step === 'qr-scanned' ? 'clay-btn-primary !bg-success/10 border-4 border-success' : 'clay-input border-2 border-white/30'}`}>
              <div className="text-center">
                {step === 'qr-scanned' ? (
                  <div className="text-success animate-in zoom-in duration-300 flex flex-col items-center">
                    <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-4 shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                    <p className="font-black text-2xl drop-shadow-sm">QR Válido</p>
                    <p className="text-sm font-mono font-bold mt-1 opacity-80">Ticket #{ticket?.id.substring(0, 5)}</p>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center">
                    {isScanning ? (
                      <Loader2 className="h-14 w-14 mb-4 animate-spin text-primary drop-shadow-sm" />
                    ) : (
                      <div className="w-32 h-32 border-4 border-dashed border-primary/40 rounded-3xl mb-4 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5" />
                        <div className="w-full h-1 bg-primary/40 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                      </div>
                    )}
                    <p className="text-sm font-bold uppercase tracking-wider">{isScanning ? 'Escaneando...' : 'Apunta la cámara'}</p>
                  </div>
                )}
              </div>
            </div>
            
            {step === 'qr' && (
              <Button
                type="button"
                className="w-full h-16 clay-btn-primary font-bold text-lg uppercase tracking-wider relative overflow-hidden"
              >
                <QrCode className="h-6 w-6 mr-3" />
                Escanear QR con Cámara
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleScanQR()
                    }
                  }}
                />
              </Button>
            )}
          </div>
        )}

        {/* Tip */}
        {step === 'tip' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="clay-input p-4 rounded-2xl mb-8 border border-success/30 !bg-success/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/20 flex-shrink-0">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-success font-bold text-lg block drop-shadow-sm">QR Verificado</span>
                <span className="text-xs font-mono font-bold text-success/80">Ticket #{ticket?.id.substring(0, 5)}</span>
              </div>
            </div>
            
            <div className="clay-card p-6 mb-8">
              <h2 className="font-serif text-2xl font-bold mb-6 text-center text-foreground drop-shadow-sm">Agregar Propina</h2>
              
              <div className="grid grid-cols-4 gap-3 mb-6">
                {tipAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedTip(amount); setCustomTip('') }}
                    className={`h-16 rounded-2xl font-mono text-xl font-black transition-all ${
                      selectedTip === amount
                        ? 'clay-btn-primary !bg-success !text-white scale-110'
                        : 'clay-input text-foreground hover:bg-white/40 border border-white/20'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <input
                type="number"
                placeholder="Monto personalizado"
                value={customTip}
                onChange={(e) => { setCustomTip(e.target.value); setSelectedTip(null) }}
                className="w-full h-16 clay-input border-2 border-white/40 rounded-2xl px-4 font-mono text-center text-xl font-bold mb-4 outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
              />
              
              <button
                onClick={() => { setSelectedTip(0); setCustomTip('') }}
                className={`w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                  selectedTip === 0 && !customTip
                    ? 'clay-input !bg-destructive/10 text-destructive border border-destructive/20'
                    : 'clay-btn-secondary text-muted-foreground'
                }`}
              >
                Sin propina
              </button>
            </div>
            
            <Button
              onClick={completeDelivery}
              className="w-full h-16 clay-btn-primary !bg-success !text-white font-bold text-lg uppercase tracking-wider"
            >
              <Check className="h-6 w-6 mr-2" />
              Marcar como Entregado
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DeliverPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
      <DeliverContent />
    </Suspense>
  )
}
