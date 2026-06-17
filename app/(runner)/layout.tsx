'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { RunnerBottomNav } from '@/components/runner-bottom-nav'

const roleRedirects: Record<string, string> = {
  admin: '/admin/dashboard',
  cashier: '/cashier/queue',
  valet: '/valet/home',
  runner: '/runner/home',
  keyholder: '/keyholder/board',
}

export default function RunnerLayout({
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
    } else if (currentUser.role !== 'runner') {
      router.push(roleRedirects[currentUser.role] || '/login')
    } else {
      setIsAuthorized(true)
    }
  }, [currentUser, router])

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-cyan-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5B7FFF 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Decorative Blur Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed bottom-20 right-[-10%] w-[250px] h-[250px] bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
      
      <RunnerBottomNav />
      <main className="pb-24 pt-20 px-4 max-w-md mx-auto relative z-10">
        {children}
      </main>
    </div>
  )
}
