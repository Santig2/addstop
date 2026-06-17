'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Home, Key, MapPin, User } from 'lucide-react'

const navItems = [
  { href: '/runner/home',         label: 'Home',     icon: Home   },
  { href: '/runner/quick-checkin',label: 'Check-in', icon: Camera },
  { href: '/runner/tracking',     label: 'GPS',      icon: MapPin },
  { href: '/runner/deliver-keys', label: 'Llaves',   icon: Key    },
  { href: '/runner/profile',      label: 'Perfil',   icon: User   },
]

import { Logo } from '@/components/logo'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'

export function RunnerBottomNav() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()
  const router = useRouter()

  return (
    <>
      {/* Mobile Top Bar (Logo & Profile) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-3xl border-b border-white/40 px-5 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(91,127,255,0.05)] rounded-b-[2rem]">
        <div className="flex items-center">
          <Logo size="sm" showText={false} />
          <span className="font-serif font-bold text-lg tracking-tight ml-2 flex-1 drop-shadow-sm">
            <span style={{ color: '#61c0bf' }}>ADD</span>
            <span className="text-foreground">SPOT</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/runner/profile" className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-inner hover:scale-105 transition-transform">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'RU'}
          </Link>
          <button onClick={() => { logout(); router.push('/login'); }} className="p-2 text-muted-foreground hover:text-destructive active:scale-95 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Floating Island with Glassmorphism) */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#1E293B]/90 backdrop-blur-3xl border border-white/20 px-2 py-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(15,23,42,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-around max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          // Hide profile link from bottom nav since it's now in the top bar
          if (item.href === '/runner/profile') return null

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
