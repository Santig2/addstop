'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { carBrands, carColors } from '@/lib/mock-data'
import { useTickets, useAuth } from '@/lib/store'

const steps = ['Auto', 'Fotos', 'Contacto', 'Confirmar']

function CheckinForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  
  const { tickets, updateTicket, createTicket } = useTickets()
  const { currentUser } = useAuth()
  const ticket = tickets.find(t => t.id === ticketId)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    phone: '',
    sendWalletPass: true,
  })
  
  useEffect(() => {
    if (ticket) {
      setFormData(prev => ({
        ...prev,
        plate: ticket.vehiclePlate || prev.plate,
        phone: ticket.clientPhone || prev.phone,
      }))
    }
  }, [ticket])

  const [photos, setPhotos] = useState<string[]>([])
  const [brandSearch, setBrandSearch] = useState('')
  const [showBrands, setShowBrands] = useState(false)

  const selectedBrand = carBrands.find((b) => b.id === formData.brand)
  const filteredBrands = carBrands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      const vehicleMake = selectedBrand?.name || formData.brand
      const vehicleColor = carColors.find(c => c.id === formData.color)?.name || formData.color

      if (ticketId) {
        // Update existing ticket
        updateTicket(ticketId, {
          vehicleMake,
          vehicleModel: formData.model,
          vehicleColor,
          vehiclePlate: formData.plate,
          clientPhone: formData.phone,
          photos,
          status: 'in_transit'
        })
        router.push(`/valet/tracking?ticketId=${ticketId}`)
      } else {
        // Create new ticket from scratch (valet doing manual check-in)
        const newId = Date.now().toString()
        createTicket({
          id: newId,
          vehicleMake,
          vehicleModel: formData.model,
          vehicleColor,
          vehiclePlate: formData.plate,
          vehicleYear: formData.year,
          clientPhone: formData.phone,
          clientName: '',
          serviceType: 'regular',
          status: 'in_transit',
          assignedValetId: currentUser?.id || null,
          photos,
          spotId: null,
          hookId: null,
          keyBoardId: null,
          assignedBy: null,
          keyReceivedBy: null,
          keyReleasedTo: null,
          gpsTrackOut: [],
          gpsTrackReturn: [],
          tipAmount: null,
          paymentAmount: null,
          paymentMethod: null,
          parkedAt: null,
          keysReceivedAt: null,
          completedAt: null,
          requestedAt: null,
          deliveredAt: null,
          isHighVolume: false,
        })
        router.push(`/valet/tracking?ticketId=${newId}`)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleBack} className="w-10 h-10 rounded-full clay-input flex items-center justify-center text-muted-foreground hover:text-foreground transition-transform active:scale-95">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-foreground drop-shadow-sm">Nuevo Check-in</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNum = index + 1
            const isCompleted = stepNum < currentStep
            const isCurrent = stepNum === currentStep

            return (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? 'bg-success text-white'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-surface border border-border text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 ${
                      stepNum < currentStep ? 'bg-success' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="clay-card p-5 mt-6">
        {/* Step 1: Vehicle Info */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label>Marca</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar marca..."
                  value={brandSearch}
                  onChange={(e) => {
                    setBrandSearch(e.target.value)
                    setShowBrands(true)
                  }}
                  onFocus={() => setShowBrands(true)}
                  className="h-14 clay-input pl-10 focus-visible:ring-0"
                />
                {formData.brand && (
                  <button
                    onClick={() => {
                      setFormData({ ...formData, brand: '', model: '' })
                      setBrandSearch('')
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showBrands && !formData.brand && (
                <div className="clay-input rounded-xl overflow-hidden max-h-48 overflow-y-auto mt-2">
                  {filteredBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setFormData({ ...formData, brand: brand.id })
                        setBrandSearch(brand.name)
                        setShowBrands(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors font-medium text-foreground"
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedBrand && (
              <div className="space-y-2">
                <Label>Modelo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedBrand.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setFormData({ ...formData, model })}
                      className={`p-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                        formData.model === model
                          ? 'clay-btn-primary'
                          : 'clay-input text-muted-foreground hover:text-foreground hover:-translate-y-0.5'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-white/90">Color del Vehículo</Label>
              <div className="flex flex-wrap gap-3">
                {carColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setFormData({ ...formData, color: color.id })}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${
                      formData.color === color.id
                        ? 'border-primary scale-110 ring-4 ring-primary/20'
                        : 'border-white/10 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">Placa</Label>
              <div className="flex gap-2">
                <Input
                  id="plate"
                  placeholder="ABC-1234"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                  className="h-16 clay-input font-mono text-3xl font-bold text-center uppercase tracking-wider flex-1 focus-visible:ring-0"
                />
                <Button 
                  type="button"
                  className="w-16 h-16 clay-btn-secondary p-0 flex items-center justify-center relative overflow-hidden shrink-0"
                  title="Escanear Placa"
                >
                  <Camera className="h-6 w-6 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, plate: 'SCN-8899' })
                      }
                    }}
                  />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Toma fotos del vehículo desde todos los ángulos
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Frontal', 'Trasera', 'Izquierda', 'Derecha'].map((label, index) => (
                <div key={label} className="relative aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors overflow-hidden">
                  <div className={`absolute inset-0 flex flex-col items-center justify-center transition-colors ${
                    photos[index] ? 'bg-success/20 border-success' : 'bg-surface border-border hover:border-primary'
                  }`}>
                    {photos[index] ? (
                      <>
                        <img src={photos[index]} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <Check className="h-8 w-8 text-success mb-2 relative z-10" />
                        <span className="text-sm text-white font-medium relative z-10 drop-shadow-md">{label}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">{label}</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader()
                        reader.onload = (evt) => {
                          const newPhotos = [...photos]
                          newPhotos[index] = evt.target?.result as string
                          setPhotos(newPhotos)
                        }
                        reader.readAsDataURL(e.target.files[0])
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(photos.filter(Boolean).length / 4) * 100}%` }}
                />
              </div>
              <span className="text-sm font-mono">{photos.filter(Boolean).length}/4</span>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono del cliente</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (305) 555-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-14 clay-input focus-visible:ring-0"
              />
            </div>

            <div className="clay-input p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Enviar Wallet Pass por SMS</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  El cliente recibirá un ticket digital
                </p>
              </div>
              <div
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                  formData.sendWalletPass ? 'bg-primary' : 'bg-white/20'
                }`}
                onClick={() =>
                  setFormData({ ...formData, sendWalletPass: !formData.sendWalletPass })
                }
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.sendWalletPass ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="clay-input p-4 rounded-2xl flex gap-4 items-center">
              <div className="w-20 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                <Camera className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground drop-shadow-sm">
                  {selectedBrand?.name} {formData.model}
                </p>
                <p className="font-mono text-xl font-bold text-primary drop-shadow-sm">{formData.plate || '—'}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{formData.phone}</p>
              </div>
            </div>

            <p className="text-sm font-bold text-muted-foreground text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              Al confirmar, se enviará el Wallet Pass al cliente
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            className={`w-full h-16 font-bold text-lg uppercase tracking-wider transition-all ${
              currentStep === 4
                ? 'clay-btn-primary !bg-success !text-white'
                : 'clay-btn-primary'
            }`}
            disabled={
              (currentStep === 1 && (!formData.brand || !formData.model || !formData.plate)) ||
              false
            }
          >
            {currentStep === 4 ? (
              <><Check className="w-6 h-6 mr-2" /> Confirmar</>
            ) : (
              <>
                Siguiente <ChevronRight className="h-6 w-6 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Cargando check-in...</div>}>
      <CheckinForm />
    </Suspense>
  )
}
