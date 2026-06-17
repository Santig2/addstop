'use client'

import { useState } from 'react'
import { Check, Key, X, Upload } from 'lucide-react'
import { KeyBoardGrid, KeyBoardLegend } from '@/components/key-board-grid'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth, useKeyBoard, useOperation, useStaff, useTickets, useOperationMode } from '@/lib/store'
import type { Notification } from '@/lib/store'

type PanelMode = 'idle' | 'confirm-select'

export default function KeyholderBoardPage() {
  const { currentUser } = useAuth()
  const { keyBoards, hooks, updateHookStatus } = useKeyBoard()
  const { tickets, updateTicket } = useTickets()
  const { staff } = useStaff()
  const { notifications, clearNotification, addNotification } = useOperation()
  const { operationMode } = useOperationMode()

  const isReadOnly = operationMode === 'INDEPENDENT'

  const [selectedHook, setSelectedHook] = useState<string | null>(null)
  const [panelMode, setPanelMode] = useState<PanelMode>('idle')
  const [activeDelivery, setActiveDelivery] = useState<Notification | null>(null)
  
  const [occupiedHookDetail, setOccupiedHookDetail] = useState<string | null>(null)

  const pendingDeliveries = notifications.filter(
    (n) => n.type === 'keys_handoff' && n.toRole === 'keyholder' && !n.read
  )
  
  const pendingRequests = notifications.filter(
    (n) => n.type === 'keys_request' && n.toRole === 'keyholder' && !n.read
  )

  const board = keyBoards[0] // Usamos el primer tablero configurado
  const activeHooks = hooks.filter(h => h.boardId === board?.id)
  const boardRows: any[] = []
  
  if (board) {
    if (board.format === 'hotel') {
      const cols = board.cols || 8
      for (let i = 0; i < activeHooks.length; i += cols) {
        boardRows.push(activeHooks.slice(i, i + cols))
      }
    } else {
      const perRow = board.perRow || 50
      for (let i = 0; i < activeHooks.length; i += perRow) {
        boardRows.push(activeHooks.slice(i, i + perRow))
      }
    }
  }

  const startConfirmDelivery = (notif: Notification) => {
    setActiveDelivery(notif)
    setSelectedHook(null)
    setPanelMode('confirm-select')
  }

  const confirmDelivery = () => {
    if (!activeDelivery || !selectedHook || !currentUser) return
    
    // Store updates
    updateHookStatus(selectedHook, 'occupied', activeDelivery.ticketId)
    updateTicket(activeDelivery.ticketId, {
      hookId: selectedHook,
      keyBoardId: board?.id || 'board-1',
      keyReceivedBy: currentUser.id,
      keysReceivedAt: Date.now(),
      status: 'complete'
    })
    
    clearNotification(activeDelivery.id)
    
    setPanelMode('idle')
    setActiveDelivery(null)
    setSelectedHook(null)
  }

  const handleDeliver = (notif: Notification) => {
    if (!currentUser) return
    const ticket = tickets.find(t => t.id === notif.ticketId)
    if (!ticket || !ticket.hookId) return

    updateHookStatus(ticket.hookId, 'free', null)
    updateTicket(ticket.id, { keyReleasedTo: notif.fromUserId, hookId: null })
    clearNotification(notif.id)
    
    addNotification({
      type: 'keys_released',
      fromRole: 'keyholder',
      toRole: 'valet',
      fromUserId: currentUser.id,
      toUserId: notif.fromUserId,
      ticketId: ticket.id,
      message: 'Llaves entregadas'
    })
  }

  const handleHookSelect = (hookCode: string) => {
    if (isReadOnly) return // Bloqueado en Solo Lectura
    const hook = activeHooks.find(h => h.code === hookCode)
    if (!hook) return

    if (panelMode === 'confirm-select') {
      if (hook.status === 'free') {
        setSelectedHook(hookCode)
      }
    } else {
      if (hook.status === 'occupied') {
        setOccupiedHookDetail(hookCode)
      }
    }
  }

  // Get ticket for occupied details
  const detailHook = activeHooks.find(h => h.code === occupiedHookDetail)
  const detailTicket = detailHook?.ticketId ? tickets.find(t => t.id === detailHook.ticketId) : null
  const detailValet = detailTicket ? staff.find(s => s.id === detailTicket.assignedValetId) : null

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-5rem)] pb-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Board — 75% */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        <div className="mb-6 px-2 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Tablero de Llaves</h1>
            {isReadOnly && (
              <span className="inline-block mt-2 px-3 py-1 bg-warning/20 text-warning text-xs font-bold uppercase tracking-wider rounded-full">
                Modo Independiente: Solo Lectura
              </span>
            )}
          </div>
          {panelMode === 'confirm-select' && !isReadOnly ? (
            <p className="text-base font-bold text-cyan mt-2 animate-pulse flex items-center gap-2">
              <Key className="h-5 w-5" />
              Selecciona el gancho libre donde colocarás estas llaves
            </p>
          ) : !isReadOnly ? (
            <p className="text-muted-foreground font-medium mt-1">
              Selecciona un gancho ocupado para ver detalles
            </p>
          ) : null}
        </div>

        {board ? (
          <div className={`flex-1 flex flex-col items-center ${isReadOnly ? 'opacity-70 pointer-events-none' : ''}`}>
            <KeyBoardGrid
              format={board.format}
              grid={board.format === 'hotel' ? boardRows : undefined}
              numericRows={board.format === 'numeric' ? boardRows : undefined}
              selectedHook={panelMode === 'confirm-select' ? selectedHook : undefined}
              onSelect={handleHookSelect}
              size="md"
            />
            <div className="mt-8">
              <KeyBoardLegend />
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground clay-input rounded-3xl mx-2">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">No hay tableros configurados</p>
          </div>
        )}
        
        {/* Confirm buttons */}
        {panelMode === 'confirm-select' && selectedHook && (
          <div className="mt-8 flex items-center gap-4 clay-card p-6 border-2 border-success/30 shadow-[0_10px_30px_rgba(34,197,94,0.15)] animate-in slide-in-from-bottom-4">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Gancho Seleccionado</p>
              <p className="font-mono text-3xl font-bold text-cyan">{selectedHook}</p>
            </div>
            <button onClick={confirmDelivery} className="h-14 px-8 clay-btn-primary bg-success text-white text-lg flex items-center gap-2">
              <Check className="h-6 w-6" />
              Confirmar Guardado
            </button>
            <button
              onClick={() => { setPanelMode('idle'); setSelectedHook(null); setActiveDelivery(null) }}
              className="h-14 px-6 clay-btn-secondary text-muted-foreground font-bold"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Side panel — 25% */}
      {!isReadOnly && (
        <div className="xl:w-96 space-y-6 flex-shrink-0 flex flex-col">
          {/* Pending deliveries */}
          <div className="clay-card flex flex-col h-1/2">
          <div className="p-5 border-b border-border/50">
            <h2 className="text-lg font-bold flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> Recibir Llaves</span>
              {pendingDeliveries.length > 0 && (
                <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(91,127,255,0.5)] animate-pulse">
                  {pendingDeliveries.length}
                </span>
              )}
            </h2>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {pendingDeliveries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70">
                <Check className="h-8 w-8 mb-2 text-success" />
                <p className="text-sm font-bold">Sin llaves por recibir</p>
              </div>
            ) : (
              pendingDeliveries.map((notif) => {
                const valet = staff.find(s => s.id === notif.fromUserId)
                const ticket = tickets.find(t => t.id === notif.ticketId)
                const isSelected = activeDelivery?.id === notif.id

                return (
                  <div key={notif.id} className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'clay-input bg-cyan/10 border-cyan' : 'clay-card'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-2xl text-foreground">{ticket?.vehiclePlate || 'N/A'}</span>
                      <span className="text-xs font-bold text-muted-foreground bg-surface px-2 py-1 rounded-md">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Valet: <strong className="text-foreground">{valet?.name || 'Desconocido'}</strong>
                    </p>
                    <button
                      onClick={() => startConfirmDelivery(notif)}
                      className={`w-full h-12 rounded-xl font-bold flex items-center justify-center transition-all active:scale-95 ${isSelected ? 'bg-cyan text-white shadow-[0_4px_15px_rgba(6,182,212,0.4)]' : 'clay-btn-primary'}`}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {isSelected ? 'Selecciona un gancho...' : 'Recibir y Guardar'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Key requests */}
        <div className="clay-card flex flex-col h-1/2 border-2 border-warning/20">
          <div className="p-5 border-b border-border/50 bg-warning/5">
            <h2 className="text-lg font-bold flex items-center justify-between text-warning">
              <span className="flex items-center gap-2"><Upload className="h-5 w-5" /> Entregar Llaves</span>
              {pendingRequests.length > 0 && (
                <span className="w-6 h-6 bg-warning text-white text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </h2>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            {pendingRequests.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70">
                <Check className="h-8 w-8 mb-2 text-success" />
                <p className="text-sm font-bold">Sin solicitudes pendientes</p>
              </div>
            ) : (
              pendingRequests.map((notif) => {
                const valet = staff.find(s => s.id === notif.fromUserId)
                const ticket = tickets.find(t => t.id === notif.ticketId)
                const hook = hooks.find(h => h.ticketId === notif.ticketId)

                return (
                  <div key={notif.id} className="clay-card p-4 border-2 border-warning/40 shadow-[0_4px_15px_rgba(245,158,11,0.1)]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-2xl text-foreground">{ticket?.vehiclePlate || 'N/A'}</span>
                      <span className="font-mono text-lg font-bold text-warning bg-warning/10 px-3 py-1 rounded-xl shadow-inner">
                        G {hook?.code || 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Para: <strong className="text-foreground">{valet?.name || 'Valet'}</strong>
                    </p>
                    <button
                      onClick={() => handleDeliver(notif)}
                      className="w-full h-12 rounded-xl font-bold bg-warning hover:bg-warning/90 text-white flex items-center justify-center transition-all active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.3)]"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Marcar Entregadas
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      )}

      {/* Occupied Hook Dialog */}
      <Dialog open={!!occupiedHookDetail} onOpenChange={(open) => !open && setOccupiedHookDetail(null)}>
        <DialogContent className="bg-background border-border sm:max-w-[400px] p-0 overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <div className="clay-card h-full p-6 border-0">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-serif text-2xl text-foreground">Detalle del Gancho</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center clay-input rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Código</span>
                <span className="font-mono text-5xl font-bold text-cyan drop-shadow-md">{occupiedHookDetail}</span>
              </div>
              
              {detailTicket ? (
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-center border-b border-muted/50 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placa</span>
                    <span className="font-mono text-xl font-bold text-foreground">{detailTicket.vehiclePlate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-muted/50 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Modelo</span>
                    <span className="font-medium text-foreground text-right">
                      {[detailTicket.vehicleMake, detailTicket.vehicleModel].filter(Boolean).join(' ') || 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-muted/50 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Spot</span>
                    <span className="font-mono font-bold text-primary text-lg">{detailTicket.spotId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Traídas por</span>
                    <span className="font-medium text-foreground">{detailValet?.name || 'Desconocido'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium text-muted-foreground text-center py-6 clay-input rounded-2xl">
                  No hay información de ticket asociada a este gancho.
                </p>
              )}
              
              <button onClick={() => setOccupiedHookDetail(null)} className="clay-btn-secondary w-full h-12 font-bold text-muted-foreground">
                Cerrar Detalles
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
