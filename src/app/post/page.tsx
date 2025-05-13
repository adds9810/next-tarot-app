"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import EmptyState from "@/components/EmptyState";
export default function postsPage() {
  return (
    <section
      className="relative py-12 px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="커뮤니티 섹션"
    >
      <div className="relative z-20 text-center w-full max-w-lg mx-auto animate-fade-in">
        {/* 감성적 소개 문구 */}
        <section
          className="mb-8 space-y-4 animate-fade-in"
          aria-label="서비스 소개"
        >
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            별의 메아리
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            당신의 생각과 경험을, 별처럼 반짝이는 이야기로 나눠보세요.
          </p>
        </section>

        <EmptyState
          title="아직 남겨진 별빛이 없어요."
          description="당신의 이야기를 들려주세요."
          buttonText="이야기 시작하기"
          buttonLink="/record/create"
        />
      </div>
    </section>
  );
}
