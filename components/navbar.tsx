"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  Plus,
  ShieldCheck,
  Users,
  Package,
  Star,
  LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CartItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    quantity: number
  }
  quantity: number
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAdmin } = useAuth()

  // Regular user routes
  const regularRoutes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ]

  // Admin routes
  const adminRoutes = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/users", label: "Users" },
  ]

  // Use admin routes if user is admin, otherwise use regular routes
  const routes = isAdmin ? adminRoutes : regularRoutes

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
        setCartItemCount(data.reduce((total: number, item: CartItem) => total + item.quantity, 0))
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        // Immediately update the cart count before fetching the entire cart
        setCartItemCount((prevCount) => prevCount + 1)

        // Then refresh the cart items
        fetchCart()
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleNavigation = (href: string) => {
    // Close mobile menu if open
    setIsMenuOpen(false)

    // Navigate to the page
    router.push(href)

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-[#f8f5f0] text-gray-800 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Meka<span className="text-blue-600">Aesthetics</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  pathname === route.href ? "text-blue-600" : "text-gray-700",
                )}
              >
                {route.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAdmin && (
              <div className="relative" ref={cartRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>

                {isCartOpen && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50"
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-800">Your Cart</h3>
                      <p className="text-sm text-gray-600">{cartItemCount} items</p>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      {cartItems.length === 0 ? (
                        <div className="p-4 text-center text-gray-600">Your cart is empty</div>
                      ) : (
                        cartItems.map((item) => (
                          <div key={item.id} className="p-4 border-b border-gray-200 flex items-center">
                            <div className="relative h-12 w-12 rounded overflow-hidden mr-3">
                              <Image
                                src={item.product.imageUrl || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-600 mr-2">Qty: {item.quantity}</span>
                                  <button
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                    onClick={() => handleAddToCart(item.product.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                  ₦{(item.product.price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium text-gray-800">Total</span>
                        <span className="font-bold text-gray-800">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleNavigation("/cart")}
                      >
                        View Cart
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden sm:inline">{user.name}</span>
                    {isAdmin && <ShieldCheck className="h-3 w-3 ml-1 text-green-600" />}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="font-medium">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {isAdmin ? (
                    // Admin menu items
                    <DropdownMenuItem onClick={() => handleNavigation("/admin")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  ) : (
                    // Regular user menu items
                    <>
                      <DropdownMenuItem onClick={() => handleNavigation("/account")}>
                        <User className="mr-2 h-4 w-4" />
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/orders")}>
                        <Package className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => handleNavigation("/admin/products")}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Manage Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/admin/orders")}>
                        <Package className="mr-2 h-4 w-4" />
                        Manage Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/admin/reviews")}>
                        <Star className="mr-2 h-4 w-4" />
                        Manage Reviews
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation("/admin/users")}>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {!isAdmin && (
              <div className="relative mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  onClick={() => handleNavigation("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </div>
            )}

            <button className="text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => (
                <button
                  key={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600 p-2 rounded-md text-left",
                    pathname === route.href ? "bg-gray-200 text-blue-600" : "text-gray-700",
                  )}
                  onClick={() => handleNavigation(route.href)}
                >
                  {route.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center pt-4 border-t border-gray-200">
              {user ? (
                <div className="w-full">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="text-gray-700">{user.name}</span>
                    {isAdmin && <ShieldCheck className="h-4 w-4 ml-2 text-green-600" />}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => handleNavigation(isAdmin ? "/admin" : "/account")}
                    >
                      {isAdmin ? "Dashboard" : "Account"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleNavigation("/login")}>
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

