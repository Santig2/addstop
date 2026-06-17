'use client'

import { useState } from 'react'
import { Key, X } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useKeyBoard, useTickets, useStaff } from '@/lib/store'
import type { Hook, Ticket } from '@/lib/store'

export default function KeyboardPage() {
  const { keyBoards, hooks } = useKeyBoard()
  const { tickets } = useTickets()
  const { staff } = useStaff()

  const [activeBoardId, setActiveBoardId] = useState(keyBoards[0]?.id || '')
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null)

  const activeBoard = keyBoards.find(b => b.id === activeBoardId) || keyBoards[0]
  const boardHooks = hooks.filter(h => h.boardId === activeBoard?.id)

  const freeCount = boardHooks.filter((h) => h.status === 'free').length
  const occupiedCount = boardHooks.filter((h) => h.status === 'occupied').length
  const disabledCount = boardHooks.filter((h) => h.status === 'disabled').length

  // Generar grid
  const gridRows: Hook[][] = []
  if (activeBoard) {
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    for (let r = 0; r < activeBoard.rows; r++) {
      const row: Hook[] = []
      for (let c = 0; c < activeBoard.cols; c++) {
        const code = activeBoard.format === 'hotel' 
          ? `${rowLabels[r]}${c + 1}` 
          : `${(r * activeBoard.cols) + c + 1}`
        const hook = boardHooks.find((h) => h.code === code)
        if (hook) row.push(hook)
      }
      if (row.length > 0) gridRows.push(row)
    }
  }

  // Datos del ticket seleccionado
  const selectedTicket: Ticket | undefined = selectedHook?.ticketId 
    ? tickets.find(t => t.id === selectedHook.ticketId) 
    : undefined

  const checkedInBy = selectedTicket?.assignedBy 
    ? staff.find(s => s.id === selectedTicket.assignedBy)
    : staff.find(s => s.id === selectedTicket?.assignedValetId)

  return (
    <div>
      <AdminHeader title="Key Board" breadcrumb={['Admin', 'Key Board']} />

      <div className="clay-card p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold font-serif text-foreground">{activeBoard?.name || 'Tablero Principal'}</h2>
            <Tabs value={activeBoardId} onValueChange={setActiveBoardId} className="w-auto">
              <TabsList className="clay-input p-1 h-auto rounded-2xl">
                {keyBoards.map(board => (
                  <TabsTrigger 
                    key={board.id} 
                    value={board.id} 
                    className="text-xs rounded-xl font-bold px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
                  >
                    {board.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div>
          <div className="clay-input rounded-2xl p-6 mb-6 overflow-x-auto custom-scrollbar">
            <div className="inline-block min-w-max">
              {gridRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 mb-2">
                  {row.map((hook) => {
                    const isOccupied = hook.status === 'occupied'
                    const isDisabled = hook.status === 'disabled'

                    return (
                      <button
                        key={hook.code}
                        type="button"
                        onClick={() => {
                          if (isOccupied) {
                            setSelectedHook(hook)
                          }
                        }}
                        disabled={isDisabled}
                        className={`w-14 h-14 rounded-2xl text-sm font-mono font-bold transition-all flex items-center justify-center relative overflow-hidden ${
                          isDisabled
                            ? 'clay-input opacity-50 cursor-not-allowed text-muted-foreground'
                            : isOccupied
                            ? 'clay-btn-primary !bg-warning !text-warning-foreground cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 scale-105'
                            : 'clay-btn-secondary cursor-default text-muted-foreground'
                        }`}
                      >
                        {isDisabled ? (
                          <X className="h-4 w-4" />
                        ) : isOccupied ? (
                          <Key className="h-4 w-4" />
                        ) : (
                          hook.code
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg clay-btn-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                A1
              </div>
              <span className="text-foreground font-medium">Libres ({freeCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg clay-btn-primary !bg-warning flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <Key className="h-3 w-3 text-white" />
              </div>
              <span className="text-foreground font-medium">Ocupados ({occupiedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg clay-input opacity-50 flex items-center justify-center">
                <X className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground font-medium">Deshabilitados ({disabledCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hook Details Sheet */}
      <Sheet open={!!selectedHook} onOpenChange={() => setSelectedHook(null)}>
        <SheetContent className="bg-card border-border">
          <SheetHeader>
            <SheetTitle className="font-serif">Gancho {selectedHook?.code}</SheetTitle>
          </SheetHeader>
          {selectedHook && selectedTicket && (
            <div className="mt-6 space-y-6">
              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Placa del vehículo</p>
                <p className="font-mono text-xl font-bold">{selectedTicket.vehiclePlate || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Vehículo</p>
                  <p className="font-medium">{[selectedTicket.vehicleMake, selectedTicket.vehicleModel].filter(Boolean).join(' ') || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.vehicleColor || 'N/A'}</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Spot de Parking</p>
                  <p className="font-mono font-medium">{selectedTicket.spotId || '--'}</p>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Recibido por</p>
                {checkedInBy ? (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {checkedInBy.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{checkedInBy.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedHook.assignedAt || selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm mt-2">No registrado</p>
                )}
              </div>

              <Button className="w-full h-11 bg-primary hover:brightness-110">
                Ver Ticket Completo
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
