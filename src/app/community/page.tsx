export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">커뮤니티</h1>
        <div className="max-w-4xl mx-auto">
          {/* 게시글 작성 버튼 */}
          <div className="mb-8">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
              새 글 작성
            </button>
          </div>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="bg-indigo-800/50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  게시글 제목 {post}
                </h2>
                <p className="text-gray-300 mb-4">
                  게시글 내용이 들어갈 자리입니다...
                </p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>작성자: 사용자{post}</span>
                  <span>2024-04-23</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
