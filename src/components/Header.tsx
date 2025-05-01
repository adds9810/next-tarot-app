"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
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
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // 구글 로그인의 경우
          if (session.user.app_metadata.provider === "google") {
            const emailNickname = session.user.email?.split("@")[0] || "";
            setNickname(emailNickname);
          } else {
            // 일반 로그인의 경우
            const userNickname = session.user.user_metadata.nickname;
            setNickname(
              userNickname || session.user.email?.split("@")[0] || ""
            );
          }
        } else {
          setNickname("");
        }
      }
    );

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
        // { href: "/fortune", label: "오늘의 운세" },
        // { href: "/chat", label: "타로 상담" },
        { href: "/post", label: "커뮤니티" },
        { href: "/record", label: "흔적" },
      ]
    : [
        // { href: "/fortune", label: "오늘의 운세" },
        // { href: "/chat", label: "타로 상담" },
        { href: "/post", label: "커뮤니티" },
        { href: "/record", label: "흔적" },
      ];

  return (
    <header
      className="fixed w-full top-0 z-50 bg-gradient-to-b from-[#070817]/80 to-[#1C1635]/80 backdrop-blur-md border-b border-[#FFD700]/10 shadow-lg shadow-[#1C1635]/20"
      role="banner"
    >
      <div className="container mx-auto px-4 py-3 md:py-4">
        <nav
          className="flex items-center justify-between"
          role="navigation"
          aria-label="메인 네비게이션"
        >
          {/* 로고 */}
          <Link
            href="/"
            className="font-logo text-xl md:text-3xl text-[#FDF9E9] hover:text-[#FFE566] transition-all duration-300 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg"
            aria-label="Whispers of the Stars - 홈으로 이동"
          >
            <h1 className="drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
              Whispers of the Stars
            </h1>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                aria-label={`${item.label} 페이지로 이동`}
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
                    className="flex items-center space-x-2 text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                    aria-expanded={isMenuOpen}
                    aria-controls="user-menu"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FFD700]/20 glow-sm">
                      <Image
                        src={
                          user.user_metadata.avatar_url ||
                          "/images/them/profile.png"
                        }
                        alt={`${nickname}님의 프로필 이미지`}
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
                      aria-hidden="true"
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
                    <div
                      id="user-menu"
                      className="absolute right-0 mt-2 w-48 py-2 bg-[#1C1635]/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#FFD700]/10"
                      role="menu"
                    >
                      <Link
                        href="/record"
                        className="block px-4 py-2 text-sm text-[#EAE7FF] hover:bg-[#FFD700]/10 font-body transition-colors duration-200 focus:outline-none focus:bg-[#FFD700]/20"
                        role="menuitem"
                      >
                        내 리딩
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-[#EAE7FF] hover:bg-[#FFD700]/10 font-body transition-colors duration-200 focus:outline-none focus:bg-[#FFD700]/20"
                        role="menuitem"
                      >
                        개인정보 수정
                      </Link>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-body text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 font-body text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                  aria-label="로그인 페이지로 이동"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 font-body bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-lg shadow-[#FFD700]/20"
                  aria-label="회원가입 페이지로 이동"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* 모바일 메뉴 */}
          <div
            id="mobile-menu"
            className={`md:hidden absolute top-full left-0 right-0 bg-[#1C1635]/95 backdrop-blur-sm border-b border-[#FFD700]/10 transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
            role="menu"
          >
            <div className="px-4 py-4 space-y-4">
              {user ? (
                <>
                  {/* 사용자 프로필 정보 */}
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFD700]/30 glow-sm">
                      <Image
                        src={
                          user.user_metadata.avatar_url ||
                          "/images/them/profile.png"
                        }
                        alt={`${nickname}님의 프로필 이미지`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-[#FFD700] text-lg">
                        {nickname}님
                      </span>
                      <span className="font-body text-[#EAE7FF]/70 text-sm">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-[#FFD700]/10 pt-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-[#FFD700]/10 pt-4">
                    <Link
                      href="/record"
                      className="block font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      내 리딩
                    </Link>
                    <Link
                      href="/profile"
                      className="block font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      개인정보 수정
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                      role="menuitem"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block font-body text-[#EAE7FF] hover:text-[#FFD700] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-lg px-3 py-2"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-[#FFD700]/10">
                    <Link
                      href="/login"
                      className="block w-full px-4 py-2 font-body text-center text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full px-4 py-2 font-body text-center bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-lg shadow-[#FFD700]/20"
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
