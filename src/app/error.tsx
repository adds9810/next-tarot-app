"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <section className="relative py-20 px-6 lg:px-8 w-dvw text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-[#FFD700] font-title text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
          별빛이 흐트러졌어요.
        </h1>
        <p className="text-white/90 font-body text-lg md:text-xl">
          알 수 없는 오류가 발생했어요.
          <br />
          메인으로 돌아가 다시 시도해 주세요.
        </p>
        <Link href="/">
          <Button className="mt-4 px-6 py-3 bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] transition">
            메인으로 돌아가기
          </Button>
        </Link>
      </div>
    </section>
  );
}
