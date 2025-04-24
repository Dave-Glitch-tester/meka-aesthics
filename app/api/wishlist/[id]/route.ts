import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Wishlist from "@/models/wishlist";

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDb();
    const id = params.id;

    // Find and delete the wishlist item by ID
    const removedItem = await Wishlist.findByIdAndDelete(id);

    if (!removedItem) {
      return NextResponse.json(
        { message: "Wishlist item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(removedItem);
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json(
      { message: "Failed to delete wishlist item" },
      { status: 500 }
    );
  }
}
