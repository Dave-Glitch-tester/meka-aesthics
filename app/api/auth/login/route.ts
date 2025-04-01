import { NextResponse } from "next/server"

// Mock users data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password456", // In a real app, this would be hashed
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "user1",
    name: "Regular User",
    email: "user@example.com",
    password: "password", // In a real app, this would be hashed
    role: "user",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // In a real app, this would set a session or JWT token
    // For demo purposes, we'll just return the user without the password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

