import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  const { data: session, error } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: baseURL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (error) {
    console.error("Failed to fetch session:", error);
    return NextResponse.next(); // Handle error appropriately
  }

  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/register";

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};