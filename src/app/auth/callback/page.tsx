"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");

      if (code) {
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Session exchange error:", error.message);
        }

        // 어쨌든 메인으로 이동
        router.replace("/");
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 중입니다...</p>
    </div>
  );
}
