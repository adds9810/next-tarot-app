import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("🔥 [middleware] session:", session);

  const { pathname } = req.nextUrl;

  // 인증이 필요한 페이지 경로
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/record",
    "/reading",
    "/community",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 인증이 필요한데 로그인 안된 경우
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 이미 로그인된 사용자가 /login, /signup 접근 시 리디렉트
  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL("/", req.url)); // 또는 /dashboard 등 원하는 위치
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/record",
    "/record/:path*",
    "/reading",
    "/reading/:path*",
    "/community",
    "/community/:path*",
    "/login",
    "/signup",
    "/auth/callback",
  ],
};
