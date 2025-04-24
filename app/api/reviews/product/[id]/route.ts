import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Review from "@/models/reviews";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id: productId } = context.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    // Database connection with error handling
    await connectDb().catch(() => {
      throw new Error("Database connection failed");
    });

    // Fetch reviews with secure population
    const productReviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name", // Only include public fields
        model: "User",
      })
      .populate({
        path: "product",
        select: "productName price",
        model: "Product",
      })
      .lean();

    // Format response data
    const sanitizedReviews = productReviews.map((review) => ({
      ...review,
      user: {
        name: review.user.name,
      },
      product: {
        productName: review.product.name,
        price: review.product.price,
      },
    }));

    return NextResponse.json(sanitizedReviews, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    const status = error instanceof Error ? 500 : 500;
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to fetch reviews",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status }
    );
  }
}
