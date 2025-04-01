"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Package, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/loading-spinner"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export default function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockOrders = [
          {
            id: "ORD-1234",
            items: [
              {
                productId: "1",
                name: "Azure Ceramic Vase",
                price: 49.99,
                quantity: 1,
              },
              {
                productId: "3",
                name: "Navy Blue Table Lamp",
                price: 79.99,
                quantity: 2,
              },
            ],
            total: 209.97,
            status: "delivered",
            createdAt: "2023-05-15T10:30:00Z",
          },
          {
            id: "ORD-5678",
            items: [
              {
                productId: "2",
                name: "Sapphire Throw Pillow",
                price: 29.99,
                quantity: 3,
              },
            ],
            total: 89.97,
            status: "processing",
            createdAt: "2023-06-20T14:45:00Z",
          },
          {
            id: "ORD-9012",
            items: [
              {
                productId: "4",
                name: "Teal Glass Candle Holder",
                price: 19.99,
                quantity: 2,
              },
              {
                productId: "5",
                name: "Indigo Wall Art",
                price: 89.99,
                quantity: 1,
              },
            ],
            total: 129.97,
            status: "shipped",
            createdAt: "2023-07-05T09:15:00Z",
          },
        ] as Order[]

        setOrders(mockOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Order History</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No orders found</h3>
            <p className="text-blue-600 mb-6">
              {searchQuery ? "Try a different search term" : "You haven't placed any orders yet"}
            </p>
            {!searchQuery && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">Start Shopping</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-blue-100 rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-900">Order {order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-600">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-blue-900">₦{order.total.toLocaleString()}</span>
                    <Button asChild variant="outline" size="sm" className="border-blue-200 text-blue-700">
                      <Link href={`/account/orders/${order.id}`}>
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-blue-100">
                          <Image
                            src={`/placeholder.svg?height=100&width=100`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-medium text-blue-900 hover:text-blue-700"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center text-sm text-blue-600">
                            <span>₦{item.price.toLocaleString()}</span>
                            <span className="mx-2">•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

