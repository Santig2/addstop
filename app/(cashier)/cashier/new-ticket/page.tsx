'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Phone, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTickets, useOperation } from '@/lib/store'

type ServiceType = 'Regular' | 'VIP' | 'Overnight'
type FormMode = 'full' | 'quick'

export default function CashierNewTicketPage() {
  const router = useRouter()
  const { createTicket } = useTickets()
  const { highVolumeMode } = useOperation()
  
  const [mode, setMode] = useState<FormMode>(highVolumeMode ? 'quick' : 'full')
  
  // Sync mode with highVolumeMode
  useEffect(() => {
    setMode(highVolumeMode ? 'quick' : 'full')
  }, [highVolumeMode])
  const [serviceType, setServiceType] = useState<ServiceType>('Regular')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [plate, setPlate] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (!plate) return

    if (mode === 'quick') {
      createTicket({
        clientName: '',
        clientPhone: phone,
        vehiclePlate: plate,
        serviceType: 'regular',
        status: 'WAITING_VALET',
        isHighVolume: true,
      })
    } else {
      createTicket({
        clientName: name,
        clientPhone: phone,
        vehiclePlate: plate,
        serviceType: serviceType.toLowerCase() as 'regular' | 'vip' | 'overnight',
        status: 'WAITING_VALET',
        isHighVolume: false,
      })
    }

    setConfirmed(true)
    setTimeout(() => {
      router.push('/cashier/queue')
    }, 2000)
  }

  if (confirmed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">Ticket creado</h2>
          <p className="text-muted-foreground text-sm">
            Wallet Pass enviado · Ticket en cola
          </p>
        </div>
      </div>
    )
  }

  const serviceTypes: ServiceType[] = ['Regular', 'VIP', 'Overnight']

  const serviceColors: Record<ServiceType, string> = {
    Regular:   'bg-primary text-primary-foreground',
    VIP:       'bg-warning text-warning-foreground',
    Overnight: 'bg-secondary/30 text-secondary',
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold">Nuevo Ticket</h1>
          <p className="text-muted-foreground text-sm">Check-in desde podium</p>
        </div>
        {/* Mode toggle */}
        <div className="clay-input p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setMode('full')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'full' ? 'clay-btn-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Completo
          </button>
          <button
            onClick={() => setMode('quick')}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'quick' ? 'clay-btn-primary !bg-warning' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Zap className="h-3 w-3" />
            Quick
          </button>
        </div>
      </div>

      <div className="clay-card p-6">
        <div className="space-y-6">
          {/* Service type tabs */}
          {mode === 'full' && (
            <div>
              <Label className="mb-2 block">Tipo de servicio</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                {serviceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${
                      serviceType === type
                        ? 'clay-btn-primary'
                        : 'clay-input text-muted-foreground hover:text-foreground hover:-translate-y-0.5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Plate — always shown */}
          <div className="space-y-2">
            <Label htmlFor="plate">Placa *</Label>
            <Input
              id="plate"
              placeholder="ABC-1234"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              className={`clay-input font-mono text-xl font-bold tracking-widest uppercase placeholder:normal-case placeholder:font-sans placeholder:text-base placeholder:font-normal focus-visible:ring-0 ${mode === 'quick' ? 'h-20 text-3xl text-center' : 'h-14'}`}
            />
          </div>

          {/* Full mode extra fields */}
          {mode === 'full' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="customer">Nombre del cliente</Label>
                <Input
                  id="customer"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 clay-input focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <span className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    Teléfono (Wallet Pass)
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (305) 555-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 clay-input focus-visible:ring-0"
                />
              </div>
            </>
          )}

          {/* Quick mode phone */}
          {mode === 'quick' && (
            <div className="space-y-2">
              <Label htmlFor="quick-phone">Teléfono (opcional)</Label>
              <Input
                id="quick-phone"
                type="tel"
                placeholder="+1 (305) 555-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 clay-input text-center focus-visible:ring-0"
              />
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={!plate}
            className="w-full h-14 clay-btn-primary text-lg font-bold uppercase tracking-wider"
          >
            <Check className="h-6 w-6 mr-2" />
            {mode === 'quick' ? 'Quick Ticket' : 'Crear Ticket'}
          </Button>

          {mode === 'full' && phone && (
            <p className="text-sm font-bold text-center text-muted-foreground">
              Se enviará Wallet Pass por SMS a {phone}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
