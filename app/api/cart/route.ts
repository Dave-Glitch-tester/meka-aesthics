import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Cart from "@/models/cart";
import Product from "@/models/product";
import JWT from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(request: Request) {
  try {
    await connectDb(); // Ensure database connection

    // Get the token from cookies
    const cookieHeader = request.headers.get("cookie");
    console.log(cookieHeader)
    const token = cookieHeader?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];

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

    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
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

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({
      userId,
      product: product._id,
    });

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      existingCartItem.quantity += data.quantity;

      // Ensure the quantity does not exceed available stock
      if (existingCartItem.quantity > product.quantity) {
        existingCartItem.quantity = product.quantity;
      }

      await existingCartItem.save();
      return NextResponse.json(existingCartItem);
    }

    // Add a new item to the cart
    const newCartItem = await Cart.create({
      userId,
      product: product._id, // Use the product's ObjectId
      quantity: Math.min(data.quantity, product.quantity), // Ensure quantity does not exceed stock
    });

    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}