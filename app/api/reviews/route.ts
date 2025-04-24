import { NextRequest, NextResponse } from "next/server";
import Review from "@/models/reviews";
import Product from "@/models/product";
import connectDb from "@/db/connect";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const featured = searchParams.get("featured");

    // Build the query
    let query: any = {};
    if (productId) {
      query.productId = productId;
    }

    // Fetch reviews and populate references
    let reviews = await Review.find(query)
      .populate("user", "name role avatar")
      .populate("productId", "productName price category") // Populate product fields
      .sort({ createdAt: -1 });

    // Filter featured reviews (high ratings)
    if (featured === "true") {
      reviews = reviews.filter((review) => review.rating >= 4);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDb();
    const data = await request.json();
    console.log("Incoming review data:", data);

    const { productId, rating, title, comment, userId } = data;

    if (!productId || !rating || !title || !comment || !userId) {
      console.error("Missing required fields:", {
        productId,
        rating,
        title,
        comment,
        userId,
      });

      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error("Product not found:", productId);
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Create a new review
    const newReview = await Review.create({
      productId,
      user: userId,
      rating,
      title,
      comment,
      avatar: data.avatar || "/placeholder.svg?height=100&width=100",
    });

    // Populate the newly created review
    const populatedReview = await newReview
      .populate("user", "name role avatar")
      .populate("productId", "name price category")
      .execPopulate();

    console.log("Review created successfully:", populatedReview);

    return NextResponse.json(populatedReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
