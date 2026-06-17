'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { AdminSidebar, AdminMobileNav } from '@/components/admin-sidebar'

const roleRedirects: Record<string, string> = {
  admin: '/admin/dashboard',
  cashier: '/cashier/queue',
  valet: '/valet/home',
  runner: '/runner/home',
  keyholder: '/keyholder/board',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
    } else if (currentUser.role !== 'admin') {
      router.push(roleRedirects[currentUser.role] || '/login')
    } else {
      setIsAuthorized(true)
    }
  }, [currentUser, router])

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#E8F0FE]">
      {/* Dynamic Glassmorphism Background (Fixed to cover entire screen) */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA] pointer-events-none" />
      <div className="fixed inset-0 z-[-1] opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5B7FFF 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Decorative Floating Blobs for Glass effect */}
      <div className="fixed top-[-5%] left-[-10%] w-[600px] h-[600px] bg-primary/25 rounded-full mix-blend-multiply blur-[80px] opacity-80 animate-in fade-in duration-1000 z-[-1]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan/20 rounded-full mix-blend-multiply blur-[80px] opacity-80 animate-in fade-in duration-1000 z-[-1]" style={{ animationDelay: '500ms' }} />

      <AdminSidebar />
      <AdminMobileNav />
      <main className="lg:pl-60 pb-24 lg:pb-0 pt-20 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
