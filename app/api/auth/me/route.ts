import { NextResponse } from "next/server"

// For demo purposes, we'll return a mock user
// In a real app, this would verify the session or JWT token
export async function GET() {
  // Mock authenticated user
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user", // Default role is user
  }

  // For demo purposes, let's also have an admin user
  // In a real implementation, this would come from your database
  if (user.email === "admin@example.com") {
    user.role = "admin"
  }

  // Simulate not authenticated (comment out to simulate logged in)
  // return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  return NextResponse.json(user)
}

