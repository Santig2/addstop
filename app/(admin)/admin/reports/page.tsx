'use client'

import { AdminHeader } from '@/components/admin-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTickets, useStaff } from '@/lib/store'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ReportsPage() {
  const { tickets } = useTickets()
  const { staff } = useStaff()

  // 1. Tips by Valet
  const tipsReportData = staff
    .filter(s => s.role === 'valet')
    .map(s => {
      const valetTickets = tickets.filter(t => t.assignedValetId === s.id && t.tipAmount)
      const total = s.tipsToday
      const average = valetTickets.length > 0 ? total / valetTickets.length : 0
      return {
        valet: s.name,
        total,
        average,
        shifts: 1 // Assuming 1 shift for now
      }
    })
    .sort((a, b) => b.total - a.total)

  // 2. Hourly Volume
  const hourlyData = Array.from({length: 24}, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    cars: tickets.filter(t => new Date(t.createdAt).getHours() === hour).length
  }))

  // 3. Operations
  const parkedTickets = tickets.filter(t => t.parkedAt && t.createdAt)
  const avgCheckInMs = parkedTickets.length > 0
    ? parkedTickets.reduce((sum, t) => sum + (t.parkedAt! - t.createdAt), 0) / parkedTickets.length
    : 0

  const deliveredTickets = tickets.filter(t => t.deliveredAt && t.requestedAt)
  const avgDeliveryMs = deliveredTickets.length > 0
    ? deliveredTickets.reduce((sum, t) => sum + (t.deliveredAt! - t.requestedAt!), 0) / deliveredTickets.length
    : 0

  const formatMinSec = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const completionRate = tickets.length > 0 
    ? (tickets.filter(t => t.status === 'delivered' || t.status === 'complete').length / tickets.length) * 100 
    : 0

  return (
    <div>
      <AdminHeader title="Reports" breadcrumb={['Admin', 'Reports']} />

      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="clay-input p-1 h-auto rounded-2xl mb-6">
          <TabsTrigger
            value="tips"
            className="text-sm rounded-xl font-bold px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
          >
            Tips
          </TabsTrigger>
          <TabsTrigger
            value="volume"
            className="text-sm rounded-xl font-bold px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
          >
            Volume
          </TabsTrigger>
          <TabsTrigger
            value="operations"
            className="text-sm rounded-xl font-bold px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
          >
            Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="mt-0">
          <div className="clay-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold font-serif text-foreground">Tips by Valet</h2>
            </div>
            <div className="clay-input rounded-2xl p-4 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Valet</TableHead>
                    <TableHead className="text-muted-foreground text-right">Total</TableHead>
                    <TableHead className="text-muted-foreground text-right">Average</TableHead>
                    <TableHead className="text-muted-foreground text-right">Shifts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tipsReportData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        No hay datos de propinas
                      </TableCell>
                    </TableRow>
                  )}
                  {tipsReportData.map((row) => (
                    <TableRow key={row.valet} className="border-border">
                      <TableCell className="font-medium">{row.valet}</TableCell>
                      <TableCell className="text-right font-mono text-success">
                        ${row.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${row.average.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">{row.shifts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="volume" className="mt-0">
          <div className="clay-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold font-serif text-foreground">Cars per Hour</h2>
            </div>
            <div>
              <div className="h-80 clay-input rounded-2xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                    <XAxis
                      dataKey="hour"
                      stroke="#9499AD"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9499AD"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1D26',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="cars" fill="#5B7FFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="mt-0">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="clay-card p-6 flex flex-col justify-center items-center text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg. Check-in Time</p>
              <div className="clay-input p-4 rounded-2xl w-full">
                <p className="text-4xl font-bold font-mono text-primary">{formatMinSec(avgCheckInMs)}</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-4">minutes:seconds</p>
            </div>
            <div className="clay-card p-6 flex flex-col justify-center items-center text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg. Delivery Time</p>
              <div className="clay-input p-4 rounded-2xl w-full">
                <p className="text-4xl font-bold font-mono text-cyan">{formatMinSec(avgDeliveryMs)}</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-4">minutes:seconds</p>
            </div>
            <div className="clay-card p-6 flex flex-col justify-center items-center text-center">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Completion Rate</p>
              <div className="clay-input p-4 rounded-2xl w-full">
                <p className="text-4xl font-bold font-mono text-success">{completionRate.toFixed(1)}%</p>
              </div>
              <p className="text-xs font-medium text-muted-foreground mt-4">tickets completed</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
