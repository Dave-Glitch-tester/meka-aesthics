"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  CreditCard,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface CartItem {
  _id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]); // Array of product IDs in wishlist
  const [processingWishlist, setProcessingWishlist] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    fetchCart();
    fetchWishlist();
  }, [user, router, toast]);

  // BACKEND INTEGRATION: This function would fetch the user's cart from your database
  // You would implement a proper API endpoint that connects to your database
  // and returns the cart items with product details
  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      console.log(data);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        // Extract product IDs from wishlist items
        const wishlistProductIds = data.map((item: any) => item.productId);
        setWishlistItems(wishlistProductIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // BACKEND INTEGRATION: This function would update the quantity of an item in the cart
  // You would implement a proper API endpoint that connects to your database
  // and updates the quantity with validation against available stock

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast({
        title: "Success",
        description: "Cart updated",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  // // BACKEND INTEGRATION: This function would remove an item from the cart
  // // You would implement a proper API endpoint that connects to your database
  // // and removes the item from the cart

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      setCartItems((prev) => prev.filter((item) => item._id !== itemId));

      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const handleToggleWishlist = async (item: CartItem) => {
    if (!user) return;

    setProcessingWishlist(item.productId);

    try {
      const isInWishlist = wishlistItems.includes(item.productId);

      if (isInWishlist) {
        // Find the wishlist item ID first
        const wishlistResponse = await fetch("/api/wishlist");
        if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist");

        const wishlistData = await wishlistResponse.json();
        const wishlistItem = wishlistData.find(
          (wItem: any) => wItem.productId === item.productId
        );

        if (wishlistItem) {
          const deleteResponse = await fetch(
            `/api/wishlist/${wishlistItem.id}`,
            {
              method: "DELETE",
            }
          );

          if (!deleteResponse.ok)
            throw new Error("Failed to remove from wishlist");

          setWishlistItems(wishlistItems.filter((id) => id !== item.productId));
          toast({
            title: "Removed from Wishlist",
            description: `${item.product.name} has been removed from your wishlist`,
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.productId,
            productName: item.product.name,
            productPrice: item.product.price,
            productImageUrl: item.product.imageUrl,
            productCategory: "category",
          }),
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");

        setWishlistItems([...wishlistItems, item.productId]);
        toast({
          title: "Added to Wishlist",
          description: `${item.product.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setProcessingWishlist(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 20000 ? 0 : 2000;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.075;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  // BACKEND INTEGRATION: This function would create an order from the cart items
  // You would implement a proper API endpoint that connects to your database
  // and creates an order, processes payment, and clears the cart
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      // In a real implementation, this would:
      // 1. Create an order in your database
      // 2. Process payment through a payment gateway
      // 3. Clear the cart
      // 4. Redirect to an order confirmation page

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed!",
      });

      router.push("/orders");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        title: "Checkout Failed",
        description:
          "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Your Cart</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="mb-4 p-4 border border-blue-100 rounded-lg animate-pulse"
              >
                <div className="flex items-center">
                  <div className="h-24 w-24 bg-blue-100 rounded" />
                  <div className="ml-4 flex-1">
                    <div className="h-6 bg-blue-100 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-blue-100 rounded w-1/4" />
                  </div>
                  <div className="h-8 w-24 bg-blue-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-1/3">
            <div className="h-64 bg-blue-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <div className="inline-flex justify-center items-center w-24 h-24 bg-blue-50 rounded-full mb-6">
            <ShoppingCart className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-medium text-blue-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-blue-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <Card
                key={item._id}
                className="mb-4 border-0 shadow-md overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <Image
                        src={
                          item.product.imageUrl ||
                          "/placeholder.svg?height=200&width=200" ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="sm:ml-4 flex-1 text-center sm:text-left mt-4 sm:mt-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-blue-900 hover:text-blue-700 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-blue-600 text-sm">
                        ₦{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="h-8 w-10 flex items-center justify-center border-y border-input text-sm">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.min(item.product.quantity, item.quantity + 1)
                          )
                        }
                        disabled={item.quantity >= item.product.quantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      {/* Wishlist button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => handleToggleWishlist(item)}
                        disabled={processingWishlist === item.productId}
                        aria-label={
                          wishlistItems.includes(item.productId)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlistItems.includes(item.productId)
                              ? "fill-pink-500 text-pink-500"
                              : "text-gray-400 hover:text-pink-500"
                          }`}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:w-1/3">
            <Card className="border-0 shadow-md sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Subtotal</span>
                    <span className="font-medium text-blue-900">
                      ₦{calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Shipping</span>
                    <span className="font-medium text-blue-900">
                      {calculateShipping() === 0
                        ? "Free"
                        : `₦${calculateShipping().toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tax</span>
                    <span className="font-medium text-blue-900">
                      ₦{calculateTax().toLocaleString()}
                    </span>
                  </div>
                  <Separator className="my-2 bg-blue-100" />
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">Total</span>
                    <span className="font-bold text-blue-900">
                      ₦{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout <CreditCard className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
