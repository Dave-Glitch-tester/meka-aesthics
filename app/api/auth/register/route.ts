import { NextResponse } from "next/server"

// Mock users data (same as in login/route.ts)
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
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email)

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password, // In a real app, this would be hashed
    }

    // Add user to mock database
    users.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

