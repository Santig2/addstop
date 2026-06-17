'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Key, User } from 'lucide-react'
import { Logo } from '@/components/logo'
import { keyDeliveryNotifications } from '@/lib/mock-data'

const navItems = [
  { href: '/keyholder/board', label: 'Tablero', icon: Key          },
  { href: '/keyholder/audit', label: 'Auditoría',icon: ClipboardList },
]

export function KeyholderHeader() {
  const pathname = usePathname()
  const [time, setTime] = useState('')
  const pendingCount = keyDeliveryNotifications.filter((n) => n.status === 'pending').length

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {/* Mobile Top Bar (Logo & Profile) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-3xl border-b border-white/40 px-5 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(91,127,255,0.05)] rounded-b-[2rem]">
        <div className="flex items-center">
          <Logo size="sm" showText={false} />
          <span className="font-serif font-bold text-lg tracking-tight ml-2 flex-1 drop-shadow-sm">
            <span style={{ color: '#61c0bf' }}>ADD</span>
            <span className="text-foreground">SPOT</span>
            <span className="text-[10px] ml-2 text-muted-foreground uppercase tracking-wider hidden sm:inline">Llavero</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-foreground drop-shadow-sm hidden sm:block bg-white/40 px-3 py-1 rounded-xl">{time}</span>
          <Link href="/keyholder/profile" className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-inner hover:scale-105 transition-transform">
            <User className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Floating Island) */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#1E293B]/90 backdrop-blur-3xl border border-white/20 px-4 py-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(15,23,42,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-8 max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 p-2 transition-all duration-300 active:scale-95 ${
                isActive 
                  ? 'text-white scale-110' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-[1.2rem] transition-all ${isActive ? 'bg-primary/30 shadow-[inset_0_1px_5px_rgba(255,255,255,0.3)] border border-white/10' : ''}`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
              
              {item.href === '/keyholder/board' && pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg border border-white animate-bounce">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </>
  )
}
