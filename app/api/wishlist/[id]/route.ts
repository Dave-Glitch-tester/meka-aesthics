import { NextResponse } from "next/server"

// Use the same mock wishlist data from the main wishlist route
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const itemIndex = wishlistItems.findIndex((item) => item.id === id)

  if (itemIndex === -1) {
    return NextResponse.json({ message: "Wishlist item not found" }, { status: 404 })
  }

  // Remove item from wishlist
  const removedItem = wishlistItems.splice(itemIndex, 1)[0]

  return NextResponse.json(removedItem)
}

