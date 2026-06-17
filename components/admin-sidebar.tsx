'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Key,
  LayoutDashboard,
  Map,
  Menu,
  Settings,
  Users,
  X,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/map', label: 'Live Map', icon: Map },
  { href: '/admin/keyboard', label: 'Key Board', icon: Key },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <Logo size="sm" />
        <div className="mt-4">
          <p className="font-medium text-sm">Valet Luxe Miami</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary mt-1">
            Pro
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate uppercase">{currentUser?.role || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              if (onClose) onClose()
              router.push('/login')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex w-60 flex-col bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-30">
      <SidebarContent />
    </aside>
  )
}

export function AdminMobileNav() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()
  const router = useRouter()

  return (
    <>
      {/* Mobile Top Bar (Logo & Profile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-3xl border-b border-white/40 px-5 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(91,127,255,0.05)] rounded-b-[2rem]">
        <Logo size="sm" showText={false} />
        <span className="font-serif font-bold text-lg tracking-tight ml-2 flex-1">
          <span style={{ color: '#61c0bf' }}>ADD</span>
          <span className="text-foreground">SPOT</span>
        </span>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shadow-inner">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <button onClick={() => { logout(); router.push('/login'); }} className="p-2 text-muted-foreground hover:text-destructive active:scale-95 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Floating Island with Glassmorphism) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 bg-[#1E293B]/80 backdrop-blur-3xl border border-white/20 px-2 py-3 rounded-[2.5rem] shadow-[0_20px_40px_rgba(15,23,42,0.4),inset_0_2px_10px_rgba(255,255,255,0.1)] flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
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
