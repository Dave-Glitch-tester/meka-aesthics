import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import wishlist from "@/models/wishlist";
import Product from "@/models/product";

export async function GET(request: Request) {
  try {
    await connectDb();

    // Get the authenticated user's ID from the request headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 }
      );
    }

    // Fetch wishlist items for the authenticated user
    const wishlistItems = await wishlist
      .find({ userId })
      .populate("product", "name price category");

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { message: "Failed to fetch wishlist items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDb();

    const data = await request.json();
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 }
      );
    }

    if (!data.productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if the product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the product is already in the wishlist
    const existingItem = await wishlist.findOne({
      userId,
      productId: data.productId,
    });

    if (existingItem) {
      return NextResponse.json(existingItem);
    }

    // Add new item to wishlist
    const newItem = await wishlist.create({
      userId,
      productId: data.productId,
      addedAt: new Date(),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { message: "Failed to add item to wishlist" },
      { status: 500 }
    );
  }
}
