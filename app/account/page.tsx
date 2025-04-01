"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from "lucide-react"
import ProfileSection from "./profile-section"
import OrdersSection from "./orders-section"
import WishlistSection from "./wishlist-section"
import AddressesSection from "./addresses-section"
import PaymentMethodsSection from "./payment-methods-section"
import SettingsSection from "./settings-section"
import PageLoading from "@/components/page-loading"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/account")
      return
    }
    setLoading(false)
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <PageLoading message="Loading your account..." />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Tab List */}
        <div className="lg:hidden w-full mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="profile" className="flex flex-col items-center py-2">
                <User className="h-4 w-4 mb-1" />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-col items-center py-2">
                <Package className="h-4 w-4 mb-1" />
                <span className="text-xs">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex flex-col items-center py-2">
                <Heart className="h-4 w-4 mb-1" />
                <span className="text-xs">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex flex-col items-center py-2">
                <MapPin className="h-4 w-4 mb-1" />
                <span className="text-xs">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex flex-col items-center py-2">
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center py-2">
                <Settings className="h-4 w-4 mb-1" />
                <span className="text-xs">Settings</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Hello, {user?.name?.split(" ")[0] || "User"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "wishlist" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "addresses" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Addresses
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "payment" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "settings" ? "bg-blue-600 text-white" : "text-blue-700"}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === "profile" && <ProfileSection user={user} />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "addresses" && <AddressesSection />}
            {activeTab === "payment" && <PaymentMethodsSection />}
            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </div>
    </div>
  )
}

