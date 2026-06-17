'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Rocket, ShieldCheck, UserCircle, ChevronRight, Lock, Sparkles } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useAuth } from '@/lib/store'

const demoCredentials = [
  { role: 'admin',     label: 'Administrador', email: 'admin@addspot.com',    icon: '👑', redirect: '/admin/dashboard', color: 'text-primary bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 shadow-[0_8px_16px_rgba(91,127,255,0.1)]' },
  { role: 'cashier',   label: 'Cajero',        email: 'cashier@addspot.com',  icon: '💳', redirect: '/cashier/queue', color: 'text-secondary bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20 shadow-[0_8px_16px_rgba(97,192,191,0.1)]' },
  { role: 'valet',     label: 'Valet',         email: 'valet@addspot.com',    icon: '🚗', redirect: '/valet/home', color: 'text-accent-foreground bg-gradient-to-br from-accent-foreground/20 to-accent-foreground/5 border-accent-foreground/20 shadow-[0_8px_16px_rgba(67,56,202,0.1)]' },
  { role: 'runner',    label: 'Rampero',       email: 'runner@addspot.com',   icon: '⚡', redirect: '/runner/home', color: 'text-warning bg-gradient-to-br from-warning/20 to-warning/5 border-warning/20 shadow-[0_8px_16px_rgba(245,158,11,0.1)]' },
  { role: 'keyholder', label: 'Llavero',       email: 'keyholder@addspot.com',icon: '🗝️', redirect: '/keyholder/board', color: 'text-cyan bg-gradient-to-br from-cyan/20 to-cyan/5 border-cyan/20 shadow-[0_8px_16px_rgba(6,182,212,0.1)]' },
]

const roleRedirects: Record<string, string> = {
  'admin@addspot.com':     '/admin/dashboard',
  'cashier@addspot.com':   '/cashier/queue',
  'valet@addspot.com':     '/valet/home',
  'runner@addspot.com':    '/runner/home',
  'keyholder@addspot.com': '/keyholder/board',
}

