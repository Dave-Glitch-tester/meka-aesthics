import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Product from "@/models/product"; // Assuming you have a Product model

// GET request to fetch a product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const id = params.id;

    // Fetch the product from the database
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PATCH request to update a product by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const id = params.id;
    const data = await request.json();

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE request to delete a product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb(); // Ensure database connection
    const id = params.id;

    // Delete the product from the database
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
