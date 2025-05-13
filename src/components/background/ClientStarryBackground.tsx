"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { motion } from "framer-motion";
interface ClientStarryBackgroundProps {
  children: ReactNode;
}

const StarryBackground = dynamic(() => import("./StarryBackground"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#070817]" />,
});

export default function ClientStarryBackground({
  children,
}: ClientStarryBackgroundProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#070817] via-[#1C1635]/95 to-[#070817]" />
        <StarryBackground /> {/* 메인 콘텐츠 */}
      </div>
      <div className="relative min-h-screen w-full pt-16 md:pt-20 flex items-center justify-center z-20">
        {children}
      </div>
    </motion.div>
  );
}
