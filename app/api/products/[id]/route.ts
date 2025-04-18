import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Product from "@/models/product";

export async function GET(
  request: Request,
  params: Promise<{ params: { id: string } }>
) {
  try {
    const {
      params: { id },
    } = await params;

    await connectDb();
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

// PATCH product by ID
export async function PATCH(
  request: Request,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const {
      params: { id },
    } = await context;

    await connectDb();
    const data = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
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
  context: Promise<{ params: { id: string } }>
) {
  try {
    const {
      params: { id },
    } = await context;

    await connectDb();
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
