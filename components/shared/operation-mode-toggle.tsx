'use client'

import { Users, UserCircle } from 'lucide-react'
import { useOperationMode } from '@/lib/store'
import { motion } from 'framer-motion'

export function OperationModeToggle() {
  const { operationMode, setOperationMode } = useOperationMode()
  const isTeam = operationMode === 'TEAM'

  const toggleMode = () => {
    setOperationMode(isTeam ? 'INDEPENDENT' : 'TEAM')
  }

  return (
    <div className="flex items-center gap-3 clay-card px-4 py-2 bg-background/50 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm">
      <div className="flex flex-col text-right">
        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-80">Modo Operación</span>
        <span className={`text-sm font-bold ${isTeam ? 'text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}>
          {isTeam ? 'EQUIPO' : 'INDEPENDIENTE'}
        </span>
      </div>
      
      <button 
        onClick={toggleMode}
        className={`relative w-16 h-8 rounded-full flex items-center p-1 transition-colors duration-500 ease-in-out shadow-inner ${
          isTeam ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-warning/20 border-warning/30'
        } border`}
      >
        <motion.div
          layout
          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)] ${
            isTeam ? 'bg-cyan-500' : 'bg-warning'
          }`}
          animate={{
            x: isTeam ? 0 : 32
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isTeam ? (
            <Users className="w-3.5 h-3.5 text-white" />
          ) : (
            <UserCircle className="w-3.5 h-3.5 text-white" />
          )}
        </motion.div>
      </button>
    </div>
  )
}
