import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Review from "@/models/reviews";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id: productId } = context.params;

    await connectDb();

    const productReviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .populate("products")
      .populate("Users");

    return NextResponse.json(productReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
