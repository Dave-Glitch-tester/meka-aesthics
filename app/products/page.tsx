"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Filter, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [wishlistItems, setWishlistItems] = useState<string[]>([]) // Array of product IDs in wishlist
  const [processingWishlist, setProcessingWishlist] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/api/products"
        const params = new URLSearchParams()

        if (category !== "all") {
          params.append("category", category)
        }

        if (searchQuery) {
          params.append("search", searchQuery)
        }

        params.append("sort", sortBy)

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [toast, category, searchQuery, sortBy])

  // Fetch wishlist items when user is logged in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return

      try {
        const response = await fetch("/api/wishlist")
        if (response.ok) {
          const data = await response.json()
          // Extract product IDs from wishlist items
          const wishlistProductIds = data.map((item: any) => item.productId)
          setWishlistItems(wishlistProductIds)
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      }
    }

    fetchWishlist()
  }, [user])

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "default",
      })
      router.push(`/login?redirect=/products/${productId}`)
      return
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (!response.ok) throw new Error("Failed to add to cart")

      toast({
        title: "Success",
        description: "Item added to cart",
        variant: "default",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleToggleWishlist = async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to manage your wishlist",
        variant: "default",
      })
      router.push(`/login?redirect=/products`)
      return
    }

    setProcessingWishlist(product.id)

    try {
      const isInWishlist = wishlistItems.includes(product.id)

      if (isInWishlist) {
        // Find the wishlist item ID first
        const wishlistResponse = await fetch("/api/wishlist")
        if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist")

        const wishlistData = await wishlistResponse.json()
        const wishlistItem = wishlistData.find((item: any) => item.productId === product.id)

        if (wishlistItem) {
          const deleteResponse = await fetch(`/api/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
          })

          if (!deleteResponse.ok) throw new Error("Failed to remove from wishlist")

          setWishlistItems(wishlistItems.filter((id) => id !== product.id))
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} has been removed from your wishlist`,
          })
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImageUrl: product.imageUrl,
            productCategory: product.category,
          }),
        })

        if (!response.ok) throw new Error("Failed to add to wishlist")

        setWishlistItems([...wishlistItems, product.id])
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        })
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setProcessingWishlist(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Our Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-40">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="living-room">Living Room</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="rounded-lg overflow-hidden">
              <div className="h-64 bg-blue-100 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-blue-100 animate-pulse rounded mb-2" />
                <div className="h-4 bg-blue-100 animate-pulse rounded w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="h-6 bg-blue-100 animate-pulse rounded w-1/4" />
                <div className="h-10 bg-blue-100 animate-pulse rounded w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-blue-800 mb-2">No products found</h3>
          <p className="text-blue-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setCategory("all")
              setSortBy("newest")
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative h-64 overflow-hidden group">
                <Image
                  src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.quantity <= 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleToggleWishlist(product)
                  }}
                  disabled={processingWishlist === product.id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors z-10"
                  aria-label={wishlistItems.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlistItems.includes(product.id)
                        ? "fill-pink-500 text-pink-500"
                        : "text-gray-400 hover:text-pink-500"
                    }`}
                  />
                </button>
              </div>
              <CardContent className="p-4">
                <Link
                  href={`/products/${product.id}`}
                  className="text-lg font-medium text-blue-900 hover:text-blue-700 transition-colors line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-blue-600 text-sm line-clamp-2 mt-1">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="text-lg font-bold text-blue-800">₦{product.price.toLocaleString()}</p>
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                  disabled={product.quantity <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

