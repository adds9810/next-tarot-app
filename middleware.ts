import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 인증이 필요한 경로들
  const protectedRoutes = ["/dashboard", "/profile", "/readings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // 인증이 필요한 페이지에 접근하려 할 때 로그인이 안되어있으면 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하려 하면 대시보드로 리다이렉트
  if (
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") &&
    session
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/readings/:path*",
    "/login",
    "/signup",
    "/auth/callback",
  ],
};