export default function LoginPage() {
  const router = useRouter()
  const { currentUser, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Toggle between simple profile slider and manual credentials
  const [loginMode, setLoginMode] = useState<'profiles' | 'credentials'>('profiles')

  useEffect(() => {
    if (currentUser) {
      const cred = demoCredentials.find(c => c.role === currentUser.role)
      if (cred) {
        router.push(cred.redirect)
      }
    }
  }, [currentUser, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const foundCred = demoCredentials.find(c => c.email === email)
    if (foundCred) {
      login(foundCred.role as any)
      router.push(foundCred.redirect)
    } else {
      const redirect = roleRedirects[email] ?? '/admin/dashboard'
      login('admin')
      router.push(redirect)
    }
  }

  const handleQuickLogin = (role: string, redirect: string) => {
    login(role as any)
    router.push(redirect)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      {/* Dynamic Glassmorphism Background (Fixed to cover entire screen) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA] pointer-events-none" />
      <div className="fixed inset-0 z-[-1] opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5B7FFF 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Decorative Floating Blobs for Glass effect */}
      <div className="fixed top-[-5%] left-[-10%] w-[600px] h-[600px] bg-primary/25 rounded-full mix-blend-multiply blur-[80px] opacity-80 animate-in fade-in duration-1000 z-[-1]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan/20 rounded-full mix-blend-multiply blur-[80px] opacity-80 animate-in fade-in duration-1000 z-[-1]" style={{ animationDelay: '500ms' }} />

      <div className="w-full max-w-[440px] mx-auto px-5 relative z-10 py-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* High Contrast Logo Card (Dark Gradient) */}
        <div className="w-full relative px-10 py-10 rounded-[2.5rem] flex flex-col items-center justify-center mb-8 shadow-[0_20px_40px_rgba(30,41,59,0.3),inset_0_2px_10px_rgba(255,255,255,0.2)] border border-white/10 overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 pointer-events-none"></div>
          
          <Logo size="lg" />
        </div>

        {/* Main Login Interface - Glassmorphism */}
        <div className="w-full p-2 sm:p-3 rounded-[3rem] bg-white/40 backdrop-blur-3xl shadow-[0_30px_60px_rgba(91,127,255,0.1),inset_0_2px_10px_rgba(255,255,255,1)] border border-white/60 relative">
          
          <div className="p-6 pb-2 text-center relative z-10">
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight mb-2 drop-shadow-sm">¡Hola! 👋</h1>
            <p className="text-muted-foreground text-sm font-medium">Inicia sesión para comenzar tu turno.</p>
          </div>

          {/* Seamless Mode Toggle */}
          <div className="flex bg-black/5 p-1.5 rounded-full mx-5 mt-4 mb-6 relative shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)] border border-white/40 backdrop-blur-md">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white/90 backdrop-blur-md rounded-full shadow-[0_2px_8px_rgba(91,127,255,0.2)] transition-transform duration-400 ease-out border border-white/60 ${loginMode === 'credentials' ? 'translate-x-full' : 'translate-x-0'}`}
            />
            <button 
              onClick={() => setLoginMode('profiles')}
              className={`flex-1 relative z-10 rounded-full py-3 text-sm font-bold transition-colors duration-300 ${loginMode === 'profiles' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Elegir Perfil
            </button>
            <button 
              onClick={() => setLoginMode('credentials')}
              className={`flex-1 relative z-10 rounded-full py-3 text-sm font-bold transition-colors duration-300 ${loginMode === 'credentials' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Credenciales
            </button>
          </div>

          <div className="px-5 pb-6 relative min-h-[320px] overflow-hidden">
            {/* PROFILES MODE: Horizontal Slider */}
            <div className={`transition-all duration-500 absolute w-full left-0 px-5 ${loginMode === 'profiles' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-12 pointer-events-none -z-10'}`}>
              <div className="flex overflow-x-auto pb-8 pt-4 -mx-2 px-2 gap-4 snap-x snap-mandatory custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.role}
                    onClick={(e) => { e.preventDefault(); handleQuickLogin(cred.role, cred.redirect); }}
                    className={`w-[150px] aspect-[4/5] p-5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 snap-center shrink-0 cursor-pointer text-center transition-all duration-300 active:scale-95 hover:-translate-y-2 border border-white/60 backdrop-blur-xl ${cred.color}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),0_5px_15px_rgba(0,0,0,0.05)] bg-white/50 border border-white/80`}>
                      {cred.icon}
                    </div>
                    <div>
                      <span className="font-bold text-foreground text-lg block drop-shadow-sm">{cred.label}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 block mt-1">{cred.role}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/70 animate-pulse -mt-2">
                <span>Desliza para explorar</span> <ChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* CREDENTIALS MODE: Traditional Form */}
            <div className={`transition-all duration-500 absolute w-full left-0 px-5 ${loginMode === 'credentials' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-12 pointer-events-none -z-10'}`}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-foreground/90 font-bold ml-2 text-sm flex items-center gap-1.5 drop-shadow-sm">
                    <UserCircle className="w-4 h-4 text-primary" /> Correo Electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="ej. admin@addspot.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 px-5 rounded-[1.5rem] text-base placeholder:text-muted-foreground/50 font-medium bg-white/60 backdrop-blur-md border border-white/60 shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-2">
                    <label htmlFor="password" className="text-foreground/90 font-bold text-sm flex items-center gap-1.5 drop-shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-primary" /> Contraseña
                    </label>
                    <button type="button" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors drop-shadow-sm">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 px-5 pr-12 rounded-[1.5rem] text-base placeholder:text-muted-foreground/50 font-medium tracking-wide bg-white/60 backdrop-blur-md border border-white/60 shadow-[inset_0_2px_5px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-primary/40 focus:border-primary/50 outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-white/80 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full h-14 rounded-[1.5rem] flex items-center justify-center text-lg mt-8 gap-2 bg-gradient-to-r from-primary to-[#4338CA] text-white font-bold shadow-[0_10px_25px_rgba(91,127,255,0.4),inset_0_2px_5px_rgba(255,255,255,0.3)] hover:brightness-110 active:scale-95 transition-all">
                  Iniciar Sesión <Lock className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Registration Link & Demo */}
        <div className="mt-8 px-6 py-4 rounded-[2rem] sm:rounded-full bg-white/40 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-3 sm:gap-2 shadow-[0_8px_20px_rgba(91,127,255,0.05),inset_0_1px_4px_rgba(255,255,255,0.6)] border border-white/50 relative z-20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">¿Tu empresa no está registrada?</span>
            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-bold flex items-center gap-1.5 drop-shadow-sm">
              Regístrala aquí <span className="text-base">🏢</span>
            </Link>
          </div>
          <div className="w-full h-px bg-black/10 sm:hidden"></div>
          <div className="hidden sm:block w-px h-5 bg-black/10 mx-2"></div>
          <Link href="/onboarding" className="text-warning hover:text-warning/80 transition-colors font-bold flex items-center gap-1.5 drop-shadow-sm text-sm bg-warning/10 px-3 py-1.5 rounded-full">
            <Sparkles className="h-4 w-4" /> Ver Demo Onboarding
          </Link>
        </div>

      </div>
    </div>
  )
}

