import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await auth();

  const protectedRoutes = ["/dashboard"];

  const isAuth = !!session;
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isAuth) {
    const url = new URL(
      `/sign-in?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`,
      req.url
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

