"use client";

import { motion } from "framer-motion";
import MysticSpinner from "@/components/MysticSpinner";

interface LoadingIndicatorProps {
  message?: string;
  busy?: boolean;
}

export default function LoadingIndicator({
  message = "🌠 별빛 속 기억을 탐험하는 중이에요.",
  busy = true,
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={busy}
      className="text-center space-y-4 w-full sm:max-w-xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-white text-center">{message}</div>
      </motion.div>
      <MysticSpinner />
    </div>
  );
}
