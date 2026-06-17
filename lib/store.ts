import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Interfaces ---

export type TicketStatus = 'WAITING_VALET' | 'ASSIGNED' | 'IN_TRANSIT' | 'SECURED' | 'REQUESTED_BY_CLIENT' | 'IN_RETRIEVAL' | 'COMPLETED'

export interface Ticket {
  id: string
  clientName: string
  clientPhone: string
  serviceType: 'regular' | 'vip' | 'overnight'
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  vehiclePlate: string
  photos: string[]
  status: TicketStatus
  spotId: string | null
  locationNote: string | null
  hookId: string | null
  keyBoardId: string | null
  assignedValetId: string | null
  assignedBy: string | null
  keyReceivedBy: string | null
  keyReleasedTo: string | null
  gpsTrackOut: { lat: number; lng: number; ts: number }[]
  gpsTrackReturn: { lat: number; lng: number; ts: number }[]
  tipAmount: number | null
  paymentAmount: number | null
  paymentMethod: string | null
  createdAt: number
  parkedAt: number | null
  keysReceivedAt: number | null
  completedAt: number | null
  requestedAt: number | null
  deliveredAt: number | null
  isHighVolume: boolean
}

export interface StaffMember {
  id: string
  name: string
  role: 'admin' | 'cashier' | 'valet' | 'runner' | 'keyholder'
  status: 'available' | 'in_transit' | 'off_duty'
  activeTickets: number
  tipsToday: number
  carsToday: number
  contact?: string
}

export interface Spot {
  id: string
  code: string
  zoneId: string
  occupied: boolean
  ticketId: string | null
}

export interface Zone {
  id: string
  name: string
  color: string
}

export interface KeyBoard {
  id: string
  name: string
  format: 'hotel' | 'numeric'
  rows: number
  cols: number
  totalHooks: number
  perRow?: number
}

export interface Hook {
  id: string
  boardId: string
  code: string
  status: 'free' | 'occupied' | 'disabled'
  ticketId: string | null
  assignedBy: string | null
  assignedAt: number | null
}

export interface Notification {
  id: string
  type: 'assignment' | 'keys_handoff' | 'keys_request' | 'keys_released' | 'delivery_request' | 'key_missing' | 'alert'
  fromRole: string
  toRole: string
  fromUserId: string
  toUserId: string | null
  ticketId: string
  message: string
  timestamp: number
  read: boolean
}

// --- Initial Seed Data (Infraestructura) ---

const initialStaff: StaffMember[] = [
  { id: 'a1', name: 'Super Admin',  role: 'admin',     status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'v1', name: 'Carlos M.',    role: 'valet',     status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'v2', name: 'Luis R.',      role: 'valet',     status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'v3', name: 'Marco T.',     role: 'valet',     status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'v4', name: 'Sofia P.',     role: 'valet',     status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'c1', name: 'Ana G.',       role: 'cashier',   status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
  { id: 'k1', name: 'Roberto V.',   role: 'keyholder', status: 'available', activeTickets: 0, carsToday: 0, tipsToday: 0 },
]

const initialZones: Zone[] = [
  { id: 'basement-1', name: 'Sótano 1', color: 'bg-blue-500' },
  { id: 'rooftop', name: 'Techo', color: 'bg-orange-500' },
]

const initialSpots: Spot[] = [
  // Sótano 1 (10 spots)
  ...Array.from({ length: 10 }).map((_, i) => ({ id: `s1-${i+1}`, code: `1-${String.fromCharCode(65 + i)}`, zoneId: 'basement-1', occupied: false, ticketId: null })),
  // Techo (10 spots)
  ...Array.from({ length: 10 }).map((_, i) => ({ id: `t-${i+1}`, code: `R-${i+1}`, zoneId: 'rooftop', occupied: false, ticketId: null })),
]

const initialKeyBoards: KeyBoard[] = [
  { id: 'kb1', name: 'Principal', format: 'hotel', rows: 4, cols: 5, totalHooks: 20, perRow: 5 }
]

const initialHooks: Hook[] = []
const rowLabels = 'ABCD'.split('')
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 5; c++) {
    initialHooks.push({
      id: `h-${r}-${c}`,
      boardId: 'kb1',
      code: `${rowLabels[r]}${c + 1}`,
      status: 'free',
      ticketId: null,
      assignedBy: null,
      assignedAt: null
    })
  }
}

// --- Transaccional (CERO ABSOLUTO) ---
const initialTickets: Ticket[] = []

// --- Store Interface ---

export interface StoreState {
  // Auth
  currentUser: StaffMember | null
  login: (role: StaffMember['role']) => void
  logout: () => void

