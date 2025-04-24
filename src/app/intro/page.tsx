import Link from "next/link";
import Image from "next/image";

export default function Intro() {
  return (
    <main
      className="min-h-screen bg-[#0B0C2A] text-white overflow-hidden"
      role="main"
    >
      <section
        className="relative md:h-[calc(100dvh-76px)] flex items-center justify-center"
        aria-label="인트로 페이지 메인 섹션"
      >
        {/* 배경 이미지 및 효과 */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="/images/starry-night.jpg"
            alt="별이 빛나는 밤하늘 배경"
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C2A] via-[#281C40]/80 to-[#0B0C2A] z-10" />

          {/* 별빛 효과 */}
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

          {/* 유성 효과 */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-shooting-star"
              style={{
                top: `${Math.random() * 70}%`,
                left: `${Math.random() * 70}%`,
                width: "2px",
                height: "2px",
                background: "linear-gradient(90deg, #FFD700, transparent)",
                boxShadow: "0 0 10px #FFD700",
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-20 container mx-auto px-4 py-16 flex flex-col items-center">
          {/* 헤더 */}
          <header className="text-center mb-20 w-full">
            <h1 className="font-title text-3xl md:text-5xl text-[#FFD700] mb-6 leading-relaxed tracking-wide animate-fade-in-up delay-0 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
              별들이 전하는 메시지에 귀 기울여보세요
              <span className="block mt-3 text-white text-2xl md:text-4xl font-light animate-fade-in-up delay-200">
                당신만의 타로 여정이 시작됩니다
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-white mb-10 animate-fade-in-up delay-400 tracking-wider">
              78장의 카드, 그리고 당신의 이야기
            </p>
            <nav className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-600">
              <Link
                href="/"
                className="button-glow font-body bg-[#FFD700] text-[#0B0C2A] px-8 py-3.5 rounded-full text-base hover:bg-[#FFE566] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0B0C2A] transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50"
                aria-label="운세 시작하기"
              >
                운세 시작하기
              </Link>
              <Link
                href="/cards"
                className="button-glow font-body bg-transparent border-2 border-[#FFD700] text-[#FFD700] px-8 py-3.5 rounded-full text-base hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-[#0B0C2A] transition-all duration-300 shadow-lg"
                aria-label="타로 카드 보기"
              >
                타로 카드 보기
              </Link>
            </nav>
          </header>

          {/* 타로 소개 카드 */}
          <section
            className="w-full max-w-5xl mx-auto animate-fade-in-up delay-800"
            aria-label="타로 카드 소개"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "타로의 기원",
                  description: "신비로운 상징의 시작",
                  icon: "🌟",
                  delay: "delay-800",
                },
                {
                  title: "카드의 의미",
                  description: "당신 삶의 비밀을 해석",
                  icon: "🔮",
                  delay: "delay-900",
                },
                {
                  title: "리딩의 힘",
                  description: "내면을 비추는 대화",
                  icon: "✨",
                  delay: "delay-1000",
                },
                {
                  title: "당신의 여정",
                  description: "변화와 성장의 길",
                  icon: "🌠",
                  delay: "delay-1000",
                },
              ].map((feature, index) => (
                <article
                  key={index}
                  className={`group card-hover bg-gradient-to-br from-[#281C40]/95 to-[#0B0C2A]/95 backdrop-blur-sm p-8 rounded-2xl transform transition-all duration-500 hover:from-[#281C40] hover:to-[#0B0C2A] border border-[#FFD700]/10 hover:border-[#FFD700]/30 animate-fade-in-up ${feature.delay} shadow-lg`}
                  tabIndex={0}
                >
                  <div
                    className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-title text-2xl mb-3 text-[#FFD700] group-hover:text-[#FFE566] transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">
                    {feature.title}
                  </h3>
                  <p className="font-body text-lg text-white/90 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
