import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative py-20 px-6 lg:px-8 w-dvw text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-[#FFD700] font-title text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
          길을 잃은 별빛이에요.
        </h1>
        <p className="text-white/90 font-body text-lg md:text-xl">
          찾으시는 페이지가 존재하지 않아요.
          <br />
          메인으로 돌아가 여정을 다시 시작해볼까요?
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
