"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function EmptyState({
  title,
  description = "카드를 뽑고 첫 속삭임을 남겨보세요.",
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="w-full animate-fade-in-delay">
      <p className="text-gray-500 text-lg">{title}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>

      {/* CTA 버튼 그룹 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
      >
        <Link
          href={buttonLink}
          className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
          aria-label="로그인하고 별의 문 열기"
        >
          <div
            className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"
            aria-hidden="true"
          />
          <span className="relative font-body text-lg text-[#0B0C2A] font-medium tracking-wide">
            {buttonText}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
