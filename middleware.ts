import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./firebase/config";

export async function middleware(request: NextRequest) {
  const session = await auth.currentUser;
  console.log("session", session);

  if (!session && request.nextUrl.pathname.startsWith("/user")) {
    console.log("redirected to login!");
    // return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/user/:path*",
};
