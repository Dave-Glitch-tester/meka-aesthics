"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Star, Search, Filter } from "lucide-react";

interface Review {
  _id: string;
  productId: string;
  productName: string;
  userId: string;
  name: string;
  role: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  avatar: string;
}

interface ReviewsDisplayProps {
  reviews: Review[];
}

export default function ReviewsDisplay({ reviews }: ReviewsDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews
    .filter(
      (review) =>
        review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (review) =>
        ratingFilter === "all" ||
        review.rating === Number.parseInt(ratingFilter)
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          Customer Reviews
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See what our customers are saying about our products. We're proud to
          have earned their trust and satisfaction.
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-48">
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
        <div className="text-center py-12 bg-gray-50 rounded-lg max-w-4xl mx-auto">
          <p className="text-gray-500">
            No reviews found. Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredReviews.map((review) => (
            <Card
              key={review._id}
              className="overflow-hidden shadow-md border-0 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={
                        review.avatar || "/placeholder.svg?height=100&width=100"
                      }
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold mb-2">{review.title}</h3>
                <p className="text-gray-700 mb-3">{review.comment}</p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/products/${review.productId}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                  >
                    View {review.productName}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
