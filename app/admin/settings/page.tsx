import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Store, Shield, CreditCard, Truck } from "lucide-react"

async function getStoreSettings() {
  const supabase = await createClient()

  // In a real app, you'd have a settings table
  // For now, we'll return default settings
  return {
    storeName: "Anima",
    storeDescription: "Premium E-commerce Store",
    storeEmail: "contact@animastore.com",
    storePhone: "+91 8011255880",
    storeAddress: "Guwahati, Assam, India",
    currency: "INR",
    taxRate: 18,
    shippingEnabled: true,
    freeShippingThreshold: 1000,
    maintenanceMode: false,
    allowGuestCheckout: true,
    emailNotifications: true,
    smsNotifications: false,
  }
}

export default async function AdminSettingsPage() {
  await requireAdmin()
  const settings = await getStoreSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue={settings.storeName} />
            </div>
            <div>
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea id="storeDescription" defaultValue={settings.storeDescription} />
            </div>
            <div>
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input id="storeEmail" type="email" defaultValue={settings.storeEmail} />
            </div>
            <div>
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input id="storePhone" defaultValue={settings.storePhone} />
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea id="storeAddress" defaultValue={settings.storeAddress} />
            </div>
            <Button>Save Store Information</Button>
          </CardContent>
        </Card>

        {/* Payment & Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment & Currency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue={settings.currency} />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue={settings.taxRate} />
            </div>
            <div className="space-y-2">
              <Label>Payment Methods</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="razorpay" defaultChecked />
                  <Label htmlFor="razorpay">Razorpay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="cod" defaultChecked />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </div>
            </div>
            <Button>Save Payment Settings</Button>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="shippingEnabled" defaultChecked={settings.shippingEnabled} />
              <Label htmlFor="shippingEnabled">Enable Shipping</Label>
            </div>
            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
              <Input id="freeShippingThreshold" type="number" defaultValue={settings.freeShippingThreshold} />
            </div>
            <div>
              <Label htmlFor="shippingRate">Standard Shipping Rate (₹)</Label>
              <Input id="shippingRate" type="number" defaultValue="50" />
            </div>
            <Button>Save Shipping Settings</Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="maintenanceMode" defaultChecked={settings.maintenanceMode} />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="allowGuestCheckout" defaultChecked={settings.allowGuestCheckout} />
              <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="emailNotifications" defaultChecked={settings.emailNotifications} />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="smsNotifications" defaultChecked={settings.smsNotifications} />
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
            </div>
            <Button>Save System Settings</Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">API Keys</h3>
              <div>
                <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                <Input id="razorpayKey" type="password" placeholder="••••••••••••••••" />
              </div>
              <div>
                <Label htmlFor="shiprocketEmail">Shiprocket Email</Label>
                <Input id="shiprocketEmail" type="email" placeholder="Enter Shiprocket email" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Security Options</h3>
              <div className="flex items-center space-x-2">
                <Switch id="twoFactor" />
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="loginAttempts" defaultChecked />
                <Label htmlFor="loginAttempts">Limit Login Attempts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auditLog" defaultChecked />
                <Label htmlFor="auditLog">Enable Audit Logging</Label>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <Button>Save Security Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
