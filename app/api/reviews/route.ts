import { NextResponse } from "next/server"

// Mock reviews data
const reviews = [
  {
    id: "1",
    productId: "1",
    productName: "Azure Ceramic Vase",
    userId: "user1",
    userName: "John D.",
    userRole: "Interior Designer",
    rating: 5,
    title: "Great product!",
    comment:
      "This is exactly what I was looking for to complete my living room. The quality is excellent and the blue color is perfect.",
    content:
      "This is exactly what I was looking for to complete my living room. The quality is excellent and the blue color is perfect.",
    createdAt: "2023-10-15T10:30:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    productId: "3",
    productName: "Navy Blue Table Lamp",
    userId: "user2",
    userName: "Sarah M.",
    userRole: "Home Decorator",
    rating: 4,
    title: "Love it!",
    comment:
      "The product exceeded my expectations. It's even more beautiful in person and the craftsmanship is outstanding.",
    content:
      "The product exceeded my expectations. It's even more beautiful in person and the craftsmanship is outstanding.",
    createdAt: "2023-11-20T14:45:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    productId: "4",
    productName: "Teal Glass Candle Holder",
    userId: "user3",
    userName: "Michael T.",
    userRole: "Verified Buyer",
    rating: 5,
    title: "Beautiful piece",
    comment:
      "I'm very happy with my purchase. The item arrived quickly and was well packaged. It looks stunning in my bedroom.",
    content:
      "I'm very happy with my purchase. The item arrived quickly and was well packaged. It looks stunning in my bedroom.",
    createdAt: "2023-12-05T09:15:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    productId: "2",
    productName: "Sapphire Throw Pillow",
    userId: "user4",
    userName: "Emma L.",
    userRole: "Home Stylist",
    rating: 4,
    title: "Elegant addition",
    comment:
      "This piece has transformed my living space. The colors are vibrant and the quality is excellent. Would definitely recommend!",
    content:
      "This piece has transformed my living space. The colors are vibrant and the quality is excellent. Would definitely recommend!",
    createdAt: "2024-01-10T16:20:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    productId: "1",
    productName: "Azure Ceramic Vase",
    userId: "user5",
    userName: "David W.",
    userRole: "Verified Buyer",
    rating: 5,
    title: "Exceeded expectations",
    comment:
      "The craftsmanship is impeccable. This piece has become the focal point of my living room and I've received many compliments.",
    content:
      "The craftsmanship is impeccable. This piece has become the focal point of my living room and I've received many compliments.",
    createdAt: "2024-02-18T11:05:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    productId: "3",
    productName: "Navy Blue Table Lamp",
    userId: "user6",
    userName: "Sophia K.",
    userRole: "Customer",
    rating: 3,
    title: "Good but not perfect",
    comment:
      "The quality is good but the color is slightly different from what was shown in the pictures. Still a nice addition to my home.",
    content:
      "The quality is good but the color is slightly different from what was shown in the pictures. Still a nice addition to my home.",
    createdAt: "2024-01-25T13:40:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "7",
    productId: "5",
    productName: "Indigo Wall Art",
    userId: "user7",
    userName: "Alex R.",
    userRole: "Art Enthusiast",
    rating: 5,
    title: "Stunning wall art",
    comment:
      "The colors are rich and vibrant, and the piece makes a bold statement in my living room. Everyone who visits comments on it!",
    content:
      "The colors are rich and vibrant, and the piece makes a bold statement in my living room. Everyone who visits comments on it!",
    createdAt: "2024-02-05T15:30:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "8",
    productId: "8",
    productName: "Royal Blue Throw Blanket",
    userId: "user8",
    userName: "Jessica T.",
    userRole: "Verified Buyer",
    rating: 5,
    title: "So cozy and beautiful",
    comment:
      "This blanket is not only gorgeous but incredibly soft and warm. The blue color is rich and adds a perfect accent to my neutral sofa.",
    content:
      "This blanket is not only gorgeous but incredibly soft and warm. The blue color is rich and adds a perfect accent to my neutral sofa.",
    createdAt: "2024-01-18T09:45:00Z",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const featured = searchParams.get("featured")

  let filteredReviews = [...reviews]

  // Filter by product ID if provided
  if (productId) {
    filteredReviews = filteredReviews.filter((review) => review.productId === productId)
  }

  // Filter featured reviews (high ratings)
  if (featured === "true") {
    filteredReviews = filteredReviews.filter((review) => review.rating >= 4)
  }

  // Sort by newest first
  filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(filteredReviews)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.productId || !data.userId || !data.rating || !data.title || !data.comment) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create new review
    const newReview = {
      id: (reviews.length + 1).toString(),
      productId: data.productId,
      productName: data.productName || "Product",
      userId: data.userId,
      userName: data.userName || "Anonymous",
      userRole: data.userRole || "Customer",
      rating: Number(data.rating),
      title: data.title,
      comment: data.comment,
      content: data.comment,
      createdAt: new Date().toISOString(),
      avatar: data.avatar || "/placeholder.svg?height=100&width=100",
    }

    // In a real app, this would save to a database
    reviews.push(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Failed to create review" }, { status: 500 })
  }
}

