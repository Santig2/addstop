'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TrackingFlow } from '@/components/shared/tracking-flow'

function TrackingContent() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  return <TrackingFlow ticketId={ticketId} nextRoute="/valet/spot-select" />
}

export default function ValetTrackingPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando mapa...</div>}>
      <TrackingContent />
    </Suspense>
  )
}
