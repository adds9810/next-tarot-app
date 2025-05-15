import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  console.log("URL:", requestUrl.toString());
  console.log("Search Params:", requestUrl.searchParams.toString());
  console.log("OAuth CODE:", code);

  // 항상 루트로 리디렉션 (메시지는 localStorage로 처리)
  const redirectUrl = new URL("/login", requestUrl.origin);

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(redirectUrl);
}
