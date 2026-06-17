'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Car, Clock, CheckCircle2, ChevronLeft, QrCode, X, Bell } from 'lucide-react'
import { useTickets, useOperation } from '@/lib/store'

export default function WalletPassDemo() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  
  const { tickets, updateTicket } = useTickets()
  const { addNotification } = useOperation()
  
  const ticket = tickets.find(t => t.id === ticketId)
  
  const [isRequesting, setIsRequesting] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Si el ticket no existe, vuelve.
  useEffect(() => {
    if (!ticketId || !ticket) {
      router.push('/demo-client')
    }
  }, [ticketId, ticket, router])

  if (!ticket) return null

  const isParked = ticket.status === 'SECURED' || ticket.status === 'parked'
  const isRequested = ticket.status === 'REQUESTED_BY_CLIENT' || ticket.status === 'requested' || ticket.status === 'dispatched'
  const isReturning = ticket.status === 'IN_RETRIEVAL' || ticket.status === 'returning'
  const isDelivered = ticket.status === 'COMPLETED' || ticket.status === 'delivered'

  const handleRequest = () => {
    setIsRequesting(true)
    setTimeout(() => {
      updateTicket(ticket.id, { 
        status: 'REQUESTED_BY_CLIENT',
        requestedAt: Date.now()
      })
      addNotification({
        type: 'delivery_request',
        fromRole: 'client',
        toRole: 'valet',
        fromUserId: 'client',
        toUserId: ticket.assignedValetId || null,
        ticketId: ticket.id,
        message: `El cliente ha solicitado el vehículo ${ticket.vehiclePlate}`
      })
      setIsRequesting(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans selection:bg-white/20">
      {/* Phone Frame */}
      <div className="w-[375px] h-[812px] bg-[#1C1C1E] rounded-[3rem] shadow-2xl relative overflow-hidden border-[12px] border-zinc-900 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 rounded-b-3xl w-[150px] mx-auto z-20" />
        
        {/* Header / Nav */}
        <div className="h-20 flex items-end justify-between px-4 pb-3 relative z-10">
          <button 
            onClick={() => router.push('/demo-client')}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-white font-semibold text-[15px]">Addspot</span>
          <div className="w-8" />
        </div>

        {/* Pass Content */}
        <div className="flex-1 px-4 pb-8 overflow-y-auto custom-scrollbar">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-zinc-800 to-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10">
            {/* Header Color Band */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div className="text-right text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-0.5">Valet Ticket</p>
                  <p className="font-mono text-xl font-bold">{ticket.vehiclePlate || 'N/A'}</p>
                </div>
              </div>
              
              <div className="text-white relative z-10 flex items-end gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Addspot</h2>
                <span className="mb-1 text-sm opacity-80 font-medium">Valet</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 pt-6 bg-zinc-900/90 backdrop-blur-xl relative">
              {/* Notch cutout effect in CSS */}
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Vehículo</p>
                  <p className="text-white font-medium text-lg">
                    {[ticket.vehicleMake, ticket.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Color</p>
                  <p className="text-white font-medium text-lg capitalize">{ticket.vehicleColor || 'N/A'}</p>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Hora de Check-in</p>
                  <p className="text-white font-medium text-lg">
                    {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-1">Ticket ID</p>
                  <p className="text-white font-mono text-lg">{ticket.id.substring(0, 6).toUpperCase()}</p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-8 rounded-2xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  {isDelivered ? (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                  ) : isReturning ? (
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-cyan-400" />
                    </div>
                  ) : isRequested ? (
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                  
                  <div>
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-0.5">Estado Actual</p>
                    <p className="text-white font-semibold text-[15px]">
                      {isDelivered ? 'Vehículo Entregado' 
                        : isReturning ? 'Valet en camino hacia ti' 
                        : isRequested ? 'Preparando vehículo...' 
                        : isParked ? 'Estacionado y Seguro'
                        : 'En proceso de estacionamiento'}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Toggle */}
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors text-white font-medium flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  {showQR ? 'Ocultar código QR' : 'Mostrar código QR'}
                </button>
              </div>

              {/* QR Code Area */}
              {showQR && (
                <div className="mt-4 bg-white rounded-2xl p-6 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-48 h-48 border-4 border-black rounded-xl flex items-center justify-center relative overflow-hidden">
                    <QrCode className="w-32 h-32 text-black" />
                    {/* Simulated scan line */}
                    <div className="absolute inset-x-0 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] top-0 animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                  <p className="text-black font-mono font-bold mt-4 tracking-widest">{ticket.id.substring(0, 8).toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!isDelivered && (
            <div className="mt-8">
              {isParked || (!isRequested && !isReturning && !isDelivered) ? (
                <button
                  onClick={handleRequest}
                  disabled={isRequesting}
                  className="w-full h-16 rounded-[1.2rem] bg-white text-black font-bold text-[17px] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRequesting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Solicitando...
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5" />
                      Solicitar mi Vehículo
                    </>
                  )}
                </button>
              ) : isRequested || isReturning ? (
                <div className="w-full h-16 rounded-[1.2rem] bg-white/10 text-white font-bold text-[17px] flex items-center justify-center gap-2 border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  Vehículo Solicitado
                </div>
              ) : null}
              <p className="text-center text-white/40 text-xs mt-4">
                El valet será notificado inmediatamente y preparará su vehículo en la zona de entrega.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
