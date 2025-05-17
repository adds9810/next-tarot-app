import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/"; // 기본 리디렉션 URL 설정

  console.log("OAuth CODE:", code);
  console.log("Redirect To:", redirectTo); // 리디렉션 URL 확인

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      await supabase.auth.exchangeCodeForSession(code); // 세션 교환
    } catch (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect("/login"); // 오류가 나면 로그인 페이지로 리디렉션
    }
  }

  // 리디렉션 경로로 이동
  const encodedRedirectTo = redirectTo.startsWith("/")
    ? `${requestUrl.origin}${redirectTo}` // 상대 경로 처리
    : redirectTo; // 절대 경로 그대로 사용
  return NextResponse.redirect(encodedRedirectTo);
}
