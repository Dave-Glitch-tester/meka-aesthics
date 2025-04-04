import { NextResponse } from "next/server";
import connectDb from "@/db/connect";
import UserSchema from "@/models/users";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    // Find user by email
    const user = await UserSchema.findOne({ email }).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate token
    const token = user.createToken();
    // Create response object
    const response = NextResponse.json(user);
    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
