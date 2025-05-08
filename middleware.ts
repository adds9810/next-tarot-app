import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 보호된 경로
  const protectedRoutes = ["/record", "/record/create", "/record/", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 보호된 경로인데 세션이 없으면 로그인 페이지로 리디렉트
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("message", "회원만 접근 가능한 페이지입니다.");
    return NextResponse.redirect(loginUrl);
  }

  // /auth 경로 → /login 또는 /signup 으로 정리
  if (pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/auth/signup") {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/record",
    "/record/:path*",
    "/profile",
    "/auth/login",
    "/auth/signup",
  ],
};
