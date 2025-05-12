"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GuestMain() {
  return (
    <section
      className="relative py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      role="main"
      aria-label="방문자 메인 페이지"
    >
      <div className="relative z-20 w-full max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-8 md:space-y-12">
          {/* 메인 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFD700] leading-tight tracking-wide">
              오늘 별이 속삭인다면,
              <br className="md:hidden" /> 당신의 하루는 어떻게 달라질까요?
            </h1>

            {/* 서비스 소개 문구 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 space-y-4"
              aria-label="서비스 소개"
            >
              <p className="font-body text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide">
                <span className="block md:inline">Whispers of the Stars는</span>{" "}
                <span className="block md:inline">
                  타로를 통해 감정과 질문을 기록하고,
                </span>{" "}
                <span className="block md:inline">
                  하루의 흐름을 회고하는 감성 다이어리입니다.
                </span>
              </p>
              <p className="font-body text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                별이 속삭이는 대로,
                <br className="md:hidden" /> 당신의 하루를 글처럼 남겨보세요.
              </p>
            </motion.section>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {/* 오늘의 카드 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-[#1C1635]/50 backdrop-blur-sm rounded-xl border border-[#FFD700]/10 focus-within:ring-2 focus-within:ring-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300"
              tabIndex={0}
              role="article"
              aria-label="오늘의 카드 기능 소개"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl mb-4"
                aria-hidden="true"
              >
                🌟
              </motion.div>
              <h3 className="font-title text-xl text-[#FFD700] mb-2">
                오늘의 카드
              </h3>
              <p className="font-body text-white/80">
                매일 새로운 카드가 당신의 하루를 비춰줍니다
              </p>
            </motion.div>

            {/* 질문 기반 리딩 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-[#1C1635]/50 backdrop-blur-sm rounded-xl border border-[#FFD700]/10 focus-within:ring-2 focus-within:ring-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300"
              tabIndex={0}
              role="article"
              aria-label="질문 기반 리딩 기능 소개"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl mb-4"
                aria-hidden="true"
              >
                💫
              </motion.div>
              <h3 className="font-title text-xl text-[#FFD700] mb-2">
                질문 기반 리딩
              </h3>
              <p className="font-body text-white/80">
                당신만의 특별한 질문에 카드가 답해드립니다
              </p>
            </motion.div>

            {/* 감정 기록 다이어리 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-[#1C1635]/50 backdrop-blur-sm rounded-xl border border-[#FFD700]/10 focus-within:ring-2 focus-within:ring-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300"
              tabIndex={0}
              role="article"
              aria-label="감정 기록 다이어리 기능 소개"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl mb-4"
                aria-hidden="true"
              >
                📖
              </motion.div>
              <h3 className="font-title text-xl text-[#FFD700] mb-2">
                감정 기록 다이어리
              </h3>
              <p className="font-body text-white/80">
                당신의 감정과 카드의 메시지를 기록하세요
              </p>
            </motion.div>
          </motion.div>

          {/* CTA 버튼 그룹 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
            role="group"
            aria-label="서비스 이용 시작하기"
          >
            <Link
              href="/login"
              className="group px-6 py-3 w-full sm:w-auto min-w-[200px] bg-[#FFD700] text-[#0B0C2A] font-body text-base sm:text-lg  font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
              aria-label="로그인하고 별의 문 열기"
              role="button"
            >
              별의 문을 열기
            </Link>
            <Link
              href="/signup"
              className="group px-6 py-3 w-full sm:w-auto min-w-[200px] font-body text-base sm:text-lg font-medium tracking-wide bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:border-[#FFE566] hover:text-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
              aria-label="회원가입하고 나만의 여정 시작하기"
              role="button"
            >
              나만의 여정 시작하기
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
