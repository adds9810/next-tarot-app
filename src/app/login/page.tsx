"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Provider } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

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

      router.push("/");
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
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.error("Social login error:", err);
      setError("소셜 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <section
      className="relative relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="로그인 섹션"
    >
      <div className="relative z-20 text-center w-full max-w-lg mx-auto">
        {/* 감성적 소개 문구 */}
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

        {/* 로그인 폼 */}
        <div className="w-full animate-fade-in-delay">
          <div className="p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-left">
                <label
                  htmlFor="email"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신의 별자리 주소는?
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="이메일을 입력해주세요"
                  required
                  aria-required="true"
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  별빛을 열 수 있는 비밀 열쇠
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="비밀번호를 입력해주세요"
                  required
                  aria-required="true"
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
              <button
                type="submit"
                className="w-full bg-[#FFD700] text-[#0B0C2A] px-6 py-4 rounded-lg hover:bg-[#FFE566] transition-colors font-body font-medium text-lg transform hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-300"
              >
                별의 문 열기
              </button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FFD700]/20"></div>
              </div>
              <div className="relative bg-[#281C40] px-4 text-sm text-[#BFA2DB] font-body">
                또는
              </div>
            </div>

            {/* 소셜 로그인 버튼 */}
            <button
              onClick={() => handleSocialLogin("google" as Provider)}
              className="w-full flex items-center justify-center gap-3 bg-white/90 text-gray-800 px-6 py-4 rounded-lg hover:bg-white transition-colors font-body text-base focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google로 별자리 연결하기
            </button>

            <div className="mt-6 text-center text-base text-[#BFA2DB] font-body">
              <p>
                아직 별자리가 없으신가요?{" "}
                <Link
                  href="/signup"
                  className="text-[#FFD700] hover:text-[#FFE566] transition-colors hover:underline decoration-[#FFD700]/30 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-sm block md:inline"
                >
                  새로운 별자리 등록하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
