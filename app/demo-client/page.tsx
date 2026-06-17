'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Battery, Wifi, Signal, Search, ArrowLeft, Info, Check } from 'lucide-react'
import { useTickets } from '@/lib/store'

export default function IMessageDemo() {
  const router = useRouter()
  const { tickets } = useTickets()
  
  // Get all active tickets to show in the demo
  const activeTickets = tickets.filter(t => !['COMPLETED'].includes(t.status))

  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl relative overflow-hidden border-[12px] border-zinc-900 flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 bg-zinc-900 rounded-b-3xl w-[150px] mx-auto z-20" />
        
        {/* Status Bar */}
        <div className="h-12 bg-[#F6F6F6] flex justify-between items-center px-6 pt-3 pb-1 text-xs font-medium relative z-10">
          <span className="w-16">{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#F6F6F6] px-4 pb-2 pt-2 border-b border-gray-200/50 backdrop-blur-md relative z-10">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-[#007AFF] font-medium text-[17px]">
              <ArrowLeft className="w-6 h-6 mr-1" />
              <span className="mb-0.5">2</span>
            </button>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-300 to-gray-400 flex items-center justify-center text-white mb-0.5 shadow-sm">
                A
              </div>
              <span className="text-[11px] font-medium text-black">Addspot Valet</span>
            </div>
            <button className="text-[#007AFF]">
              <Info className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white overflow-y-auto p-4 flex flex-col space-y-4 custom-scrollbar">
          <div className="text-center text-[11px] text-gray-500 font-medium my-2">
            Text Message • Today {currentTime}
          </div>

          {activeTickets.length === 0 ? (
            <div className="text-center text-sm text-gray-400 mt-10">
              No hay tickets activos.<br/>Crea uno en el sistema.
            </div>
          ) : (
            activeTickets.map(ticket => (
              <div key={ticket.id} className="flex flex-col max-w-[80%]">
                {/* Bubble */}
                <div className="bg-[#E9E9EB] text-black px-4 py-2.5 rounded-2xl rounded-tl-sm text-[15px] leading-[1.35] shadow-sm">
                  Hola {ticket.clientName || 'Cliente'}, tu vehículo {ticket.vehiclePlate || 'N/A'} ha sido recibido. 
                  <br/><br/>
                  Abre tu ticket digital aquí:
                </div>
                {/* Link Preview */}
                <div 
                  onClick={() => router.push(`/demo-client/pass?ticketId=${ticket.id}`)}
                  className="mt-1 bg-[#E9E9EB] rounded-2xl overflow-hidden cursor-pointer active:opacity-70 transition-opacity"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-black p-4 flex flex-col items-center justify-center relative overflow-hidden h-32">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 w-16 h-16 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-lg">
                      <span className="font-mono text-2xl font-black text-white">{ticket.vehiclePlate?.substring(0,2) || 'TK'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#E9E9EB]">
                    <div className="text-[13px] font-semibold text-black mb-0.5">Addspot Wallet Pass</div>
                    <div className="text-[11px] text-gray-500">addspot.com/t/{ticket.id.substring(0, 8)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-[#F6F6F6] p-3 border-t border-gray-200/50 pb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E9E9EB] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded-full h-9 flex items-center px-4">
              <span className="text-[#C7C7CC] text-[15px]">Text Message</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
