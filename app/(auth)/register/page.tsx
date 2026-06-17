'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'
import { ChevronRight, ChevronLeft, CheckCircle2, Car, Users, LayoutDashboard, Ticket } from 'lucide-react'

// Dummy form data types
interface OnboardingData {
  companyName: string
  dailyVolume: string
  teamSize: number
  roles: string[]
  logoUploaded: boolean
}

const steps = [
  { id: 1, title: 'Bienvenida', icon: <Car className="w-5 h-5" /> },
  { id: 2, title: 'Volumen', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 3, title: 'Equipo', icon: <Users className="w-5 h-5" /> },
  { id: 4, title: 'Módulos', icon: <CheckCircle2 className="w-5 h-5" /> },
  { id: 5, title: 'Ticket', icon: <Ticket className="w-5 h-5" /> },
]

export default function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    dailyVolume: '',
    teamSize: 5,
    roles: ['valet', 'cashier'],
    logoUploaded: false,
  })

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(c => c + 1)
    else {
      // Finish onboarding
      alert('¡Configuración guardada! Bienvenido a AddStop.')
      router.push('/admin/dashboard')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1)
  }

  const toggleRole = (role: string) => {
    setData(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12 flex flex-col gap-6 relative z-50 px-4 md:px-0 mt-4 md:mt-8">
      
      {/* Header */}
      <div className="flex flex-col items-center relative z-20">
        <Logo size="lg" />
        <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-primary/10 shadow-sm text-xs font-bold flex items-center gap-2 text-primary">
          Paso {currentStep} de 5
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative z-20">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Wizard Card */}
      <div className="clay-card p-6 md:p-8 w-full relative z-20 min-h-[350px] flex flex-col justify-between">
        
        {/* Step 1: Company Name */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">¡Bienvenido! 👋</h2>
              <p className="text-sm text-muted-foreground font-medium">¿Cuál es el nombre comercial de tu valet o estacionamiento?</p>
            </div>
            <input
              type="text"
              placeholder="Ej. Valet Premium Parking"
              value={data.companyName}
              onChange={e => setData({...data, companyName: e.target.value})}
              className="clay-input w-full h-14 px-4 text-base font-semibold text-center mt-4"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Volume */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Capacidad 🚗</h2>
              <p className="text-sm text-muted-foreground font-medium">¿Aproximadamente cuántos vehículos gestionas al día?</p>
            </div>
            <div className="grid gap-3 mt-4">
              {['Menos de 50', 'De 50 a 200', 'Más de 200'].map(vol => (
                <button
                  key={vol}
                  onClick={() => { setData({...data, dailyVolume: vol}); nextStep(); }}
                  className={`clay-btn-secondary h-12 text-sm ${data.dailyVolume === vol ? 'ring-2 ring-primary bg-primary/5 text-primary' : ''}`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Team Size */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Tu Equipo 👥</h2>
              <p className="text-sm text-muted-foreground font-medium">¿Cuántas personas conforman tu equipo operativo por turno?</p>
            </div>
            <div className="flex flex-col items-center gap-6 mt-6">
              <span className="text-5xl font-bold text-primary">{data.teamSize}</span>
              <input
                type="range"
                min="1"
                max="50"
                value={data.teamSize}
                onChange={e => setData({...data, teamSize: parseInt(e.target.value)})}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* Step 4: Modules */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Módulos ⚙️</h2>
              <p className="text-sm text-muted-foreground font-medium">¿Qué roles necesitas activar para tu operación?</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { id: 'valet', label: 'Valet', icon: '🚗' },
                { id: 'cashier', label: 'Cajero', icon: '💳' },
                { id: 'keyholder', label: 'Llavero', icon: '🗝️' },
                { id: 'runner', label: 'Rampero', icon: '⚡' },
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={`clay-btn-secondary p-4 flex flex-col items-center gap-2 h-auto ${data.roles.includes(role.id) ? 'ring-2 ring-primary bg-primary/5' : 'opacity-60'}`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span className="text-xs font-bold text-foreground">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Ticket */}
        {currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Tu Marca 🎨</h2>
              <p className="text-sm text-muted-foreground font-medium">Sube tu logo para personalizar el ticket digital de tus clientes.</p>
            </div>
            
            <button 
              onClick={() => setData({...data, logoUploaded: true})}
              className={`w-full h-32 mt-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all duration-200 ${data.logoUploaded ? 'border-success bg-success/10 text-success' : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'}`}
            >
              {data.logoUploaded ? (
                <>
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="font-bold text-sm">¡Logo listo!</span>
                </>
              ) : (
                <>
                  <Ticket className="w-8 h-8 opacity-50" />
                  <span className="font-bold text-sm">Tocar para subir logo</span>
                  <span className="text-xs opacity-60">PNG, JPG hasta 2MB</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-muted">
          {currentStep > 1 && (
            <button 
              onClick={prevStep}
              className="clay-btn-secondary h-12 px-4 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          {currentStep !== 2 && (
            <button 
              onClick={nextStep}
              disabled={currentStep === 1 && !data.companyName.trim()}
              className="clay-btn-primary h-12 flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 5 ? '¡Comenzar a operar!' : 'Siguiente'}
              {currentStep !== 5 && <ChevronRight className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-sm font-medium text-muted-foreground relative z-20">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-bold inline-flex items-center gap-1">
          Inicia sesión
        </Link>
      </p>

    </div>
  )
}
