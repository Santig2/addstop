'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Settings, Shield, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/store'

export default function KeyholderProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!currentUser) return null

  return (
    <div className="max-w-2xl mx-auto pb-32 animate-in fade-in zoom-in duration-500">
      <div className="mb-6 px-4 pt-4">
        <h1 className="font-serif text-3xl font-bold text-foreground drop-shadow-sm">Mi Perfil</h1>
        <p className="text-muted-foreground font-medium">Configuración y cuenta de Llavero</p>
      </div>

      <div className="px-4">
        <div className="clay-card mb-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-success/30 via-primary/10 to-transparent opacity-80" />
          <div className="p-6 relative z-10 pt-12">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full clay-input flex items-center justify-center mb-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-4 border-white/50 relative">
                <UserIcon className="h-12 w-12 text-primary drop-shadow-sm" />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-white shadow-sm" />
              </div>
              <h2 className="text-2xl font-bold drop-shadow-sm">{currentUser.name}</h2>
              <div className="flex items-center gap-2 mt-2 mb-6">
                <span className="px-4 py-1.5 rounded-full clay-input text-success font-bold uppercase tracking-wider text-xs">
                  {currentUser.role}
                </span>
                <span className="flex items-center text-xs font-bold text-success drop-shadow-sm uppercase tracking-wider">
                  <Shield className="h-4 w-4 mr-1" /> Activo
                </span>
              </div>
            </div>

          <div className="space-y-4 mt-6">
            <div className="clay-input p-4 rounded-2xl flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ID Empleado</p>
                  <p className="font-mono text-lg font-bold drop-shadow-sm text-foreground">{currentUser.id.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="clay-input p-4 rounded-2xl flex items-center justify-between border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success/10">
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estación</p>
                  <p className="font-bold text-lg drop-shadow-sm text-foreground">Tablero Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="space-y-4 px-4 mb-8">
        <Button 
          className="w-full h-16 justify-start px-5 clay-btn-secondary font-bold text-foreground" 
          onClick={() => router.push('/settings')}
        >
          <Settings className="h-6 w-6 mr-4 text-muted-foreground" />
          Configuración de App
        </Button>
        <Button 
          className="w-full h-16 justify-start px-5 clay-input !bg-destructive/10 text-destructive border-2 border-destructive/20 hover:bg-destructive/20 font-bold" 
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6 mr-4" />
          Cerrar Sesión
        </Button>
      </div>
      
      <p className="text-center text-xs font-bold text-muted-foreground/50 mt-12 uppercase tracking-wider">
        AddSpot v1.0.0
      </p>
    </div>
  )
}
