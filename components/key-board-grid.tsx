'use client'

import { Key, X } from 'lucide-react'

export type HookStatus = 'free' | 'occupied' | 'disabled'

export interface Hook {
  code: string
  status: HookStatus
  plate?: string
}

interface KeyBoardGridProps {
  format: 'hotel' | 'numeric'
  /** hotel mode: 2-D array already built by generateKeyboardGrid() */
  grid?: Hook[][]
  /** numeric mode: flat two-row array from generateNumericKeyboardGrid() */
  numericRows?: Hook[][]
  selectedHook?: string | null
  onSelect?: (code: string) => void
  /** hooks to visually highlight (e.g. keyholder confirm flow) */
  highlightHook?: string | null
  size?: 'sm' | 'md'
}

function hookClass(
  hook: Hook,
  selected: boolean,
  highlighted: boolean,
  size: 'sm' | 'md'
): string {
  const dim = size === 'sm' ? 'w-10 h-10 text-xs' : 'w-14 h-14 text-sm'
  const base = `${dim} rounded-xl font-mono font-bold transition-all duration-200 flex flex-col items-center justify-center relative overflow-hidden`

  if (hook.status === 'disabled')
    return `${base} clay-input opacity-50 text-muted-foreground/50 cursor-not-allowed`
  
  if (hook.status === 'occupied')
    return `${base} clay-input bg-success/10 text-success border-2 border-success/30 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1),0_0_15px_rgba(34,197,94,0.3)]`
  
  if (highlighted)
    return `${base} clay-btn-secondary border-2 border-success text-success shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse scale-105 z-10`
  
  if (selected)
    return `${base} clay-input bg-cyan/10 text-cyan border-2 border-cyan shadow-[inset_0_4px_10px_rgba(0,0,0,0.1),0_0_15px_rgba(6,182,212,0.4)] scale-95`
  
  // Default free state
  return `${base} clay-btn-secondary text-foreground hover:text-primary hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(91,127,255,0.2)] active:scale-95`
}

function HookButton({
  hook,
  selected,
  highlighted,
  size,
  onSelect,
}: {
  hook: Hook
  selected: boolean
  highlighted: boolean
  size: 'sm' | 'md'
  onSelect?: (code: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(hook.code)}
      className={hookClass(hook, selected, highlighted, size)}
    >
      {/* 3D Inner highlight for occupied to simulate key */}
      {hook.status === 'occupied' && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      )}
      
      {hook.status === 'disabled' ? (
        <X className="h-4 w-4" />
      ) : hook.status === 'occupied' ? (
        <>
          <Key className="h-5 w-5 mb-0.5 drop-shadow-md" />
          <span className="text-[10px] leading-none opacity-80">{hook.code}</span>
        </>
      ) : (
        hook.code
      )}
    </button>
  )
}

export function KeyBoardGrid({
  format,
  grid,
  numericRows,
  selectedHook,
  onSelect,
  highlightHook,
  size = 'md',
}: KeyBoardGridProps) {
  const rows: Hook[][] =
    format === 'hotel'
      ? (grid ?? [])
      : (numericRows ?? [])

  return (
    <div className="clay-card p-6 overflow-x-auto custom-scrollbar">
      <div className="inline-block min-w-max space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3">
            {row.map((hook) => (
              <HookButton
                key={hook.code}
                hook={hook}
                selected={selectedHook === hook.code}
                highlighted={highlightHook === hook.code}
                size={size}
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function KeyBoardLegend({ showOccupied = true }: { showOccupied?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm mt-6 font-medium flex-wrap bg-surface py-3 px-6 rounded-[2rem] border border-border/50 shadow-sm inline-flex mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md clay-btn-secondary" />
        <span className="text-foreground">Libre</span>
      </div>
      {showOccupied && (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md clay-input bg-success/10 border-2 border-success/30 flex items-center justify-center">
            <Key className="h-3 w-3 text-success" />
          </div>
          <span className="text-foreground">Ocupado</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md clay-input opacity-50 flex items-center justify-center">
          <X className="h-3 w-3 text-muted-foreground/50" />
        </div>
        <span className="text-muted-foreground">Deshabilitado</span>
      </div>
    </div>
  )
}
