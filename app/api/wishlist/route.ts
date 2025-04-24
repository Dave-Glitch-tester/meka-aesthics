import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Wishlist from "@/models/wishlist";
import Product from "@/models/product";
import JWT from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function GET(request: Request) {
  try {
    await connectDb();

    // Get the token from cookies
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    // Decode the token to get the userId
    const decoded = JWT.verify(token, SECRET) as { userId: string };
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Fetch wishlist items for the authenticated user
    const wishlistItems = await Wishlist.find({ userId }).populate(
      "productId",
      "name price category"
    );

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

    // Get the token from cookies
    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Authentication token is missing" },
        { status: 401 }
      );
    }

    // Decode the token to get the userId
    const decoded = JWT.verify(token, SECRET) as { userId: string };
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Parse the request body
    const data = await request.json();

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
    const existingItem = await Wishlist.findOne({
      userId,
      productId: data.productId,
    });

    if (existingItem) {
      return NextResponse.json(existingItem);
    }

    // Add new item to wishlist
    const newItem = await Wishlist.create({
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
