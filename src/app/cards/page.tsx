export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">카드 뽑기</h1>
        <div className="max-w-2xl mx-auto bg-indigo-800/50 p-8 rounded-lg">
          <div className="text-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
              카드 뽑기
            </button>
            <div className="mt-8">
              {/* 뽑은 카드가 표시될 부분 */}
              <p className="text-xl">카드를 뽑아보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
