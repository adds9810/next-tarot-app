"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Provider } from "@supabase/supabase-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/home");
  };

  const handleSocialLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams:
          provider === "google"
            ? {
                access_type: "offline",
                prompt: "consent",
              }
            : undefined,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0C2A] text-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/starry-night.jpg"
            alt="Starry Night Background"
            fill
            priority
            className="object-cover object-center"
            quality={100}
            sizes="100vw"
            style={{
              objectPosition: "center",
              opacity: 0.6,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#281C40]/60 via-[#281C40]/80 to-[#0B0C2A] z-10" />

          {/* 별빛 효과 */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: "#FFD700",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-20 text-center px-4">
          <h1 className="font-title text-3xl md:text-5xl text-[#FFD700] mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] animate-fade-in">
            별자리를 등록하고
            <br />
            운세의 세계로 들어오세요.
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-delay tracking-wide">
            당신만의 별자리를 등록하면
            <br />더 특별한 운세를 받아볼 수 있습니다.
          </p>

          {/* 로그인 폼 */}
          <div className="w-full max-w-md mx-auto animate-fade-in-delay">
            <div className="p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300">
              <h2 className="font-title text-xl mb-6 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                별자리 연결하기
              </h2>

              {/* 소셜 로그인 버튼 */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialLogin("google" as Provider)}
                  className="w-full flex items-center justify-center gap-2 bg-white/90 text-gray-800 px-4 py-3 rounded-lg hover:bg-white transition-colors font-body"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google로 별자리 연결하기
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FFD700]/20"></div>
                </div>
                <div className="relative bg-[#281C40] px-4 text-sm text-[#BFA2DB] font-body">
                  또는 이메일로 연결하기
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 주소 (이메일)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body"
                    placeholder="별자리 주소를 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 암호
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body"
                    placeholder="별자리 암호를 입력하세요"
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-400 text-sm text-center font-body">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-[#FFD700] text-[#0B0C2A] px-4 py-3 rounded-lg hover:bg-[#FFE566] transition-colors font-body font-medium transform hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                  별자리 연결하기
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-[#BFA2DB] font-body">
                아직 별자리가 없으신가요?{" "}
                <Link
                  href="/signup"
                  className="text-[#FFD700] hover:text-[#FFE566] transition-colors hover:underline decoration-[#FFD700]/30 underline-offset-4"
                >
                  새로운 별자리 등록하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
