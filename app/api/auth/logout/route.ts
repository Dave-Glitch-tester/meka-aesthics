import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  // Clear the JWT cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0), // Expire immediately
  });

  return response;
}
