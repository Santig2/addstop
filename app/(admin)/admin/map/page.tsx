'use client'

import { MapPin, Navigation } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'
import { activeTickets } from '@/lib/mock-data'

export default function MapPage() {
  return (
    <div>
      <AdminHeader title="Live Map" breadcrumb={['Admin', 'Live Map']} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 clay-card flex flex-col p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-foreground">Real-time Vehicle Tracking</h2>
          </div>
          <div>
            <div className="h-[500px] clay-input rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Soft grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--border)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none"></div>
              <div className="text-center relative z-10">
                <div className="p-5 rounded-full bg-primary/10 mx-auto w-24 h-24 flex items-center justify-center mb-4">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <p className="font-bold font-serif text-2xl text-foreground">Interactive Map</p>
                <p className="text-sm font-medium text-muted-foreground max-w-sm mx-auto mt-2">
                  Track all active vehicles and valet movements in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="clay-card flex flex-col p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold font-serif text-foreground">Active Vehicles</h2>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[550px] custom-scrollbar pr-2">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 clay-input rounded-2xl hover:brightness-95 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold">{ticket.plate}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'requested'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-success/20 text-success'
                    }`}
                  >
                    {ticket.status === 'requested' ? 'Requested' : 'Parked'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ticket.brand} {ticket.model}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  <span>Spot {ticket.spot}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
