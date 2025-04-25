"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      // 구글 로그인의 경우 이메일에서 닉네임 추출
      if (user.app_metadata.provider === "google") {
        const emailNickname = user.email?.split("@")[0] || "";
        setNickname(emailNickname);
      } else {
        // 일반 회원가입의 경우 저장된 닉네임 사용
        const userNickname = user.user_metadata.nickname;
        setNickname(userNickname || user.email?.split("@")[0] || "");
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
    <main className="min-h-screen bg-[#0B0C2A] text-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
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
            {nickname}님,
            <br />
            오늘의 운세를 확인해보세요.
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-delay tracking-wide">
            별들이 속삭이는 이야기를 들어보세요.
            <br />
            당신만을 위한 특별한 메시지가 기다리고 있습니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in-delay">
            <Link
              href="/fortune"
              className="group p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:bg-[#281C40]/70"
            >
              <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                ✨
              </div>
              <h3 className="font-title text-xl mb-2 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300">
                오늘의 운세
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 transition-colors duration-300">
                오늘의 타로 카드와 운세를 확인해보세요.
              </p>
            </Link>

            <Link
              href="/chat"
              className="group p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:bg-[#281C40]/70"
            >
              <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                💫
              </div>
              <h3 className="font-title text-2xl mb-2 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300">
                별의 속삭임
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 transition-colors duration-300">
                AI와 함께하는 감성적인 대화를 나눠보세요.
              </p>
            </Link>

            <Link
              href="/history"
              className="group p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:bg-[#281C40]/70"
            >
              <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                📝
              </div>
              <h3 className="font-title text-2xl mb-2 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300">
                나의 기록
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 transition-colors duration-300">
                과거의 타로 리딩 결과를 확인해보세요.
              </p>
            </Link>

            <Link
              href="/community"
              className="group p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 hover:bg-[#281C40]/70"
            >
              <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                👥
              </div>
              <h3 className="font-title text-2xl mb-2 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300">
                커뮤니티
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 transition-colors duration-300">
                다른 사람들과 이야기를 나눠보세요.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
