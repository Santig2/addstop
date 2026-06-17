'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SpotSelectFlow } from '@/components/shared/spot-select-flow'

function SpotSelectContent() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  return <SpotSelectFlow ticketId={ticketId} nextRoute="/runner/deliver-keys" />
}

export default function RunnerSpotSelectPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando spots...</div>}>
      <SpotSelectContent />
    </Suspense>
  )
}
