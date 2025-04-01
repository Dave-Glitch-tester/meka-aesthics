import { NextResponse } from "next/server"

// Mock cart data
const cartItems = [
  {
    id: "1",
    productId: "1",
    product: {
      id: "1",
      name: "Azure Ceramic Vase",
      price: 49.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      quantity: 15,
    },
    quantity: 1,
  },
  {
    id: "2",
    productId: "3",
    product: {
      id: "3",
      name: "Navy Blue Table Lamp",
      price: 79.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      quantity: 10,
    },
    quantity: 2,
  },
]

export async function GET() {
  // BACKEND INTEGRATION: In a real app, this would fetch the cart for the authenticated user
  // from your database, filtering by the user's ID
  return NextResponse.json(cartItems)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.productId || !data.quantity) {
      return NextResponse.json({ message: "Product ID and quantity are required" }, { status: 400 })
    }

    // Check if product exists in mock products
    const products = [
      {
        id: "1",
        name: "Azure Ceramic Vase",
        price: 49.99,
        imageUrl: "/placeholder.svg?height=400&width=400",
        quantity: 15,
      },
      {
        id: "2",
        name: "Sapphire Throw Pillow",
        price: 29.99,
        imageUrl: "/placeholder.svg?height=400&width=400",
        quantity: 25,
      },
      {
        id: "3",
        name: "Navy Blue Table Lamp",
        price: 79.99,
        imageUrl: "/placeholder.svg?height=400&width=400",
        quantity: 10,
      },
      {
        id: "4",
        name: "Teal Glass Candle Holder",
        price: 19.99,
        imageUrl: "/placeholder.svg?height=400&width=400",
        quantity: 30,
      },
    ]

    const product = products.find((p) => p.id === data.productId)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex((item) => item.productId === data.productId)

    if (existingItemIndex !== -1) {
      // Update quantity if already in cart
      cartItems[existingItemIndex].quantity += data.quantity

      // Check if quantity exceeds available stock
      if (cartItems[existingItemIndex].quantity > product.quantity) {
        cartItems[existingItemIndex].quantity = product.quantity
      }

      return NextResponse.json(cartItems[existingItemIndex])
    }

    // Add new item to cart
    const newItem = {
      id: (cartItems.length + 1).toString(),
      productId: data.productId,
      product,
      quantity: Math.min(data.quantity, product.quantity),
    }

    cartItems.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ message: "Failed to add item to cart" }, { status: 500 })
  }
}

