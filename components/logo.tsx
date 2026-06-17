'use client'

import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 32,
    md: 48,
    lg: 100,
    xl: 140,
  }

  const textClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  }

  const containerClasses = size === 'lg' || size === 'xl' 
    ? "flex flex-col items-center gap-4 z-10 relative" 
    : "flex items-center gap-4 z-10 relative"

  return (
    <div className={containerClasses}>
      <div className="relative group hover:scale-105 transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 group-hover:opacity-80 transition-opacity rounded-full"></div>
        <Image
          src="/addstrategic icon.png"
          alt="AddStrategic Logo"
          width={sizeClasses[size]}
          height={sizeClasses[size]}
          className="relative z-10 drop-shadow-2xl object-contain"
        />
      </div>
      {showText && (
        <span className={`font-serif font-bold tracking-wide ${textClasses[size]}`}>
          <span style={{ color: '#61c0bf' }}>ADD</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">SPOT</span>
        </span>
      )}
    </div>
  )
}
