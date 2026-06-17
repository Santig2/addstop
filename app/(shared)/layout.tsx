'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SharedLayout({
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
    } else {
      setIsAuthorized(true)
    }
  }, [currentUser, router])

  if (!isAuthorized) return null

  return (
    <div className="min-h-screen bg-transparent">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-serif font-bold text-xl">Ajustes de App</h1>
      </div>
      <main className="pb-24 lg:p-8">
        {children}
      </main>
    </div>
  )
}
