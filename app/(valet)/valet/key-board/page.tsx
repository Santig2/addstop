'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { KeyHandoffFlow } from '@/components/shared/key-handoff-flow'

function KeyHandoffContent() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  return <KeyHandoffFlow ticketId={ticketId} homeRoute="/valet/home" role="valet" />
}

export default function ValetKeyHandoffPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
      <KeyHandoffContent />
    </Suspense>
  )
}
