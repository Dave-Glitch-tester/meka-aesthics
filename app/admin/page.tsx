"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Package, ShoppingBag, Star, Users, User } from "lucide-react"
import PageLoading from "@/components/page-loading"

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin, redirect if not
    if (!user) {
      router.push("/login?redirect=/admin")
      return
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [user, isAdmin, router, toast])

  if (!user || !isAdmin) {
    return <PageLoading message="Loading admin dashboard..." />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store, products, orders, and more</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-900">Total Products</CardTitle>
            <CardDescription>Store inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-3xl font-bold">8</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-900">Total Orders</CardTitle>
            <CardDescription>Lifetime orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-3xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-900">Total Reviews</CardTitle>
            <CardDescription>Customer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-3xl font-bold">8</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-900">Total Users</CardTitle>
            <CardDescription>Registered accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-3xl font-bold">6</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
              Product Management
            </CardTitle>
            <CardDescription>Manage your store inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Add, edit, or remove products from your store. Update prices, descriptions, and inventory levels.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/products">Manage Products</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Order Management
            </CardTitle>
            <CardDescription>Track and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View order details, update order status, and manage customer shipments and returns.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Star className="h-5 w-5 mr-2 text-blue-600" />
              Review Management
            </CardTitle>
            <CardDescription>Moderate customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View and moderate customer reviews. Respond to feedback and manage product ratings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/reviews">Manage Reviews</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              View and manage user accounts. Update roles, permissions, and account status.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Activity</h2>
      <Card className="border-0 shadow-md mb-8">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Order #ORD-1234</p>
                <p className="text-sm text-gray-500">May 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦209.97</p>
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Delivered
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Order #ORD-5678</p>
                <p className="text-sm text-gray-500">June 20, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦89.97</p>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Processing
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Order #ORD-9012</p>
                <p className="text-sm text-gray-500">July 5, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₦129.97</p>
                <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  Shipped
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Recent Users Section */}
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Users</h2>
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Latest Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sarah Williams</p>
                  <p className="text-sm text-gray-500">sarah@example.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">May 12, 2023</p>
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm text-gray-500">michael@example.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">April 5, 2023</p>
                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Inactive</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Regular User</p>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">March 10, 2023</p>
                <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/users">View All Users</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

