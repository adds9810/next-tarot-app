import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("🔥 [middleware] session:", session);

  const pathname = req.nextUrl.pathname;

  // 로그인 필요 페이지
  const protectedRoutes = ["/record", "/profile", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 보호된 경로 → 비로그인 상태면 로그인으로
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // /auth 경로 → /login, /signup으로 정리
  if (pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/auth/signup") {
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api).*)"], // 정적 자원 제외
};
