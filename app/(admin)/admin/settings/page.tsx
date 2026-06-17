'use client'

import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { LogOut } from 'lucide-react'
import { companyInfo } from '@/lib/mock-data'
import { useAuth } from '@/lib/store'

export default function SettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleSignOut = () => {
    logout()
    router.push('/login')
  }
  return (
    <div>
      <AdminHeader title="Settings" breadcrumb={['Admin', 'Settings']} />

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  defaultValue={companyInfo.name}
                  className="h-11 bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={companyInfo.email}
                  className="h-11 bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={companyInfo.phone}
                  className="h-11 bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue={companyInfo.address}
                  className="h-11 bg-surface border-border"
                />
              </div>
            </div>
            <Button className="h-11 px-6 bg-primary hover:brightness-110">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">New check-in alerts</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when a new vehicle is checked in
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">Delivery requests</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when a customer requests their vehicle
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Daily reports</p>
                <p className="text-sm text-muted-foreground">
                  Receive a summary of daily operations via email
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl">
              <div>
                <p className="font-bold text-lg">Pro Plan</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited valets, advanced analytics, priority support
                </p>
              </div>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            <Button variant="outline" className="mt-4 h-11 border-border hover:bg-surface">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-destructive/30">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-destructive">Sign Out</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Sign out of your account. You will need to sign in again to access the dashboard.
            </p>
            <Button 
              onClick={handleSignOut}
              variant="destructive" 
              className="h-11 px-6 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
