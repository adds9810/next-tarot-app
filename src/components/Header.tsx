"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        // Google 로그인의 경우
        if (user?.app_metadata?.provider === "google") {
          const emailNickname = user.email?.split("@")[0] || "";
          setNickname(emailNickname);
        } else {
          // 일반 로그인의 경우
          const userNickname = user?.user_metadata?.nickname;
          setNickname(userNickname || user.email?.split("@")[0] || "");
        }
      }
      setLoading(false);
    };

    checkUser();

    // 로그인 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return null;
  }

  const menuItems = user
    ? [
        { href: "/fortune", label: "오늘의 운세" },
        { href: "/chat", label: "타로 상담" },
      ]
    : [
        { href: "/fortune", label: "오늘의 운세" },
        { href: "/chat", label: "타로 상담" },
      ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0C2A]/50 backdrop-blur-md border-b border-[#FFD700]/10">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="font-logo text-2xl md:text-3xl text-[#FFD700] hover:text-[#FFE566] transition-colors duration-300 tracking-wider"
          >
            Whispers of the Stars
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-[#BFA2DB] hover:text-[#FFD700] transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 데스크톱 로그인/회원가입 */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-[#FFD700] transition-colors duration-200"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FFD700]/20">
                      <Image
                        src={
                          user.user_metadata.avatar_url ||
                          "/images/default-avatar.png"
                        }
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-body">{nickname}님</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMenuOpen ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#281C40] rounded-lg shadow-xl border border-[#FFD700]/10">
                      <Link
                        href="/my-readings"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#FFD700]/10 font-body"
                      >
                        내 리딩
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-[#FFD700]/10 font-body"
                      >
                        개인정보 수정
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-body text-[#BFA2DB] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 button-glow"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 font-body text-[#BFA2DB] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 button-glow"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 font-body bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 button-glow"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* 모바일 메뉴 */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body block text-center text-[#BFA2DB] hover:text-[#FFD700] transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FFD700]/20">
                    <Image
                      src={
                        user.user_metadata.avatar_url ||
                        "/images/default-avatar.png"
                      }
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-body text-white">{nickname}님</span>
                </div>
                <Link
                  href="/my-readings"
                  className="block text-center px-4 py-2 text-sm text-white hover:bg-[#FFD700]/10 font-body"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내 리딩
                </Link>
                <Link
                  href="/profile"
                  className="block text-center px-4 py-2 text-sm text-white hover:bg-[#FFD700]/10 font-body"
                  onClick={() => setIsMenuOpen(false)}
                >
                  개인정보 수정
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 font-body text-[#BFA2DB] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 button-glow"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 font-body text-[#BFA2DB] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 button-glow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="block w-full px-4 py-2 font-body bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 button-glow"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
