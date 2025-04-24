import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0C2A] text-white">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
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
              opacity: 0.6,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#281C40]/60 via-[#281C40]/80 to-[#0B0C2A] z-10" />

          {/* 별빛 효과 추가 */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: "#FFD700",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-20 text-center px-4">
          <h1 className="font-title text-5xl md:text-7xl text-[#FFD700] mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] animate-fade-in">
            별의 속삭임을 따라,
            <br />
            당신의 내일을 열어보세요.
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-delay tracking-wide">
            오늘의 운세부터, 감성 챗봇까지.
            <br />
            나만의 타로 세계가 열립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay">
            <Link
              href="/fortune"
              className="button-glow font-body bg-[#FFD700] text-[#0B0C2A] px-8 py-3.5 rounded-full text-lg hover:bg-[#FFE566] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0B0C2A] transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50"
            >
              오늘의 운세 보기
            </Link>
            <Link
              href="/chat"
              className="button-glow font-body bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3.5 rounded-full text-lg hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0B0C2A] transition-all duration-300 shadow-lg"
            >
              별의 속삭임에게 묻기
            </Link>
          </div>
          <p className="font-body text-sm text-gray-300 mt-4 drop-shadow-lg animate-fade-in-delay">
            기록은 로그인 후 저장됩니다
          </p>
        </div>
      </section>

      {/* 카드 섹션 */}
      <section className="py-20 bg-[#281C40]">
        <div className="container mx-auto px-4">
          <h2 className="font-title text-4xl text-center mb-16 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">
            타로 카드로 만나는 내일
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "과거의 이야기",
                keywords: "기억, 경험, 교훈",
                image: "/images/past-card.jpg",
              },
              {
                title: "현재의 순간",
                keywords: "직관, 통찰, 깨달음",
                image: "/images/present-card.jpg",
              },
              {
                title: "미래의 가능성",
                keywords: "희망, 성장, 변화",
                image: "/images/future-card.jpg",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group relative h-[400px] bg-[#0B0C2A] rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 shadow-lg"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-title text-2xl mb-2 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                    {card.title}
                  </h3>
                  <p className="font-body text-[#BFA2DB]">
                    키워드: {card.keywords}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 bg-[#0B0C2A]">
        <div className="container mx-auto px-4">
          <h2 className="font-title text-4xl text-center mb-16 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">
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
                className="group card-hover bg-gradient-to-br from-[#281C40]/95 to-[#0B0C2A]/95 backdrop-blur-sm p-8 rounded-2xl transform transition-all duration-500 hover:from-[#281C40] hover:to-[#0B0C2A] border border-[#FFD700]/10 hover:border-[#FFD700]/30 shadow-lg"
              >
                <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                  {feature.icon}
                </div>
                <h3 className="font-title text-2xl mb-4 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="font-body text-[#BFA2DB] group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>
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
              className="font-body text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              Instagram
            </a>
            <a
              href="#"
              className="font-body text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              YouTube
            </a>
            <a
              href="#"
              className="font-body text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              Email
            </a>
          </div>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <a
              href="#"
              className="font-body hover:text-[#BFA2DB] transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="#"
              className="font-body hover:text-[#BFA2DB] transition-colors"
            >
              서비스 이용약관
            </a>
            <Link
              href="/contact"
              className="font-body hover:text-[#BFA2DB] transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
