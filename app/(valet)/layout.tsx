'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { ValetBottomNav } from '@/components/valet-bottom-nav'

const roleRedirects: Record<string, string> = {
  admin: '/admin/dashboard',
  cashier: '/cashier/queue',
  valet: '/valet/home',
  runner: '/runner/home',
  keyholder: '/keyholder/board',
}

export default function ValetLayout({
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
    } else if (currentUser.role !== 'valet') {
      router.push(roleRedirects[currentUser.role] || '/login')
    } else {
      setIsAuthorized(true)
    }
  }, [currentUser, router])

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#E8F0FE]">
      {/* Dynamic Glassmorphism Background */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA]" />
      
      {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1] pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[80px] mix-blend-multiply opacity-80" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-cyan-400/10 blur-[80px] mix-blend-multiply opacity-80" />
      </div>

      <ValetBottomNav />
      <main className="pt-20 pb-24 max-w-md mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
