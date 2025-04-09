import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import JWT from "jsonwebtoken";
import connectDb from "@/db/connect";
import User from "@/models/users";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = JWT.verify(token.value, SECRET) as { userId: string };

    await connectDb();

    // Find the user
    const user = await User.findById(decoded.userId)
      .select("-password") // Exclude password from the
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}
