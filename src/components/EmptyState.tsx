"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const MotionDiv = motion.div;

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonLink,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <p className="text-gray-500 text-lg">{title}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8"
      >
        <Link
          href={buttonLink}
          className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
        >
          <div
            className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"
            aria-hidden="true"
          />
          <span className="relative text-lg text-[#0B0C2A] font-medium tracking-wide">
            {buttonText}
          </span>
        </Link>
      </MotionDiv>
    </div>
  );
}
