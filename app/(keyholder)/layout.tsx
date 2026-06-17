'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { KeyholderHeader } from '@/components/keyholder-header'

const roleRedirects: Record<string, string> = {
  admin: '/admin/dashboard',
  cashier: '/cashier/queue',
  valet: '/valet/home',
  runner: '/runner/home',
  keyholder: '/keyholder/board',
}

export default function KeyholderLayout({
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
    } else if (currentUser.role !== 'keyholder') {
      router.push(roleRedirects[currentUser.role] || '/login')
    } else {
      setIsAuthorized(true)
    }
  }, [currentUser, router])

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#E8F0FE] text-foreground">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/60 via-[#E8F0FE] to-[#D4E2FA]" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#D4E2FA]/50 via-transparent to-transparent" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <KeyholderHeader />
      <main className="pt-20 pb-28 p-4 lg:p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
