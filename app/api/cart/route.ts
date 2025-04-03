import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Cart from "@/models/cart";
import Product from "@/models/product"; // Assuming you have a Product model

// GET request to fetch the cart for the authenticated user
export async function GET(request: Request) {
  try {
    await connectDb();

    // Replace this with actual user authentication logic
    const userId = "authenticated-user-id"; // Replace with the authenticated user's ID

    // Fetch the cart items for the user
    const cartItems = await Cart.find({ userId }).populate("product");

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

// POST request to add an item to the cart
export async function POST(request: Request) {
  try {
    await connectDb(); // Ensure database connection
    const data = await request.json();

    if (!data.productId || !data.quantity) {
      return NextResponse.json(
        { message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // Replace this with actual user authentication logic
    const userId = request.headers.get("x-user-id");

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
      "product.id": data.productId,
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
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
      quantity: Math.min(data.quantity, product.quantity),
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
