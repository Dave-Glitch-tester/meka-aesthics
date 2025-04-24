"use client";

import ReviewsDisplay from "./all-reviews";
import { Suspense } from "react";
import PageLoading from "@/components/page-loading";

async function fetchReviews() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`,
    {
      cache: "no-store", // Disable caching for fresh data
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

export default async function ReviewsPage() {
  let reviews = [];

  try {
    reviews = await fetchReviews();
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <Suspense fallback={<PageLoading message="Loading reviews..." />}>
      <ReviewsDisplay reviews={reviews} />
    </Suspense>
  );
}
