import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import JWT from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/cart", "/product"];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = JWT.verify(token.value, SECRET) as { userId: string };
      const response = NextResponse.next();

      // Attach user information to a custom header
      response.headers.set("x-user-id", decoded.userId);

      return response;
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/product/:path*"],
};
