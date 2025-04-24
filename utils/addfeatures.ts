"use client";
import axios from "@/utils/fetch";
import { toast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";

// const router = useRouter();
export const handleAddToCart = async (productId: string, user: any) => {
  if (!user) {
    toast({
      title: "Login Required",
      description: "Please login to add items to your cart",
      variant: "default",
    });
    // router.push(`/login?redirect=/products/${productId}`);
    return;
  }

  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (!response.ok) throw new Error("Failed to add to cart");

    toast({
      title: "Success",
      description: "Item added to cart",
      variant: "default",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({
      title: "Error",
      description: "Failed to add item to cart",
      variant: "destructive",
    });
  }
};

// export const handleToggleWishlist = async (productId: string) => {
//   axios(`/api/wishlist/${productId}`);
// };

// export const fetchTestimonials = () => {};

// export const fetchCart = () => {};
// export const fetchProduct = () => {};
