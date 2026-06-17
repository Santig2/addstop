'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Settings, Shield, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/store'

export default function AdminProfilePage() {
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
        <p className="text-muted-foreground">Cuenta Administrativa</p>
      </div>

      <Card className="bg-card border-border mb-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/30 to-secondary/30 opacity-50"></div>
        <CardContent className="p-6 relative z-10 pt-10">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-surface border-4 border-background flex items-center justify-center mb-4 shadow-lg text-primary">
              <span className="text-3xl font-bold">{currentUser.name?.substring(0, 2).toUpperCase() || 'AD'}</span>
            </div>
            <h2 className="text-xl font-bold">{currentUser.name || 'Super Admin'}</h2>
            <div className="flex items-center gap-2 mt-1 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-xs font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="flex items-center text-xs text-muted-foreground">
                <Shield className="h-3 w-3 mr-1" /> Control Total
              </span>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ID Administrador</p>
                  <p className="font-mono font-medium">{currentUser.id.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                  <p className="font-medium">admin@addspot.com</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 mb-8">
        <Button variant="outline" className="w-full h-14 justify-start px-4 bg-card border-border hover:bg-white/5" onClick={() => router.push('/admin/settings')}>
          <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
          Configuración de la App
        </Button>
        <Button 
          variant="destructive" 
          className="w-full h-14 justify-start px-4 font-bold text-base" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
      
      <p className="text-center text-xs text-muted-foreground">
        AddSpot v1.0.0
      </p>
    </div>
  )
}
