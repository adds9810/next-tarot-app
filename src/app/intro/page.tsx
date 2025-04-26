import Link from "next/link";
import ClientStarryBackground from "@/components/ClientStarryBackground";

export default function IntroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative text-white">
      <ClientStarryBackground />
      <div className="z-10 text-center space-y-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Whispers of the Stars
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          별들의 속삭임을 통해 당신의 운명을 탐색하세요. 타로 카드가 당신의 길을
          밝혀줄 것입니다.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 text-white font-semibold"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors duration-200 text-white font-semibold"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