  // Company
  companyInfo: {
    name: string
    plan: string
    logo: string | null
    phone: string
    email: string
    address: string
    location?: { lat: number; lng: number; address: string }
  }
  setCompany: (data: Partial<StoreState['companyInfo']>) => void
  updateCompany: (data: Partial<StoreState['companyInfo']>) => void

  // Operation Mode
  operationMode: 'INDEPENDENT' | 'TEAM'
  setOperationMode: (mode: 'INDEPENDENT' | 'TEAM') => void

  // Tickets
  tickets: Ticket[]
  createTicket: (data: Partial<Ticket>) => void
  updateTicket: (id: string, data: Partial<Ticket>) => void
  getTicketsByStatus: (status: TicketStatus | TicketStatus[]) => Ticket[]
  getActiveTickets: () => Ticket[]

  // Spots
  zones: Zone[]
  spots: Spot[]
  setZones: (zones: Zone[]) => void
  setSpots: (spots: Spot[]) => void
  updateSpotStatus: (spotId: string, occupied: boolean, ticketId?: string | null) => void
  addZone: (zone: Omit<Zone, 'id'>) => void
  addSpot: (spot: Omit<Spot, 'id' | 'occupied' | 'ticketId'>) => void
  removeZone: (zoneId: string) => void
  removeSpot: (spotId: string) => void

  // KeyBoard
  keyBoards: KeyBoard[]
  hooks: Hook[]
  setBoards: (boards: KeyBoard[]) => void
  setHooks: (hooks: Hook[]) => void
  updateHookStatus: (hookId: string, status: Hook['status'], ticketId?: string | null) => void

  // Staff
  staff: StaffMember[]
  setStaff: (staff: StaffMember[]) => void
  addStaff: (member: StaffMember) => void
  removeStaff: (id: string) => void
  updateStaffStatus: (id: string, status: StaffMember['status']) => void
  getAvailableByRole: (role: StaffMember['role']) => StaffMember[]

  // Operation
  highVolumeMode: boolean
  toggleHighVolume: () => void
  notifications: Notification[]
  addNotification: (data: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  clearNotification: (id: string) => void
  getNotificationsFor: (userId?: string, role?: string) => Notification[]
}

// --- Store Implementation ---

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      login: (role) => {
        let user = get().staff.find(s => s.role === role)
        if (!user) {
          // Fallback to initialStaff to fix older persisted states missing the role
          const fallback = initialStaff.find(s => s.role === role)
          if (fallback) {
            set(state => ({ staff: [...state.staff, fallback] }))
            user = fallback
          }
        }
        if (user) set({ currentUser: user })
      },
      logout: () => set({ currentUser: null }),

      // Company
      companyInfo: {
        name: 'Valet Luxe Miami',
        plan: 'Pro',
        logo: null,
        phone: '+1 305-555-8888',
        email: 'info@valetluxe.com',
        address: '1234 Ocean Drive, Miami Beach, FL 33139',
      },
      setCompany: (data) => set(state => ({ companyInfo: { ...state.companyInfo, ...data } })),
      updateCompany: (data) => set(state => ({ companyInfo: { ...state.companyInfo, ...data } })),

      // Operation Mode
      operationMode: 'TEAM', // Default a TEAM para requerir Keyholder por defecto, o puede cambiarse
      setOperationMode: (mode) => set({ operationMode: mode }),

