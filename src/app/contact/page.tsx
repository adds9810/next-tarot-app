export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">문의하기</h1>
        <div className="max-w-2xl mx-auto bg-indigo-800/50 p-8 rounded-lg">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-indigo-700/50 border border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-indigo-700/50 border border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2">
                문의 내용
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full bg-indigo-700/50 border border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              문의하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
