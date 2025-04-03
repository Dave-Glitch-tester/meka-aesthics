import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Cart from "@/models/cart"; // Assuming you have a Cart model

// PATCH request to update a cart item
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const id = params.id;
    const data = await request.json();

    // Find the cart item by ID
    const cartItem = await Cart.findById(id);
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Update quantity if provided
    if (data.quantity !== undefined) {
      if (data.quantity <= 0) {
        return NextResponse.json(
          { message: "Quantity must be greater than 0" },
          { status: 400 }
        );
      }

      // Ensure quantity does not exceed available stock
      if (data.quantity > cartItem.product.quantity) {
        data.quantity = cartItem.product.quantity;
      }

      cartItem.quantity = data.quantity;
    }

    await cartItem.save(); // Save the updated cart item
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE request to remove a cart item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const id = params.id;

    // Find and delete the cart item by ID
    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { message: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
