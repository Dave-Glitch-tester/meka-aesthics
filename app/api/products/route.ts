import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import Product from "@/models/product";

export async function GET(request: Request) {
  try {
    await connectDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";

    const query: any = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by search query
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Filter featured products
    if (featured === "true") {
      query.featured = true;
    }

    // Sorting logic
    let sortOption: any = {};
    switch (sort) {
      case "price-low":
        sortOption.price = 1; // Ascending order
        break;
      case "price-high":
        sortOption.price = -1; // Descending order
        break;
      case "newest":
        sortOption.createdAt = -1; // Newest first
        break;
      case "popular":
        // Example: Sort by a popularity field (if available)
        sortOption.popularity = -1;
        break;
      default:
        sortOption.createdAt = -1; // Default to newest
        break;
    }

    // Fetch products from the database
    const products = await Product.find(query).sort(sortOption);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDb(); // Ensure database connection
    const { productName, price, description, category, featured, quantity } =
      await request.json();

    // Validate required fields
    if (!productName || !price || !category || !description || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = await Product.create({
      productName,
      category,
      description,
      price,
      quantity,
      featured: featured || false,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
