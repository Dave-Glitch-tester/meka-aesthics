import { NextResponse } from "next/server"

// Mock wishlist data
const wishlistItems = [
  {
    id: "w1",
    userId: "1",
    productId: "1",
    product: {
      id: "1",
      name: "Azure Ceramic Vase",
      price: 49.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "living-room",
    },
    addedAt: new Date().toISOString(),
  },
  {
    id: "w2",
    userId: "1",
    productId: "3",
    product: {
      id: "3",
      name: "Navy Blue Table Lamp",
      price: 79.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      category: "bedroom",
    },
    addedAt: new Date().toISOString(),
  },
]

export async function GET() {
  // In a real app, this would filter wishlist items for the authenticated user
  return NextResponse.json(wishlistItems)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    // Check if product already exists in wishlist
    const existingItem = wishlistItems.find(
      (item) => item.productId === data.productId && item.userId === "1", // In a real app, use the authenticated user's ID
    )

    if (existingItem) {
      return NextResponse.json(existingItem)
    }

    // Add new item to wishlist
    const newItem = {
      id: `w${wishlistItems.length + 1}`,
      userId: "1", // In a real app, use the authenticated user's ID
      productId: data.productId,
      product: {
        id: data.productId,
        name: data.productName || "Product Name",
        price: data.productPrice || 0,
        imageUrl: data.productImageUrl || "/placeholder.svg?height=400&width=400",
        category: data.productCategory || "category",
      },
      addedAt: new Date().toISOString(),
    }

    wishlistItems.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ message: "Failed to add item to wishlist" }, { status: 500 })
  }
}

