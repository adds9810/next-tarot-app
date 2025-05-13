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
    <div className="text-center py-12 px-6 animate-fade-in-delay">
      <p className="text-gray-500 text-lg">{title}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
      >
        <Link
          href={buttonLink}
          className="px-6 py-3 w-full min-w-[200px] lg:max-w-xs bg-[#FFD700] text-[#0B0C2A]  rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
        >
          {buttonText}
        </Link>
      </MotionDiv>
    </div>
  );
}
