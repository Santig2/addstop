// Mock data for AddSpot Valet Parking System

export type UserRole = 'admin' | 'cashier' | 'valet' | 'runner' | 'keyholder'

export const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  cashier: 'Cajero',
  valet: 'Valet',
  runner: 'Rampero',
  keyholder: 'Llavero',
}

export const roleColors: Record<UserRole, { bg: string; text: string }> = {
  admin:     { bg: 'bg-primary/20',     text: 'text-primary' },
  cashier:   { bg: 'bg-secondary/20',   text: 'text-secondary' },
  valet:     { bg: 'bg-cyan/20',        text: 'text-cyan' },
  runner:    { bg: 'bg-warning/20',     text: 'text-warning' },
  keyholder: { bg: 'bg-success/20',     text: 'text-success' },
}

export const carBrands = [
  { id: 'toyota',   name: 'Toyota',       models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'] },
  { id: 'bmw',      name: 'BMW',          models: ['3 Series', '5 Series', 'X3', 'X5', 'M4'] },
  { id: 'mercedes', name: 'Mercedes-Benz',models: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'AMG GT'] },
  { id: 'honda',    name: 'Honda',        models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'] },
  { id: 'audi',     name: 'Audi',         models: ['A4', 'A6', 'Q5', 'Q7', 'RS6'] },
  { id: 'ford',     name: 'Ford',         models: ['F-150', 'Mustang', 'Explorer', 'Bronco', 'Escape'] },
  { id: 'lexus',    name: 'Lexus',        models: ['ES', 'RX', 'NX', 'IS', 'LC'] },
  { id: 'porsche',  name: 'Porsche',      models: ['911', 'Cayenne', 'Panamera', 'Macan', 'Taycan'] },
]

export const carColors = [
  { id: 'black',  name: 'Black',  hex: '#1a1a1a' },
  { id: 'white',  name: 'White',  hex: '#f5f5f5' },
  { id: 'silver', name: 'Silver', hex: '#c0c0c0' },
  { id: 'gray',   name: 'Gray',   hex: '#808080' },
  { id: 'red',    name: 'Red',    hex: '#dc2626' },
  { id: 'blue',   name: 'Blue',   hex: '#2563eb' },
  { id: 'green',  name: 'Green',  hex: '#16a34a' },
  { id: 'gold',   name: 'Gold',   hex: '#d4a574' },
]

export const valets = [
  { id: 'v1', name: 'Carlos M.',  initials: 'CM', role: 'valet'     as UserRole, status: 'available',   carsToday: 12, tipsToday: 45, avgTime: '4:32' },
  { id: 'v2', name: 'Luis R.',    initials: 'LR', role: 'valet'     as UserRole, status: 'in-transit',  carsToday: 8,  tipsToday: 32, avgTime: '5:15' },
  { id: 'v3', name: 'Marco T.',   initials: 'MT', role: 'valet'     as UserRole, status: 'available',   carsToday: 15, tipsToday: 62, avgTime: '3:48' },
  { id: 'v4', name: 'Sofia P.',   initials: 'SP', role: 'valet'     as UserRole, status: 'off-shift',   carsToday: 0,  tipsToday: 0,  avgTime: '-' },
  { id: 'c1', name: 'Ana G.',     initials: 'AG', role: 'cashier'   as UserRole, status: 'available',   carsToday: 0,  tipsToday: 0,  avgTime: '-' },
  { id: 'c2', name: 'Pedro L.',   initials: 'PL', role: 'cashier'   as UserRole, status: 'off-shift',   carsToday: 0,  tipsToday: 0,  avgTime: '-' },
  { id: 'r1', name: 'Diego F.',   initials: 'DF', role: 'runner'    as UserRole, status: 'available',   carsToday: 9,  tipsToday: 0,  avgTime: '3:10' },
  { id: 'r2', name: 'Marta S.',   initials: 'MS', role: 'runner'    as UserRole, status: 'in-transit',  carsToday: 6,  tipsToday: 0,  avgTime: '4:05' },
  { id: 'k1', name: 'Roberto V.', initials: 'RV', role: 'keyholder' as UserRole, status: 'available',   carsToday: 0,  tipsToday: 0,  avgTime: '-' },
]

export const parkingZones = [
  { id: 'basement-1', name: 'Sótano 1', spots: ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D'] },
  { id: 'basement-2', name: 'Sótano 2', spots: ['4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D', '14B', '22C'] },
  { id: 'rooftop',    name: 'Techo',    spots: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'] },
  { id: 'street',     name: 'Calle',    spots: ['S1', 'S2', 'S3', 'S4'] },
]

export type TicketStatus = 'arriving' | 'assigned' | 'parked' | 'complete' | 'requested'

export const activeTickets = [
  {
    id: 't1',
    ticketNumber: '0847',
    plate: 'ABC-1234',
    brand: 'BMW',
    model: '5 Series',
    color: 'Black',
    spot: '14B',
    keyHook: 'B7',
    status: 'parked' as TicketStatus,
    valet: 'Carlos M.',
    customer: 'Michael Scott',
    serviceType: 'VIP',
    checkInTime: '6:45 PM',
    elapsedMin: 32,
    phone: '+1 305-555-0123',
  },
  {
    id: 't2',
    ticketNumber: '0848',
    plate: 'XYZ-5678',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    color: 'Silver',
    spot: '2A',
    keyHook: 'A3',
    status: 'requested' as TicketStatus,
    valet: 'Luis R.',
    customer: 'Dwight Schrute',
    serviceType: 'Regular',
    checkInTime: '7:12 PM',
    elapsedMin: 5,
    phone: '+1 305-555-0456',
  },
  {
    id: 't3',
    ticketNumber: '0849',
    plate: 'MIA-9012',
    brand: 'Porsche',
    model: '911',
    color: 'Red',
    spot: 'R3',
    keyHook: 'C5',
    status: 'arriving' as TicketStatus,
    valet: 'Marco T.',
    customer: 'Jim Halpert',
    serviceType: 'Regular',
    checkInTime: '7:30 PM',
    elapsedMin: 2,
    phone: '+1 305-555-0789',
  },
  {
    id: 't4',
    ticketNumber: '0850',
    plate: 'FLA-3456',
    brand: 'Audi',
    model: 'Q7',
    color: 'White',
    spot: 'S2',
    keyHook: 'D2',
    status: 'assigned' as TicketStatus,
    valet: 'Diego F.',
    customer: 'Pam Beesly',
    serviceType: 'Overnight',
    checkInTime: '7:45 PM',
    elapsedMin: 8,
    phone: '+1 305-555-0999',
  },
]

// Pending assignments for valets/runners
export const pendingAssignments = [
  {
    id: 'a1',
    ticketNumber: '0851',
    plate: 'NYK-7890',
    brand: 'Tesla',
    model: 'Model S',
    color: 'White',
    customer: 'Kevin Malone',
    serviceType: 'VIP',
    assignedAt: '8:02 PM',
    assignedBy: 'Ana G.',
  },
  {
    id: 'a2',
    ticketNumber: '0852',
    plate: 'CAL-2233',
    brand: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    customer: 'Angela Martin',
    serviceType: 'Regular',
    assignedAt: '8:05 PM',
    assignedBy: 'Ana G.',
  },
]

// Key delivery notifications (valet → keyholder)
export const keyDeliveryNotifications = [
  {
    id: 'kd1',
    ticketNumber: '0847',
    plate: 'ABC-1234',
    valet: 'Carlos M.',
    spot: '14B',
    sentAt: '7:20 PM',
    status: 'pending',
  },
]

// Key request notifications (keyholder → valet for retrieval)
export const keyRequestNotifications = [
  {
    id: 'kr1',
    ticketNumber: '0848',
    plate: 'XYZ-5678',
    valet: 'Luis R.',
    hook: 'A3',
    sentAt: '8:10 PM',
    status: 'pending',
  },
]

export const recentActivity = [
  { id: 'a1', plate: 'ABC-1234', action: 'check-in',  valet: 'Carlos M.', time: '6:45 PM', status: 'success' },
  { id: 'a2', plate: 'DEF-5678', action: 'delivered', valet: 'Luis R.',   time: '6:32 PM', status: 'success' },
  { id: 'a3', plate: 'GHI-9012', action: 'requested', valet: 'Marco T.',  time: '6:28 PM', status: 'warning' },
  { id: 'a4', plate: 'JKL-3456', action: 'parked',    valet: 'Carlos M.', time: '6:15 PM', status: 'success' },
  { id: 'a5', plate: 'MNO-7890', action: 'check-in',  valet: 'Sofia P.',  time: '6:00 PM', status: 'success' },
]

export const hourlyData = [
  { hour: '4PM', cars: 3  },
  { hour: '5PM', cars: 8  },
  { hour: '6PM', cars: 15 },
  { hour: '7PM', cars: 22 },
  { hour: '8PM', cars: 18 },
  { hour: '9PM', cars: 12 },
  { hour: '10PM',cars: 6  },
]

export const weeklyVolumeData = [
  { day: 'Mon', cars: 45  },
  { day: 'Tue', cars: 52  },
  { day: 'Wed', cars: 48  },
  { day: 'Thu', cars: 61  },
  { day: 'Fri', cars: 89  },
  { day: 'Sat', cars: 112 },
  { day: 'Sun', cars: 78  },
]

export const tipsReportData = [
  { valet: 'Carlos M.', total: 245, average: 8.50, shifts: 12 },
  { valet: 'Luis R.',   total: 198, average: 7.20, shifts: 11 },
  { valet: 'Marco T.',  total: 312, average: 9.80, shifts: 14 },
  { valet: 'Sofia P.',  total: 156, average: 6.50, shifts:  9 },
]

export const tipAmounts = [2, 5, 10, 20]

// Generate keyboard grid — hotel format (letters × numbers)
export function generateKeyboardGrid(rows: number, cols: number) {
  const grid: { code: string; status: 'free' | 'occupied' | 'disabled'; plate?: string }[][] = []
  const rowLabels = 'ABCDEFGH'.split('')

  for (let r = 0; r < rows; r++) {
    const row: { code: string; status: 'free' | 'occupied' | 'disabled'; plate?: string }[] = []
    for (let c = 0; c < cols; c++) {
      const code = `${rowLabels[r]}${c + 1}`
      const rand = Math.random()
      let status: 'free' | 'occupied' | 'disabled' = 'free'
      let plate: string | undefined

      if (rand < 0.3) {
        status = 'occupied'
        plate = ['ABC-1234', 'XYZ-5678', 'MIA-9012', 'FLA-3456'][Math.floor(Math.random() * 4)]
      } else if (rand < 0.4) {
        status = 'disabled'
      }

      row.push({ code, status, plate })
    }
    grid.push(row)
  }

  return grid
}

// Generate numeric keyboard grid — two rows (top: 1..hookPerRow, bottom: hookPerRow+1..total)
export function generateNumericKeyboardGrid(total: number, perRow: number) {
  const topRow: { code: string; status: 'free' | 'occupied' | 'disabled'; plate?: string }[] = []
  const bottomRow: { code: string; status: 'free' | 'occupied' | 'disabled'; plate?: string }[] = []

  for (let n = 1; n <= total; n++) {
    const code = String(n)
    const rand = Math.random()
    let status: 'free' | 'occupied' | 'disabled' = 'free'
    let plate: string | undefined

    if (rand < 0.3) {
      status = 'occupied'
      plate = ['ABC-1234', 'XYZ-5678', 'MIA-9012', 'FLA-3456'][Math.floor(Math.random() * 4)]
    } else if (rand < 0.4) {
      status = 'disabled'
    }

    const hook = { code, status, plate }
    if (n <= perRow) topRow.push(hook)
    else bottomRow.push(hook)
  }

  return [topRow, bottomRow]
}

export const defaultKeyboardGrid = generateKeyboardGrid(4, 8)

export const companyInfo = {
  name: 'Valet Luxe Miami',
  plan: 'Pro',
  logo: null,
  phone: '+1 305-555-8888',
  email: 'info@valetluxe.com',
  address: '1234 Ocean Drive, Miami Beach, FL 33139',
}

export const currentShift = {
  date: 'Today',
  startTime: '6:00 PM',
  endTime: '2:00 AM',
  location: 'Hotel Luxe',
  hoursWorked: 4.5,
  carsProcessed: 12,
  tipsTotal: 45,
  avgTime: '4:32',
}

// Cashier payments history for the shift
export const cashierPayments = [
  { id: 'p1', ticket: '0841', plate: 'TST-1111', customer: 'John Smith',   amount: 25, serviceType: 'Regular',   time: '5:30 PM' },
  { id: 'p2', ticket: '0842', plate: 'TST-2222', customer: 'Mary Jane',    amount: 45, serviceType: 'VIP',        time: '5:48 PM' },
  { id: 'p3', ticket: '0843', plate: 'TST-3333', customer: 'Tony Stark',   amount: 75, serviceType: 'VIP',        time: '6:10 PM' },
  { id: 'p4', ticket: '0844', plate: 'TST-4444', customer: 'Bruce Wayne',  amount: 25, serviceType: 'Regular',   time: '6:22 PM' },
  { id: 'p5', ticket: '0845', plate: 'TST-5555', customer: 'Clark Kent',   amount: 35, serviceType: 'Overnight', time: '6:45 PM' },
]
