'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Shield, Settings, StopCircle, AlertTriangle } from 'lucide-react'
import { OperationModeToggle } from '@/components/shared/operation-mode-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth, useTickets } from '@/lib/store'

export default function ValetProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useAuth()
  const { tickets } = useTickets()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleEndShift = () => {
    logout()
    router.push('/login')
  }

  // Active (incomplete) tickets for this valet
  const activeTickets = tickets.filter(
    (t) => t.assignedValetId === currentUser?.id && t.status !== 'COMPLETED'
  )

  if (!currentUser) return null

  return (
    <div className="pb-32 animate-in fade-in zoom-in duration-500">
      <div className="mb-6 px-4 pt-4">
        <h1 className="font-serif text-3xl font-bold text-foreground drop-shadow-sm">Mi Perfil</h1>
        <p className="text-muted-foreground font-medium">Configuración y cuenta</p>
      </div>

      {/* Profile Card */}
      <div className="px-4">
        <div className="clay-card mb-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-secondary/10 to-transparent opacity-80" />
          <div className="p-6 relative z-10 pt-12">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full clay-input flex items-center justify-center mb-4 shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-4 border-white/50 relative">
                <span className="text-4xl font-bold text-primary drop-shadow-sm">
                  {currentUser.name?.substring(0, 2).toUpperCase() || 'VA'}
                </span>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full border-2 border-white shadow-sm" />
              </div>
              <h2 className="text-2xl font-bold drop-shadow-sm">{currentUser.name}</h2>
              <div className="flex items-center gap-2 mt-2 mb-6">
                <span className="px-4 py-1.5 rounded-full clay-input text-primary text-xs font-bold uppercase tracking-wider">
                  {currentUser.role}
                </span>
                <span className="flex items-center text-xs font-bold text-success drop-shadow-sm uppercase tracking-wider">
                  <Shield className="h-4 w-4 mr-1" /> Activo
                </span>
              </div>
            </div>

            <div className="mt-2">
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
            </div>
          </div>
        </div>

        {/* Operation Mode Toggle */}
        <div className="mb-8">
          <OperationModeToggle />
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-8">
          <Button
            className="w-full h-16 justify-start px-5 clay-btn-secondary font-bold text-foreground"
            onClick={() => router.push('/settings')}
          >
            <Settings className="h-6 w-6 mr-4 text-muted-foreground" />
            Configuración de App
          </Button>

          <Button
            className="w-full h-16 justify-start px-5 clay-btn-secondary font-bold text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6 mr-4 text-muted-foreground" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* End Shift */}
      <div className="pt-2 px-4">
        <p className="text-xs font-bold text-muted-foreground text-center mb-4 uppercase tracking-wider">Zona de turno</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full h-16 justify-start px-5 clay-input !bg-destructive/10 text-destructive border-2 border-destructive/20 hover:bg-destructive/20 font-bold"
            >
              <StopCircle className="h-6 w-6 mr-4" />
              Finalizar Turno
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="clay-card border-white/20 rounded-[2rem] max-w-[90vw] w-[360px] p-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-destructive/20 via-transparent to-transparent opacity-50 z-[-1]" />
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-2xl font-bold drop-shadow-sm text-foreground">¿Finalizar tu turno?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="pt-4">
                  {activeTickets.length > 0 ? (
                    <div className="flex items-start gap-4 clay-input !bg-warning/10 border-warning/30 rounded-2xl p-5">
                      <AlertTriangle className="h-8 w-8 text-warning flex-shrink-0" />
                      <div>
                        <p className="text-warning font-bold mb-1 text-base drop-shadow-sm">
                          {activeTickets.length} ticket(s) sin completar
                        </p>
                        <p className="text-warning/80 text-sm font-medium">
                          Debes completar todos los tickets antes de finalizar el turno.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground font-medium">
                      Todos los tickets están completos. Se cerrará tu sesión al confirmar.
                    </p>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-3 sm:gap-3 flex flex-col sm:flex-row">
              <AlertDialogCancel className="w-full sm:w-1/2 h-14 rounded-2xl clay-btn-secondary text-foreground font-bold mt-0 border-0">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEndShift}
                disabled={activeTickets.length > 0}
                className="w-full sm:w-1/2 h-14 rounded-2xl clay-btn-primary !bg-destructive text-white font-bold tracking-wider mt-0 disabled:opacity-50"
              >
                Finalizar Turno
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="text-center text-xs font-bold text-muted-foreground/50 mt-12 uppercase tracking-wider">AddSpot v1.0.0</p>
    </div>
  )
}
