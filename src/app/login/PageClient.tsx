"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/LoadingIndicator";
import Link from "next/link";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const message = searchParams.get("message");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.push(redirect);
    } catch (err) {
      console.error("Login error:", err);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSocialLogin = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) setError(error.message);
    } catch (err) {
      console.error("Social login error:", err);
      setError("소셜 로그인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("signup_message");
    const redirectMessage = searchParams.get("message");

    if (storedMessage) {
      toast({
        title: "회원가입 완료",
        description: storedMessage,
        duration: 5000,
      });
      localStorage.removeItem("signup_message");
    }

    if (redirectMessage) {
      toast({
        title: "로그인이 필요합니다.",
        description: redirectMessage,
        variant: "destructive",
        duration: 5000,
      });

      // URL 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <section
      className="relative py-10 w-dvw px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="로그인 섹션"
    >
      <div className="relative z-20 text-center w-full max-w-lg mx-auto">
        <section
          className="mb-8 space-y-4 animate-fade-in"
          aria-label="서비스 소개"
        >
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            별의 문을 열고
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            오늘의 감정 여정을 다시 이어가세요.
          </p>
        </section>

        <div className="w-full max-w-sm mx-auto animate-fade-up ">
          <div className="p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-left">
                <Label
                  htmlFor="email"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신의 별자리 주소는?
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해주세요"
                  required
                  aria-required="true"
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                />
              </div>

              <div className="text-left">
                <Label
                  htmlFor="password"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  별빛을 열 수 있는 비밀 열쇠
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  required
                  aria-required="true"
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                />
              </div>

              {error && (
                <div
                  className="text-red-400 text-sm text-center font-body"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="px-6 py-3 w-full min-w-[200px] bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
              >
                별의 문 열기
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FFD700]/20"></div>
              </div>
              <div className="relative bg-[#281C40] px-4 text-sm text-[#BFA2DB] font-body">
                또는
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("google" as Provider)}
              className="w-full flex items-center justify-center gap-3 bg-white/90 text-gray-800 hover:bg-white transition-colors text-base focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
              aria-label="Google로 별자리 연결하기"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google로 별자리 연결하기
            </Button>

            <div className="mt-6 text-center text-base text-[#BFA2DB] font-body">
              <p>
                아직 별자리가 없으신가요?{" "}
                <Link
                  href="/signup"
                  className="text-[#FFD700] hover:text-[#FFE566] transition-colors hover:underline decoration-[#FFD700]/30 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-sm block md:inline"
                >
                  내 별자리 등록하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PageClient() {
  return (
    <Suspense
      fallback={<LoadingIndicator message="🌠 별빛을 모으는 중이에요" />}
    >
      <LoginInner />
    </Suspense>
  );
}
