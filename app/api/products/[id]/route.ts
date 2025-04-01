import { NextResponse } from "next/server"

// Mock products data (same as in route.ts)
const products = [
  {
    id: "1",
    name: "Azure Ceramic Vase",
    description:
      "A beautiful handcrafted ceramic vase in a stunning azure blue color. Perfect for displaying fresh or dried flowers.",
    price: 49.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "living-room",
    quantity: 15,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sapphire Throw Pillow",
    description: "Add a touch of elegance to your sofa or bed with this luxurious sapphire blue throw pillow.",
    price: 29.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "living-room",
    quantity: 25,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Navy Blue Table Lamp",
    description: "A stylish navy blue table lamp with a brass base, perfect for your bedside table or office desk.",
    price: 79.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "bedroom",
    quantity: 10,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Teal Glass Candle Holder",
    description: "Create a warm ambiance with this teal glass candle holder, designed to complement any room decor.",
    price: 19.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "living-room",
    quantity: 30,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Indigo Wall Art",
    description: "Abstract indigo wall art that adds a sophisticated touch to your living space or office.",
    price: 89.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "living-room",
    quantity: 8,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Cobalt Blue Dinner Set",
    description: "A stunning 12-piece cobalt blue dinner set that will impress your guests at your next dinner party.",
    price: 129.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "kitchen",
    quantity: 5,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Sky Blue Bathroom Accessories",
    description:
      "Complete bathroom accessory set in a calming sky blue color, including soap dispenser, toothbrush holder, and more.",
    price: 39.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "bathroom",
    quantity: 12,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Royal Blue Throw Blanket",
    description: "Soft and cozy royal blue throw blanket, perfect for those chilly evenings on the couch.",
    price: 59.99,
    imageUrl: "/placeholder.svg?height=400&width=400",
    category: "bedroom",
    quantity: 18,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    const data = await request.json()
    const updatedProduct = {
      ...products[productIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would update the database
    products[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const productIndex = products.findIndex((p) => p.id === id)

  if (productIndex === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  // In a real app, this would delete from the database
  const deletedProduct = products.splice(productIndex, 1)[0]

  return NextResponse.json(deletedProduct)
}

