import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Store, Mail, Bell, CreditCard, Image, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSellerProfile, useUpdateSellerProfile } from "@/hooks/useSupabaseData"

export function Settings() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useSellerProfile()
  const updateProfile = useUpdateSellerProfile()
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [storeLogoUrl, setStoreLogoUrl] = useState("")
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const canSaveProfile = Boolean(profile?.is_seller_approved)

  useEffect(() => {
    if (!profile) return
    const timer = window.setTimeout(() => {
      setStoreName(profile.store_name ?? "")
      setStoreDescription(profile.store_description ?? "")
      setPhoneNumber(profile.phone_number ?? "")
      setStoreLogoUrl(profile.store_logo_url ?? "")
    }, 0)

    return () => window.clearTimeout(timer)
  }, [profile])

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Store Settings" description="Manage your store profile and preferences" />
        <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Store Settings" description="Manage your store profile and preferences" />

      <div className="p-6 space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Store className="h-5 w-5 text-muted-foreground" /><CardTitle>Store Profile</CardTitle></div>
            <CardDescription>Your store information visible to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {storeLogoUrl ? <img src={storeLogoUrl} alt="Store logo" className="h-full w-full object-cover" /> : <Image className="h-8 w-8 text-muted-foreground" />}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="storeLogoUrl">Logo URL</Label>
                <Input id="storeLogoUrl" value={storeLogoUrl} onChange={(e) => setStoreLogoUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvalStatus">Approval Status</Label>
                <Input id="approvalStatus" value={profile?.is_seller_approved ? "Approved" : "Pending approval"} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea id="storeDescription" value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-muted-foreground" /><CardTitle>Contact Information</CardTitle></div>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={user?.email ?? ""} disabled /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></div>
            </div>
            <p className="text-xs text-muted-foreground">Business address is not currently stored in the seller profile schema.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-muted-foreground" /><CardTitle>Notifications</CardTitle></div>
            <CardDescription>Notification preferences are not tracked in the current database schema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>New order, review, payout, and weekly summary preferences require a notification settings table before they can be saved.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-muted-foreground" /><CardTitle>Payment Settings</CardTitle></div>
            <CardDescription>Configure how you receive payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Payout method and automatic payout settings are not editable from the current seller profile schema.</p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {!canSaveProfile ? <p className="text-sm text-muted-foreground">Only approved seller profiles can be edited.</p> : null}
          {saveMessage ? <p className={`text-sm ${saveMessage.startsWith("Unable") ? "text-destructive" : "text-green-600"}`}>{saveMessage}</p> : null}
          <Button
            disabled={!canSaveProfile || updateProfile.isPending}
            title={!canSaveProfile ? "Only approved seller profiles can be edited" : undefined}
            onClick={async () => {
              setSaveMessage("Saving settings...")
              try {
                await updateProfile.mutateAsync({
                  store_name: storeName || null,
                  store_description: storeDescription || null,
                  phone_number: phoneNumber || null,
                  store_logo_url: storeLogoUrl || null,
                })
                setSaveMessage("Settings saved.")
              } catch (error) {
                setSaveMessage(error instanceof Error ? `Unable to save settings: ${error.message}` : "Unable to save settings.")
              }
            }}
          >
            {updateProfile.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
