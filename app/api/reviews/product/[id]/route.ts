import { NextResponse } from "next/server"

// Use the same mock reviews data from the main reviews route
const reviews = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "John D.",
    rating: 5,
    title: "Great product!",
    comment:
      "This is exactly what I was looking for to complete my living room. The quality is excellent and the blue color is perfect.",
    createdAt: "2023-10-15T10:30:00Z",
  },
  {
    id: "2",
    productId: "3",
    userId: "user2",
    userName: "Sarah M.",
    rating: 4,
    title: "Love it!",
    comment:
      "The product exceeded my expectations. It's even more beautiful in person and the craftsmanship is outstanding.",
    createdAt: "2023-11-20T14:45:00Z",
  },
  {
    id: "3",
    productId: "4",
    userId: "user3",
    userName: "Michael T.",
    rating: 5,
    title: "Beautiful piece",
    comment:
      "I'm very happy with my purchase. The item arrived quickly and was well packaged. It looks stunning in my bedroom.",
    createdAt: "2023-12-05T09:15:00Z",
  },
  {
    id: "4",
    productId: "2",
    userId: "user4",
    userName: "Emma L.",
    rating: 4,
    title: "Elegant addition",
    comment:
      "This piece has transformed my living space. The colors are vibrant and the quality is excellent. Would definitely recommend!",
    createdAt: "2024-01-10T16:20:00Z",
  },
  {
    id: "5",
    productId: "1",
    userId: "user5",
    userName: "David W.",
    rating: 5,
    title: "Exceeded expectations",
    comment:
      "The craftsmanship is impeccable. This piece has become the focal point of my living room and I've received many compliments.",
    createdAt: "2024-02-18T11:05:00Z",
  },
  {
    id: "6",
    productId: "3",
    userId: "user6",
    userName: "Sophia K.",
    rating: 3,
    title: "Good but not perfect",
    comment:
      "The quality is good but the color is slightly different from what was shown in the pictures. Still a nice addition to my home.",
    createdAt: "2024-01-25T13:40:00Z",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const productId = params.id

  // Filter reviews for the specific product
  const productReviews = reviews.filter((review) => review.productId === productId)

  // Sort by newest first
  productReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(productReviews)
}

