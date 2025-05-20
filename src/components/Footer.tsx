"use client";

import Link from "next/link";
// import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="mt-2 py-6 px-4 text-center border-t border-white/10 bg-[#0B0C2A] text-sm text-white/40 relative z-10">
      <div>
        © 2025 Whispers of the Stars. All rights reserved. · Built by{" "}
        <Link
          href="https://github.com/adds9810/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FFD700]/80 hover:underline"
        >
          김지혜
        </Link>
      </div>
      <p className="mt-2 text-xs text-white/30">
        본 프로젝트는 포트폴리오용으로 제작되었으며 기획, UI 흐름, 리딩 콘텐츠는
        개발자의 창작물로 보호되며, 무단 도용을 금합니다.
      </p>
    </footer>
  );
}
