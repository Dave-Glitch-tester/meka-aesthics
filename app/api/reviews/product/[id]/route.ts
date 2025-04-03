import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Review from "@/models/reviews";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const productId = params.id;

    // Fetch reviews for the specific product from the database
    const productReviews = await Review.find({ productId })
      .sort({
        createdAt: -1,
      })
      .populate("product")
      .populate("Users"); // Sort by newest first

    return NextResponse.json(productReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
