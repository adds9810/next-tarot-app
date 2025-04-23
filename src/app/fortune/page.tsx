export default function FortunePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">오늘의 운세</h1>
        <div className="max-w-2xl mx-auto bg-indigo-800/50 p-8 rounded-lg">
          {/* 운세 내용이 들어갈 부분 */}
          <div className="text-center">
            <p className="text-xl mb-4">오늘의 운세를 불러오는 중...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
