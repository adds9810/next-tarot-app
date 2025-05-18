"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GuestMain() {
  return (
    <section
      className="relative py-10 px-6 lg:px-8 flex flex-col items-center justify-center"
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
            <h1 className="font-title text-3xl/tight sm:text-4xl/tight md:text-5xl/tight lg:text-6xl/tight text-[#FFD700] tracking-wide">
              오늘 별이 속삭인다면,
              <br /> 당신의 하루는 어떻게 달라질까요?
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {/* 오늘의 카드 */}
            <Link
              href="/tarot?type=today"
              className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
              aria-label="오늘의 운세 확인하기"
            >
              <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl sm:text-5xl mb-2"
                  aria-hidden="true"
                >
                  🌟
                </motion.div>
                <h2 className="font-title text-xl text-[#FFD700] mb-2">
                  오늘의 카드
                </h2>
                <p className="font-body text-white/80">
                  매일 새로운 카드가 당신 하루를 비춰줍니다
                </p>
              </div>
            </Link>

            {/* 질문 기반 리딩 */}
            <Link
              href="/tarot?type=custom"
              className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
              aria-label="별에게 질문하기"
            >
              <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl sm:text-5xl mb-2"
                  aria-hidden="true"
                >
                  💫
                </motion.div>
                <h2 className="font-title text-xl text-[#FFD700] mb-2">
                  질문 기반 리딩
                </h2>
                <p className="font-body text-white/80">
                  당신의 특별한 질문에 카드가 답해드립니다
                </p>
              </div>
            </Link>

            {/* 감정 기록 다이어리 */}
            <Link
              href="/record"
              className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
              aria-label="이전 리딩 기록 보기"
            >
              <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl sm:text-5xl mb-2"
                  aria-hidden="true"
                >
                  📖
                </motion.div>
                <h2 className="font-title text-xl text-[#FFD700] mb-2">
                  감정 기록 다이어리
                </h2>

                <p className="font-body text-white/80">
                  당신의 감정과 카드의 메시지를 기록하세요
                </p>
              </div>
            </Link>
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
              className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0B0C2A] font-body text-base sm:text-lg overflow-hidden font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
              aria-label="로그인하고 별의 문 열기"
              role="button"
            >
              <div
                className="absolute inset-0 bg-white/20 transform skew-x-0 translate-x-full group-hover:-skew-x-12 group-hover:translate-x-0 transition-transform duration-500 group-hover:scale-150"
                aria-hidden="true"
              />
              <span className="relative text-lg text-[#0B0C2A] font-medium tracking-wide">
                별의 문을 열기
              </span>
            </Link>
            <Link
              href="/signup"
              className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] font-body text-base sm:text-lg font-medium tracking-wide bg-transparent border overflow-hidden border-[#FFD700] text-[#FFD700] hover:border-[#FFE566] rounded-lg  transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-[#FFD700]/20"
              aria-label="회원가입하고 나만의 여정 시작하기"
              role="button"
            >
              <div
                className="absolute inset-0 bg-white/20 transform skew-x-0 translate-x-full group-hover:-skew-x-12 group-hover:translate-x-0 transition-transform duration-500 group-hover:scale-150"
                aria-hidden="true"
              />
              <span className="relative text-lg text-[#FFD700] hover:border-[#FFE566] font-medium tracking-wide">
                나만의 여정 시작하기
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
