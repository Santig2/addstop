'use client'

import { useState } from 'react'
import { Car, Clock, DollarSign, TrendingUp } from 'lucide-react'
import { AdminHeader } from '@/components/admin-header'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { roleLabels, roleColors } from '@/lib/mock-data'
import { useStaff } from '@/lib/store'
import type { StaffMember } from '@/lib/store'

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  available:   { bg: 'bg-success/20', text: 'text-success',          label: 'Disponible'  },
  in_transit:  { bg: 'bg-cyan/20',    text: 'text-cyan',             label: 'En tránsito' },
  off_duty:    { bg: 'bg-muted',      text: 'text-muted-foreground', label: 'Inactivo'  },
}

type FilterRole = 'all' | StaffMember['role']

const filterTabs: { value: FilterRole; label: string }[] = [
  { value: 'all',       label: 'Todos'    },
  { value: 'cashier',   label: 'Cajeros'  },
  { value: 'valet',     label: 'Valets'   },
  { value: 'runner',    label: 'Ramperos' },
  { value: 'keyholder', label: 'Llaveros' },
]

export default function TeamPage() {
  const { staff } = useStaff()
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null)
  const [filter, setFilter] = useState<FilterRole>('all')

  const filtered = filter === 'all' ? staff : staff.filter((v) => v.role === filter)

  return (
    <div>
      <AdminHeader title="Team" breadcrumb={['Admin', 'Team']} />

      {/* Role filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'clay-btn-primary'
                : 'clay-input hover:brightness-95'
            }`}
          >
            {tab.label}
            <span className="ml-2 font-mono text-xs opacity-70">
              {tab.value === 'all'
                ? staff.length
                : staff.filter((v) => v.role === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((member) => {
          const status = statusColors[member.status] || statusColors.off_duty
          const rc = roleColors[member.role] || { bg: 'bg-muted', text: 'text-muted-foreground' }
          const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          
          return (
            <div
              key={member.id}
              className="clay-card cursor-pointer hover:-translate-y-1 transition-transform duration-300"
              onClick={() => setSelectedMember(member)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[1.2rem] ${rc.bg} flex items-center justify-center text-xl font-bold font-serif ${rc.text} shadow-inner`}>
                    {initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-lg font-serif text-foreground">{member.name}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${rc.bg} ${rc.text}`}>
                        {roleLabels[member.role] || member.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {member.carsToday} autos hoy {member.activeTickets > 0 ? `· ${member.activeTickets} activos ahora` : ''}
                    </p>
                  </div>
                  {(member.role === 'valet' || member.role === 'runner') && (
                    <div className="text-right hidden sm:block p-3 clay-input rounded-2xl">
                      <p className="font-mono text-xl font-bold text-success">${member.tipsToday}</p>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Propinas hoy</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Member Details Sheet */}
      <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <SheetContent className="bg-card border-border">
          <SheetHeader>
            <SheetTitle className="font-serif">Detalle del Personal</SheetTitle>
          </SheetHeader>
          {selectedMember && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${roleColors[selectedMember.role]?.bg || 'bg-muted'} flex items-center justify-center text-2xl font-medium ${roleColors[selectedMember.role]?.text || 'text-muted-foreground'}`}>
                  {selectedMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold">{selectedMember.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[selectedMember.role]?.bg || 'bg-muted'} ${roleColors[selectedMember.role]?.text || 'text-muted-foreground'}`}>
                      {roleLabels[selectedMember.role] || selectedMember.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedMember.status]?.bg || statusColors.off_duty.bg} ${statusColors[selectedMember.status]?.text || statusColors.off_duty.text}`}>
                      {statusColors[selectedMember.status]?.label || 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Car className="h-4 w-4" />
                    <span className="text-sm">Autos Procesados</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{selectedMember.carsToday}</p>
                  <p className="text-xs text-muted-foreground">Hoy</p>
                </div>
                {(selectedMember.role === 'valet') && (
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Total Propinas</span>
                    </div>
                    <p className="text-2xl font-bold font-mono text-success">${selectedMember.tipsToday}</p>
                    <p className="text-xs text-muted-foreground">Hoy</p>
                  </div>
                )}
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Tickets Activos</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{selectedMember.activeTickets}</p>
                  <p className="text-xs text-muted-foreground">Ahora mismo</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Contacto</span>
                  </div>
                  <p className="text-sm font-medium">{selectedMember.contact || 'No registrado'}</p>
                </div>
              </div>

              <Button variant="destructive" className="w-full h-11">
                Suspender Acceso
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
