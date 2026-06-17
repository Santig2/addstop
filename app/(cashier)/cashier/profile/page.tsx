'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Settings, Shield, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/store'

export default function CashierProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!currentUser) return null

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Configuración y cuenta de Cajero</p>
      </div>

      <div className="clay-card mb-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cyan/30 to-primary/30 opacity-50"></div>
        <div className="p-6 relative z-10 pt-10">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full clay-input flex items-center justify-center mb-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-4 border-white/50 relative">
              <UserIcon className="h-12 w-12 text-primary drop-shadow-sm" />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-white shadow-sm" />
            </div>
            <h2 className="text-xl font-bold font-serif text-foreground drop-shadow-sm">{currentUser.name}</h2>
            <div className="flex items-center gap-2 mt-1 mb-4">
              <span className="px-4 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider drop-shadow-sm">
                {currentUser.role}
              </span>
              <span className="flex items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Shield className="h-3 w-3 mr-1" /> Activo
              </span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="clay-input flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white/20 shadow-inner">
                  <UserIcon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">ID Empleado</p>
                  <p className="font-mono font-bold text-foreground drop-shadow-sm">{currentUser.id.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="clay-input flex items-center justify-between p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white/20 shadow-inner">
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Estación</p>
                  <p className="font-bold text-foreground drop-shadow-sm">Caja Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <button 
          className="clay-input w-full h-14 flex items-center px-5 rounded-2xl transition-all hover:scale-[0.98]" 
          onClick={() => router.push('/settings')}
        >
          <Settings className="h-5 w-5 mr-4 text-foreground" />
          <span className="font-bold text-foreground">Configuración de App</span>
        </button>
        <button 
          className="clay-btn-primary !bg-destructive/80 !shadow-[0_10px_20px_rgba(239,68,68,0.2),inset_0_2px_5px_rgba(255,255,255,0.3)] w-full h-14 flex items-center px-5 rounded-2xl transition-all hover:scale-[0.98]" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-4" />
          <span className="font-bold text-white tracking-wider uppercase">Cerrar Sesión</span>
        </button>
      </div>
      
      <p className="text-center text-xs text-muted-foreground">
        AddSpot v1.0.0
      </p>
    </div>
  )
}
