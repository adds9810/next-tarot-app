import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Whispers of the Stars</h1>
          <p className="text-xl text-gray-300">별들의 속삭임을 들으세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 오늘의 운세 카드 */}
          <Link href="/fortune" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">오늘의 운세</h2>
              <p className="text-gray-300">오늘 하루의 운세를 확인해보세요</p>
            </div>
          </Link>

          {/* 카드 뽑기 */}
          <Link href="/cards" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">카드 뽑기</h2>
              <p className="text-gray-300">직관적으로 카드를 뽑아보세요</p>
            </div>
          </Link>

          {/* 챗봇 */}
          <Link href="/chat" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">Whispers 챗봇</h2>
              <p className="text-gray-300">
                고민을 나누고 직관적인 해석을 받아보세요
              </p>
            </div>
          </Link>

          {/* 리딩 기록 */}
          <Link href="/history" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">리딩 기록</h2>
              <p className="text-gray-300">과거의 리딩 결과를 확인해보세요</p>
            </div>
          </Link>

          {/* 커뮤니티 */}
          <Link href="/community" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">커뮤니티</h2>
              <p className="text-gray-300">다른 사람들과 해석을 공유해보세요</p>
            </div>
          </Link>

          {/* 문의하기 */}
          <Link href="/contact" className="group">
            <div className="bg-indigo-800/50 p-6 rounded-lg hover:bg-indigo-700/50 transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4">문의하기</h2>
              <p className="text-gray-300">궁금한 점을 물어보세요</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
