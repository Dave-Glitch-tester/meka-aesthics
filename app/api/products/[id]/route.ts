import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Product from "@/models/product";

// GET product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const product = await Product.findById(params.id);

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

// PATCH product by ID
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const data = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
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

// DELETE product by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const deletedProduct = await Product.findByIdAndDelete(params.id);

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
