'use client'

import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { OperationModeToggle } from '@/components/shared/operation-mode-toggle'

interface AdminHeaderProps {
  title: string
  breadcrumb?: string[]
}

export function AdminHeader({ title, breadcrumb }: AdminHeaderProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {item}
                {index < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-serif text-2xl lg:text-3xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-6 text-right">
        <OperationModeToggle />
        <div className="hidden sm:block">
          <p className="text-sm text-muted-foreground">Current Time</p>
          <p className="font-mono text-lg">{time}</p>
        </div>
      </div>
    </div>
  )
}
