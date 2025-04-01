"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/loading-spinner"

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
  category: string
  addedAt: string
}

export default function WishlistSection() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchWishlist()
  }, [])

  // BACKEND INTEGRATION: This function would fetch the user's wishlist from your database
  // You would implement a proper API endpoint that connects to your database
  // and returns the wishlist items with product details
  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist")
      if (response.ok) {
        const data = await response.json()

        // Transform the data to match our component's expected format
        const formattedData = data.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
          addedAt: item.addedAt,
        }))

        setWishlistItems(formattedData)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // BACKEND INTEGRATION: This function would remove an item from the wishlist
  // You would implement a proper API endpoint that connects to your database
  // and removes the item from the wishlist
  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))

        toast({
          title: "Item Removed",
          description: "Item has been removed from your wishlist",
        })
      } else {
        throw new Error("Failed to remove from wishlist")
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  // BACKEND INTEGRATION: This function would add the product to the cart
  // You would implement a proper API endpoint that connects to your database
  // and adds the product to the cart
  const handleAddToCart = async (productId: string, name: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        toast({
          title: "Added to Cart",
          description: `${name} has been added to your cart`,
        })
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const filteredItems = wishlistItems.filter((item) => {
    if (!searchQuery) return true
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        <CardTitle>My Wishlist</CardTitle>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            placeholder="Search wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">Your wishlist is empty</h3>
            <p className="text-blue-600 mb-6">
              {searchQuery ? "Try a different search term" : "Save items you love to your wishlist"}
            </p>
            {!searchQuery && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">Explore Products</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border border-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium text-blue-900 hover:text-blue-700 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-blue-600 text-sm mb-3">₦{item.price.toLocaleString()}</p>
                  <Button
                    onClick={() => handleAddToCart(item.productId, item.name)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

