"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/intro", label: "인트로" },
    { href: "/fortune", label: "운세보기" },
    { href: "/chat", label: "상담하기" },
    { href: "/community", label: "커뮤니티" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0C2A]/50 backdrop-blur-md border-b border-[#FFD700]/10">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* 로고 */}
          <Link
            href="/"
            className="font-title text-2xl md:text-3xl text-[#FFD700] hover:text-[#FFE566] transition-colors duration-300"
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
            <Link
              href="/login"
              className="font-body border-2 border-[#BFA2DB] text-[#BFA2DB] hover:bg-[#BFA2DB]/10 px-6 py-2 rounded-full transition-all duration-300"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="font-body bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50"
            >
              회원가입
            </Link>
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
                className="font-body block text-[#BFA2DB] hover:text-[#FFD700] transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-4 border-t border-[#FFD700]/10">
              <Link
                href="/login"
                className="font-body block text-center border-2 border-[#BFA2DB] text-[#BFA2DB] hover:bg-[#BFA2DB]/10 px-6 py-2 rounded-full transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="font-body block text-center bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50"
                onClick={() => setIsMenuOpen(false)}
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
