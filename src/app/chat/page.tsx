export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Whispers 챗봇</h1>
        <div className="max-w-2xl mx-auto bg-indigo-800/50 p-8 rounded-lg">
          <div className="h-[500px] flex flex-col">
            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="text-center text-gray-400">
                챗봇과 대화를 시작해보세요
              </div>
            </div>

            {/* 메시지 입력 영역 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-indigo-700/50 border border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
