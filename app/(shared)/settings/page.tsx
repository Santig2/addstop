'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { companyInfo } from '@/lib/mock-data'
import { useAuth } from '@/lib/store'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const isAdmin = currentUser?.role === 'admin'

  const handleSignOut = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pt-6">
      <Card className="bg-card border-border overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary"></div>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Comercial</Label>
              <Input
                id="name"
                defaultValue={companyInfo.name}
                className="h-11 bg-surface border-border"
                disabled={!isAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                defaultValue={companyInfo.email}
                className="h-11 bg-surface border-border"
                disabled={!isAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={companyInfo.phone}
                className="h-11 bg-surface border-border"
                disabled={!isAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                defaultValue={companyInfo.address}
                className="h-11 bg-surface border-border"
                disabled={!isAdmin}
              />
            </div>
          </div>
          {isAdmin && (
            <Button className="h-11 px-6 bg-primary hover:brightness-110 font-bold mt-4">
              Guardar Cambios
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Alertas de Nuevo Check-in</p>
              <p className="text-xs text-muted-foreground mt-1">
                Recibe notificaciones cuando un vehículo ingresa
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Solicitudes de Entrega</p>
              <p className="text-xs text-muted-foreground mt-1">
                Avisos cuando el cliente pide su auto
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Reportes Diarios</p>
              <p className="text-xs text-muted-foreground mt-1">
                Resumen de operaciones vía email
              </p>
            </div>
            <Switch disabled={!isAdmin} />
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Suscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <p className="font-bold text-lg text-primary">Plan Profesional</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Valets ilimitados, analíticas avanzadas y soporte
                </p>
              </div>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider relative z-10 shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                Activa
              </span>
            </div>
            <Button variant="outline" className="mt-4 h-11 border-border hover:bg-surface font-medium">
              Gestionar Suscripción
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-destructive">Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Cerrar sesión de forma segura de tu cuenta en este dispositivo.
          </p>
          <Button 
            onClick={handleSignOut}
            variant="destructive" 
            className="h-12 w-full sm:w-auto px-6 font-bold text-base shadow-[0_0_15px_rgba(255,50,50,0.3)] hover:scale-[1.02] transition-all"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
