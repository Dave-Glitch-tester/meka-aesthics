import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import users from "@/models/users";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if the email is already in use
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Check if this is the first user
    const isFirstUser = (await users.countDocuments()) === 0;

    // Create the new user
    const newUser = new users({
      email,
      password,
      name,
      role: isFirstUser ? "admin" : "user",
    });

    await newUser.save();

    const token = newUser.createToken();

    // Create a response object
    const response = NextResponse.json(
      { message: "User registered successfully", token },
      { status: 201 }
    );

    // Set cookie on response
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
