import { NextResponse } from "next/server"

// Mock products data
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const featured = searchParams.get("featured")
  const sort = searchParams.get("sort") || "newest"

  let filteredProducts = [...products]

  // Filter by category
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  // Filter by search query
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
    )
  }

  // Filter featured products
  if (featured === "true") {
    filteredProducts = filteredProducts.filter((product) => product.featured === true)
  }

  // Sort products
  switch (sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "popular":
      // In a real app, this would sort by popularity metrics
      // For now, we'll just randomize
      filteredProducts.sort(() => Math.random() - 0.5)
      break
    case "newest":
    default:
      // Already sorted by newest (mock data)
      break
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new product
    const newProduct = {
      id: (products.length + 1).toString(),
      name: data.name,
      description: data.description || "",
      price: Number.parseFloat(data.price),
      imageUrl: data.imageUrl || "/placeholder.svg?height=400&width=400",
      category: data.category,
      quantity: Number.parseInt(data.quantity) || 0,
      featured: data.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, this would save to a database
    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 })
  }
}

