"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import LoadingSpinner from "../loading-spinner";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]); // Array of product IDs in wishlist
  const [processingWishlist, setProcessingWishlist] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.slice(0, 4)); // Only show 4 featured products
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Fetch wishlist items when user is logged in
  useEffect(() => {
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

    fetchWishlist();
  }, [user]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "default",
      });
      router.push(`/login?redirect=/products/${productId}`);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleToggleWishlist = async (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to manage your wishlist",
        variant: "default",
      });
      router.push(`/login?redirect=/`);
      return;
    }

    setProcessingWishlist(product.id);

    try {
      const isInWishlist = wishlistItems.includes(product.id);

      if (isInWishlist) {
        // Find the wishlist item ID first
        const wishlistResponse = await fetch("/api/wishlist");
        if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist");

        const wishlistData = await wishlistResponse.json();
        const wishlistItem = wishlistData.find(
          (item: any) => item.productId === product.id
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

          setWishlistItems(wishlistItems.filter((id) => id !== product.id));
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} has been removed from your wishlist`,
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
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            productImageUrl: product.imageUrl,
            productCategory: product.category,
          }),
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");

        setWishlistItems([...wishlistItems, product.id]);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
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

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Featured Products
          </h2>
          <div className="flex justify-center mb-8">
            <LoadingSpinner size={40} />
          </div>
          <p className="text-center text-blue-700 mb-8">
            Loading our featured collections...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Featured Products
          </h2>
          <p className="text-center text-blue-700 mb-8">
            No featured products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden group">
                <Image
                  src={
                    product.imageUrl || "/placeholder.svg?height=400&width=400"
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleWishlist(product);
                  }}
                  disabled={processingWishlist === product.id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors z-10"
                  aria-label={
                    wishlistItems.includes(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
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
                <p className="text-blue-600 text-sm line-clamp-2 mt-1">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <p className="text-lg font-bold text-blue-800">
                  ₦{product.price.toLocaleString()}
                </p>
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild className="bg-blue-700 hover:bg-blue-800">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
