"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, StarHalf, Search, Filter, Trash } from "lucide-react";
import PageLoading from "@/components/page-loading";

interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  role: string;
  rating: number;
  title: string;
  comment: string;
  content: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login?redirect=/admin/reviews");
      return;
    }

    fetchReviews();
  }, [user, router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: string, userName: string) => {
    if (
      !confirm(`Are you sure you want to delete the review by ${userName}?`)
    ) {
      return;
    }
    try {
      setLoading(true);

      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Review Deleted",
          description: `The review has been removed successfully`,
        });

        fetchReviews();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const filteredReviews = reviews
    .filter(
      (review) =>
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (review) =>
        ratingFilter === "all" ||
        review.rating === Number.parseInt(ratingFilter)
    );

  if (loading && !reviews.length) {
    return <PageLoading message="Loading reviews..." />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Review Management
          </h1>
          <p className="text-gray-600">Manage customer reviews and feedback</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No reviews found. Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg"
                        alt={review.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-xs text-gray-500">{review.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() =>
                      handleDeleteReview(review.id, review.userName)
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {review.comment}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm text-blue-600">
                    Product: {review.productName}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
