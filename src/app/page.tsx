import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0C2A] text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/starry-night.jpg"
            alt="Starry Night Background"
            fill
            priority
            className="object-cover object-center"
            quality={100}
            sizes="100vw"
            style={{
              objectPosition: "center",
              opacity: 0.8,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#281C40]/60 to-[#0B0C2A] z-10" />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-20 text-center px-4">
          <h1 className="font-title text-5xl md:text-7xl font-bold text-[#FFD700] mb-6 drop-shadow-lg">
            별의 속삭임을 따라,
            <br />
            당신의 내일을 열어보세요.
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            오늘의 운세부터, 감성 챗봇까지.
            <br />
            나만의 타로 세계가 열립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fortune"
              className="font-main bg-[#FFD700] text-[#0B0C2A] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#FFE566] transition-colors shadow-lg"
            >
              오늘의 운세 보기
            </Link>
            <Link
              href="/chat"
              className="font-main bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3 rounded-full text-lg font-medium hover:bg-[#FFD700]/10 transition-colors shadow-lg"
            >
              별의 속삭임에게 묻기
            </Link>
          </div>
          <p className="text-sm text-gray-300 mt-4 drop-shadow-lg">
            기록은 로그인 후 저장됩니다
          </p>
        </div>
      </section>

      {/* 카드 섹션 */}
      <section className="py-20 bg-[#281C40]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16">
            타로 카드로 만나는 내일
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="group relative h-[400px] bg-[#0B0C2A] rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-serif mb-2">카드 제목</h3>
                  <p className="text-[#BFA2DB]">키워드: 운명, 선택, 기회</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 bg-[#0B0C2A]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16">
            Whispers of the Stars의 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "감성 챗봇 '별의 속삭임'",
                description:
                  "AI가 당신의 고민을 들어주고 직관적인 해석을 제공합니다.",
                icon: "💫",
              },
              {
                title: "나만의 타로 기록장",
                description: "과거의 리딩 결과를 저장하고 관리할 수 있습니다.",
                icon: "📝",
              },
              {
                title: "커뮤니티 공간",
                description:
                  "다른 사람들과 해석을 공유하고 이야기를 나눠보세요.",
                icon: "👥",
              },
              {
                title: "외부 상담 연결",
                description: "전문가와의 상담을 원하시나요? 문의해주세요.",
                icon: "📩",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#281C40] p-8 rounded-lg transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
                <p className="text-[#BFA2DB]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#0B0C2A] py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              YouTube
            </a>
            <a
              href="#"
              className="text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              Email
            </a>
          </div>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <a href="#" className="hover:text-[#BFA2DB] transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-[#BFA2DB] transition-colors">
              서비스 이용약관
            </a>
            <a
              href="/contact"
              className="hover:text-[#BFA2DB] transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
