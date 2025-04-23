export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">리딩 기록</h1>
        <div className="max-w-2xl mx-auto bg-indigo-800/50 p-8 rounded-lg">
          <div className="text-center">
            <p className="text-xl mb-4">로그인이 필요합니다</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
