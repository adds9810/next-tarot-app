"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/home");
        return;
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C2A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
      </div>
    );
  }

  return (
    <main className="h-screen bg-[#0B0C2A] text-white overflow-hidden">
      {/* 배경 */}
      <div className="fixed inset-0 z-0">
        {/* 그라디언트 배경 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#281C40] via-[#1A1B3A] to-[#0B0C2A]" />

        {/* 별빛 효과 */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: "#FFD700",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}

        {/* 유성 효과 */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-meteor"
            style={{
              top: `${Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
              width: "2px",
              height: "60px",
              background: "linear-gradient(to bottom, transparent, #FFD700)",
              animationDelay: `${Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* 상단 섹션 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-2xl mb-8">
            <h1 className="font-title text-3xl md:text-5xl text-[#FFD700] mb-3 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] animate-fade-in">
              별이 속삭이기 시작하려면,
              <br />
              당신의 이름이 필요해요.
            </h1>
            <p className="font-body text-lg md:text-xl text-white/90 mb-4 drop-shadow-lg animate-fade-in-delay">
              오늘의 운세, 카드 리딩, 감성 챗봇.
              <br />
              모든 타로 경험을 이곳에서 시작하세요.
            </p>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-5xl animate-fade-in-delay">
            <h2 className="font-title text-2xl md:text-3xl text-center text-[#FFD700] mb-6">
              별들이 들려주는 이야기
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature 1 */}
              <div className="group bg-[#281C40]/50 backdrop-blur-sm rounded-2xl p-5 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="text-3xl mb-2 text-center text-[#FFD700] group-hover:scale-110 transition-transform duration-300">
                  🔮
                </div>
                <h3 className="font-title text-lg text-center text-[#FFD700] mb-2">
                  오늘의 운세 보기
                </h3>
                <p className="font-body text-sm text-[#BFA2DB] text-center">
                  매일 아침, 나만을 위한 운세 메시지를 확인하세요.
                  <br />
                  별들이 전하는 오늘의 메시지를 받아보세요.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-[#281C40]/50 backdrop-blur-sm rounded-2xl p-5 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="text-3xl mb-2 text-center text-[#FFD700] group-hover:scale-110 transition-transform duration-300">
                  🃏
                </div>
                <h3 className="font-title text-lg text-center text-[#FFD700] mb-2">
                  타로 카드 리딩
                </h3>
                <p className="font-body text-sm text-[#BFA2DB] text-center">
                  카드를 뽑고 감성 챗봇과 함께
                  <br />
                  나의 흐름과 가능성을 해석해보세요.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-[#281C40]/50 backdrop-blur-sm rounded-2xl p-5 border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="text-3xl mb-2 text-center text-[#FFD700] group-hover:scale-110 transition-transform duration-300">
                  ✨
                </div>
                <h3 className="font-title text-lg text-center text-[#FFD700] mb-2">
                  리딩 기록 저장
                </h3>
                <p className="font-body text-sm text-[#BFA2DB] text-center">
                  내가 뽑은 카드와 해석을 자동 저장,
                  <br />
                  언제든지 다시 확인할 수 있어요.
                </p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center mt-10 animate-fade-in-delay">
            <Link
              href="/login"
              className="button-glow font-body bg-[#FFD700] text-[#0B0C2A] px-8 py-3 rounded-full text-base hover:bg-[#FFE566] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0B0C2A] transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50 inline-block"
            >
              별자리 여행 시작하기
            </Link>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="flex-none">
          {/* Footer */}
          <footer className="bg-[#0B0C2A] border-t border-[#FFD700]/10 py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-2 md:mb-0">
                  <p className="font-body text-sm text-[#BFA2DB]">
                    © 2024 Whispers of the Stars. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href="/terms"
                    className="font-body text-sm text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
                  >
                    이용약관
                  </Link>
                  <Link
                    href="/privacy"
                    className="font-body text-sm text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
                  >
                    개인정보처리방침
                  </Link>
                  <Link
                    href="/contact"
                    className="font-body text-sm text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
                  >
                    문의하기
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
