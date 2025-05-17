"use client";

import Link from "next/link";
// import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-2 py-6 px-4 text-center border-t border-white/10 bg-[#0B0C2A] text-sm text-white/40 relative z-10">
      <div className="mb-2">
        © {new Date().getFullYear()} Whispers of the Stars. All rights reserved.
      </div>
      <div>
        개발자&nbsp;
        <Link
          href="https://github.com/adds9810/next-tarot-app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFD700]/80 hover:underline"
        >
          GitHub 바로가기
        </Link>
      </div>
    </footer>
  );
}