      // Tickets
      tickets: initialTickets,
      createTicket: (data) => set(state => ({
        tickets: [...state.tickets, {
          ...data,
          id: Date.now().toString(),
          createdAt: Date.now(),
          status: data.status || 'WAITING_VALET',
          isHighVolume: state.highVolumeMode,
        } as Ticket]
      })),
      updateTicket: (id, data) => set(state => ({
        tickets: state.tickets.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      getTicketsByStatus: (status) => {
        const statuses = Array.isArray(status) ? status : [status]
        return get().tickets.filter(t => statuses.includes(t.status))
      },
      getActiveTickets: () => get().tickets.filter(t => t.status !== 'COMPLETED'),

      // Spots
      zones: initialZones,
      spots: initialSpots,
      setZones: (zones) => set({ zones }),
      setSpots: (spots) => set({ spots }),
      updateSpotStatus: (spotId, occupied, ticketId = null) => set(state => ({
        spots: state.spots.map(s => s.id === spotId ? { ...s, occupied, ticketId } : s)
      })),
      addZone: (zone) => set(state => ({ 
        zones: [...state.zones, { ...zone, id: Date.now().toString() }] 
      })),
      addSpot: (spot) => set(state => ({ 
        spots: [...state.spots, { ...spot, id: Date.now().toString(), occupied: false, ticketId: null }] 
      })),
      removeZone: (zoneId) => set(state => ({ 
        zones: state.zones.filter(z => z.id !== zoneId),
        spots: state.spots.filter(s => s.zoneId !== zoneId)
      })),
      removeSpot: (spotId) => set(state => ({ 
        spots: state.spots.filter(s => s.id !== spotId) 
      })),

      // KeyBoard
      keyBoards: initialKeyBoards,
      hooks: initialHooks,
      setBoards: (boards) => set({ keyBoards: boards }),
      setHooks: (hooks) => set({ hooks }),
      updateHookStatus: (hookId, status, ticketId = null) => set(state => ({
        hooks: state.hooks.map(h => h.id === hookId ? { ...h, status, ticketId } : h)
      })),

      // Staff
      staff: initialStaff,
      setStaff: (staff) => set({ staff }),
      addStaff: (member) => set(state => ({ staff: [...state.staff, member] })),
      removeStaff: (id) => set(state => ({ staff: state.staff.filter(s => s.id !== id) })),
      updateStaffStatus: (id, status) => set(state => ({
        staff: state.staff.map(s => s.id === id ? { ...s, status } : s)
      })),
      getAvailableByRole: (role) => get().staff.filter(s => s.role === role && s.status === 'available'),

      // Operation
      highVolumeMode: false,
      toggleHighVolume: () => set(state => ({ highVolumeMode: !state.highVolumeMode })),
      notifications: [],
      addNotification: (data) => set(state => ({
        notifications: [...state.notifications, {
          ...data,
          id: Date.now().toString(),
          timestamp: Date.now(),
          read: false
        }]
      })),
      clearNotification: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      getNotificationsFor: (userId, role) => get().notifications.filter(n => {
        if (n.read) return false
        if (userId && n.toUserId === userId) return true
        if (role && n.toRole === role && !n.toUserId) return true
        return false
      }),
    }),
    {
      name: 'addspot-storage-v4', // Cambiado para invalidar la data falsa anterior almacenada en caché
    }
  )
)

// --- Hooks for easier consumption ---
export const useAuth = () => ({
  currentUser: useStore(s => s.currentUser),
  login: useStore(s => s.login),
  logout: useStore(s => s.logout),
})

export const useCompany = () => ({
  companyInfo: useStore(s => s.companyInfo),
  setCompany: useStore(s => s.setCompany),
  updateCompany: useStore(s => s.updateCompany),
})

export const useOperationMode = () => ({
  operationMode: useStore(s => s.operationMode),
  setOperationMode: useStore(s => s.setOperationMode),
})

export const useTickets = () => ({
  tickets: useStore(s => s.tickets),
  createTicket: useStore(s => s.createTicket),
  updateTicket: useStore(s => s.updateTicket),
  getTicketsByStatus: useStore(s => s.getTicketsByStatus),
  getActiveTickets: useStore(s => s.getActiveTickets),
})

export const useSpots = () => ({
  zones: useStore(s => s.zones),
  spots: useStore(s => s.spots),
  setZones: useStore(s => s.setZones),
  setSpots: useStore(s => s.setSpots),
  updateSpotStatus: useStore(s => s.updateSpotStatus),
  addZone: useStore(s => s.addZone),
  addSpot: useStore(s => s.addSpot),
  removeZone: useStore(s => s.removeZone),
  removeSpot: useStore(s => s.removeSpot),
})

export const useKeyBoard = () => ({
  keyBoards: useStore(s => s.keyBoards),
  hooks: useStore(s => s.hooks),
  setBoards: useStore(s => s.setBoards),
  setHooks: useStore(s => s.setHooks),
  updateHookStatus: useStore(s => s.updateHookStatus),
})

export const useStaff = () => ({
  staff: useStore(s => s.staff),
  setStaff: useStore(s => s.setStaff),
  addStaff: useStore(s => s.addStaff),
  removeStaff: useStore(s => s.removeStaff),
  updateStaffStatus: useStore(s => s.updateStaffStatus),
  getAvailableByRole: useStore(s => s.getAvailableByRole),
})

export const useOperation = () => ({
  highVolumeMode: useStore(s => s.highVolumeMode),
  toggleHighVolume: useStore(s => s.toggleHighVolume),
  notifications: useStore(s => s.notifications),
  addNotification: useStore(s => s.addNotification),
  clearNotification: useStore(s => s.clearNotification),
  getNotificationsFor: useStore(s => s.getNotificationsFor),
})
