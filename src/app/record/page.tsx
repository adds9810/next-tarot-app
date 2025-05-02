"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ClientStarryBackground from "@/components/ClientStarryBackground";
import RecordList from "@/components/record/RecordList";

export default function RecordPage() {
  return (
    <section
      className="relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록하기 섹션"
    >
      <ClientStarryBackground />
      <div className="container text-center mx-auto px-4 py-8 relative z-10">
        {/* 감성적 소개 문구 */}
        <section
          className="mb-8 space-y-4 animate-fade-in"
          aria-label="서비스 소개"
        >
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            속삭임의 흔적
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            당신의 이야기, 오늘 다시 꺼내 읽어보세요.
          </p>
        </section>

        {/* CTA 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
        >
          <Link
            href="/record/new"
            className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
            aria-label="기록 흔적 남기기"
          >
            <div
              className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"
              aria-hidden="true"
            />
            <span className="relative font-body text-lg text-[#0B0C2A] font-medium tracking-wide">
              흔적 남기기
            </span>
          </Link>
        </motion.div>
        <RecordList />
      </div>
    </section>
  );
}
