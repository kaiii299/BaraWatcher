import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: baseURL ,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

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