import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Store, Mail, Bell, CreditCard, Image } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function Settings() {
  const { storeName, user } = useAuth()

  return (
    <div className="flex flex-col">
      <Header title="Store Settings" description="Manage your store profile and preferences" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Store Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Store Profile</CardTitle>
            </div>
            <CardDescription>
              Your store information visible to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <Button variant="outline" size="sm">Upload Logo</Button>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue={storeName ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeSlug">Store URL</Label>
                <Input id="storeSlug" defaultValue="my-eyewear-store" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                defaultValue="Premium eyewear collection featuring modern designs and quality craftsmanship."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <CardDescription>
              How customers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Business Address (optional)</Label>
              <Textarea
                id="address"
                placeholder="Street address, City, State, ZIP"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose what updates you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">New Orders</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive a new order
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">New Reviews</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when customers leave reviews
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Payout Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about payout status changes
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your store performance
                </p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Payment Settings</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Automatic Payouts</p>
                <p className="text-sm text-muted-foreground">
                  Automatically transfer available balance weekly
                </p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium">Minimum Payout Amount</p>
                <p className="text-sm text-muted-foreground">
                  Only transfer when balance exceeds this amount
                </p>
              </div>
              <Input 
                type="number" 
                defaultValue="100" 
                className="w-24 text-right" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
