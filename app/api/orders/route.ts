import { NextResponse } from "next/server"

// Mock orders data
const orders = [
  {
    id: "1",
    userId: "1",
    items: [
      {
        productId: "1",
        name: "Azure Ceramic Vase",
        price: 49.99,
        quantity: 1,
      },
      {
        productId: "3",
        name: "Navy Blue Table Lamp",
        price: 79.99,
        quantity: 2,
      },
    ],
    total: 209.97,
    status: "delivered",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    items: [
      {
        productId: "2",
        name: "Sapphire Throw Pillow",
        price: 29.99,
        quantity: 3,
      },
    ],
    total: 89.97,
    status: "processing",
    createdAt: "2023-06-20T14:45:00Z",
  },
]

export async function GET() {
  // In a real app, this would fetch orders for the authenticated user
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ message: "Order must contain at least one item" }, { status: 400 })
    }

    // Calculate total
    const total = data.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // Create new order
    const newOrder = {
      id: (orders.length + 1).toString(),
      userId: "1", // In a real app, this would be the authenticated user's ID
      items: data.items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Add order to mock database
    orders.push(newOrder)

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}

