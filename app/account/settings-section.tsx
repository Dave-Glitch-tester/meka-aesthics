"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, Mail, Lock } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    promotions: true,
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { toast } = useToast()

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))

    // Simulate saving settings
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved",
    })
  }

  const handleChangePassword = () => {
    setIsChangingPassword(true)

    // Simulate password change process
    setTimeout(() => {
      setIsChangingPassword(false)
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-blue-600">Receive order updates and account notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-blue-600">Receive order updates and account notifications via SMS</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle("smsNotifications")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            Email Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-blue-600">Receive emails about new products and collections</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle("marketingEmails")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-updates">Order Updates</Label>
              <p className="text-sm text-blue-600">Receive emails about your order status</p>
            </div>
            <Switch
              id="order-updates"
              checked={settings.orderUpdates}
              onCheckedChange={() => handleToggle("orderUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotions">Promotions and Discounts</Label>
              <p className="text-sm text-blue-600">Receive emails about sales and special offers</p>
            </div>
            <Switch id="promotions" checked={settings.promotions} onCheckedChange={() => handleToggle("promotions")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-blue-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-blue-600">Change your password or update security settings</p>
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Processing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

