import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  console.log("URL:", requestUrl.toString());
  console.log("Search Params:", requestUrl.searchParams.toString());
  console.log("OAuth CODE:", code);

  // 리디렉션 경로 변경 (기존: /login)
  const redirectUrl = new URL("/", requestUrl.origin);

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(redirectUrl);
}
