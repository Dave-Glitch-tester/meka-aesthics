"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types/product";
import Link from "next/link";

interface Review {
  _id: string;
  productId: string;
  userId: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    rating: 5,
    title: "",
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/product/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    const checkWishlistStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/wishlist");
        if (response.ok) {
          const wishlistItems = await response.json();
          const isInWishlist = wishlistItems.some(
            (item: any) => item.productId === id
          );
          setIsInWishlist(isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    if (id) {
      fetchProduct();
      fetchReviews();
      checkWishlistStatus();
    }
  }, [id, toast, user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "default",
      });
      router.push(`/login?redirect=/products/${id}`);
      return;
    }

    if (!product) return;

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      toast({
        title: "Success",
        description: `${quantity} item(s) added to cart`,
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

  // BACKEND INTEGRATION: This function would add the product to the user's wishlist
  // You would implement a proper API endpoint that connects to your database
  // and adds the product to the user's wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "default",
      });
      router.push(`/login?redirect=/products/${id}`);
      return;
    }

    if (!product) return;

    setIsAddingToWishlist(true);

    try {
      // If already in wishlist, we could remove it (toggle functionality)
      if (isInWishlist) {
        // Find the wishlist item ID first
        const wishlistResponse = await fetch("/api/wishlist");
        if (!wishlistResponse.ok) throw new Error("Failed to fetch wishlist");

        const wishlistItems = await wishlistResponse.json();
        const wishlistItem = wishlistItems.find(
          (item: any) => item.productId === id
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

          setIsInWishlist(false);
          toast({
            title: "Removed from Wishlist",
            description: `${product.productName} has been removed from your wishlist`,
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
            productId: product._id,
            userId: user.id,
          }),
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");

        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          description: `${product.productName} has been added to your wishlist`,
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
      setIsAddingToWishlist(false);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (!product) return;

    if (value < 1) {
      setQuantity(1);
    } else if (value > product.quantity) {
      setQuantity(product.quantity);
      toast({
        title: "Maximum Quantity",
        description: `Only ${product.quantity} items available`,
        variant: "default",
      });
    } else {
      setQuantity(value);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "default",
      });
      router.push(`/login?redirect=/products/${id}`);
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id, // Send the product ID
          rating: reviewFormData.rating, // Send the rating
          title: reviewFormData.title, // Send the title
          comment: reviewFormData.comment, // Send the comment
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();

      setReviews((prevReviews) => [newReview, ...prevReviews]);

      setReviewFormData({
        rating: 5,
        title: "",
        comment: "",
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="h-96 bg-blue-100 animate-pulse rounded-lg" />
            <div className="flex gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-20 bg-blue-100 animate-pulse rounded"
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="h-8 bg-blue-100 animate-pulse rounded mb-4 w-3/4" />
            <div className="h-6 bg-blue-100 animate-pulse rounded mb-4 w-1/4" />
            <div className="h-4 bg-blue-100 animate-pulse rounded mb-6 w-full" />
            <div className="h-4 bg-blue-100 animate-pulse rounded mb-2 w-full" />
            <div className="h-4 bg-blue-100 animate-pulse rounded mb-2 w-full" />
            <div className="h-4 bg-blue-100 animate-pulse rounded mb-8 w-3/4" />
            <div className="h-12 bg-blue-100 animate-pulse rounded mb-4 w-full" />
            <div className="h-12 bg-blue-100 animate-pulse rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Product Not Found
        </h2>
        <p className="text-blue-700 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    );
  }

  // Mock images for the product
  const productImages = [
    product.imageUrl || "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ];

  const averageRating = getAverageRating();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative h-96 rounded-lg overflow-hidden border border-blue-100">
            <Image
              src={productImages[activeImage] || "/placeholder.svg"}
              alt={product.productName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-20 rounded-md overflow-hidden border-2 transition-all ${
                  activeImage === index
                    ? "border-blue-600"
                    : "border-blue-100 hover:border-blue-300"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.productName} - view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {product.productName}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "fill-blue-500 text-blue-500"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-blue-700">({reviews.length} reviews)</span>
          </div>

          <p className="text-2xl font-bold text-blue-800 mb-6">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="text-blue-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Select Color</h3>
            <div className="flex gap-3">
              <button className="h-8 w-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-blue-600" />
              <button className="h-8 w-8 rounded-full bg-blue-400" />
              <button className="h-8 w-8 rounded-full bg-blue-800" />
              <button className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10 rounded-r-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="h-10 w-12 flex items-center justify-center border-y border-input">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={product.quantity <= quantity}
                className="h-10 w-10 rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <span className="ml-4 text-sm text-blue-600">
                {product.quantity} available
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={product.quantity <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant={isInWishlist ? "default" : "outline"}
              size="lg"
              className={
                isInWishlist
                  ? "border-blue-200 bg-pink-50 text-pink-600 hover:bg-pink-100"
                  : "border-blue-200 text-blue-700 hover:bg-blue-50"
              }
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
            >
              <Heart
                className={`mr-2 h-5 w-5 ${
                  isInWishlist ? "fill-pink-600" : ""
                }`}
              />
              {isAddingToWishlist
                ? "Processing..."
                : isInWishlist
                ? "In Wishlist"
                : "Add to Wishlist"}
            </Button>
          </div>

          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center text-blue-700 mb-2">
                <Truck className="mr-2 h-5 w-5" />
                <span className="font-medium">Free shipping</span>
              </div>
              <p className="text-sm text-blue-600">
                Free standard shipping on orders under ₦2000
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="border-b border-blue-100 w-full justify-start">
            <TabsTrigger value="description" className="text-blue-700">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-blue-700">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-blue-700">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <div className="prose prose-blue max-w-none">
              <p>{product.description}</p>
              <p>
                Our {product.productName} is crafted with attention to detail
                and made from high-quality materials to ensure durability and
                longevity. The elegant design adds a touch of sophistication to
                any room, making it a perfect addition to your home decor
                collection.
              </p>
              <p>
                The versatile nature of this piece allows it to complement
                various interior styles, from modern minimalist to classic
                traditional. Its blue tones create a calming atmosphere, perfect
                for relaxation and unwinding after a long day.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">Dimensions</span>
                <p className="text-blue-700">12" x 8" x 4"</p>
              </div>
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">Weight</span>
                <p className="text-blue-700">2.5 lbs</p>
              </div>
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">Material</span>
                <p className="text-blue-700">Ceramic, Glass</p>
              </div>
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">Color</span>
                <p className="text-blue-700">Blue, White, Navy</p>
              </div>
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">
                  Care Instructions
                </span>
                <p className="text-blue-700">Hand wash only</p>
              </div>
              <div className="border-b border-blue-100 pb-2">
                <span className="font-medium text-blue-900">
                  Country of Origin
                </span>
                <p className="text-blue-700">Nigeria</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            {user && (
              <Card className="mb-8 border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Rating
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReviewFormData({
                                ...reviewFormData,
                                rating: star,
                              })
                            }
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= reviewFormData.rating
                                  ? "fill-blue-500 text-blue-500"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="review-title"
                        className="block text-sm font-medium text-blue-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        id="review-title"
                        type="text"
                        value={reviewFormData.title}
                        onChange={(e) =>
                          setReviewFormData({
                            ...reviewFormData,
                            title: e.target.value,
                          })
                        }
                        required
                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Summarize your experience"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="review-comment"
                        className="block text-sm font-medium text-blue-700 mb-1"
                      >
                        Review
                      </label>
                      <textarea
                        id="review-comment"
                        value={reviewFormData.comment}
                        onChange={(e) =>
                          setReviewFormData({
                            ...reviewFormData,
                            comment: e.target.value,
                          })
                        }
                        required
                        rows={4}
                        className="w-full p-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Share your thoughts about this product"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {reviewsLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-blue-100 pb-6 animate-pulse"
                  >
                    <div className="h-6 bg-blue-100 rounded w-1/4 mb-2" />
                    <div className="h-4 bg-blue-100 rounded w-1/6 mb-2" />
                    <div className="h-4 bg-blue-100 rounded w-full mb-2" />
                    <div className="h-4 bg-blue-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-700 mb-4">
                  This product doesn't have any reviews yet.
                </p>
                {!user && (
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href={`/login?redirect=/products/${id}`}>
                      Login to Write a Review
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-blue-100 pb-6"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${
                              j < review.rating
                                ? "fill-blue-500 text-blue-500"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-blue-900">
                        {review.title}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      {review.name} - {formatDate(review.createdAt)}
                    </p>
                    <p className="text-blue-600">{review.comment}</p>
                  </div>
                ))}
                {reviews.length > 3 && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Load More Reviews
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
