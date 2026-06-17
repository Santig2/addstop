'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CreditCard,
  Inbox,
  LayoutGrid,
  Plus,
  Zap,
  User,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useOperation } from '@/lib/store'

const navItems = [
  { href: '/cashier/queue',      label: 'Cola',       icon: LayoutGrid },
  { href: '/cashier/new-ticket', label: 'Nuevo',      icon: Plus       },
  { href: '/cashier/requests',   label: 'Solicitudes',icon: Inbox      },
  { href: '/cashier/payments',   label: 'Cobros',     icon: CreditCard },
]

export function CashierHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout } = useAuth()
  const { highVolumeMode, toggleHighVolume } = useOperation()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_10px_30px_rgba(91,127,255,0.05)] rounded-b-[2rem]">
        {highVolumeMode && (
        <div className="bg-warning/20 border-b border-warning/30 px-4 py-1.5 text-center rounded-t-[2rem]">
          <span className="text-warning text-xs font-medium flex items-center justify-center gap-2">
            <Zap className="h-3 w-3" />
            Modo Alto Volumen activo — Quick Ticket habilitado
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo size="sm" showText={false} />
          <span className="font-serif font-bold text-lg tracking-tight ml-2 flex-1">
            <span style={{ color: '#61c0bf' }}>ADD</span>
            <span className="text-foreground">SPOT</span>
          </span>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'clay-btn-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Clock + User + Logout */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-slate-500 hidden sm:block">{time}</span>
          <div className="hidden lg:flex items-center gap-2 mr-4">
            <Switch
              id="high-volume"
              checked={highVolumeMode}
              onCheckedChange={toggleHighVolume}
            />
            <Label htmlFor="high-volume" className="text-xs font-bold text-muted-foreground cursor-pointer uppercase tracking-wider">
              Alto Volumen
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/cashier/profile" className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-inner hover:scale-105 transition-transform">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'CA'}
            </Link>
            <button onClick={() => { logout(); router.push('/login'); }} className="p-2 text-muted-foreground hover:text-destructive active:scale-95 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Floating Island with Glassmorphism) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-[#1E293B]/90 backdrop-blur-3xl border border-white/20 px-2 py-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(15,23,42,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 ${
                isActive 
                  ? 'text-white scale-110' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-[1.2rem] transition-all ${isActive ? 'bg-primary/30 shadow-[inset_0_1px_5px_rgba(255,255,255,0.3)] border border-white/10' : ''}`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
