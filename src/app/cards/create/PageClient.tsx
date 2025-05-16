import DeckForm from "@/components/card/DeckForm";

export default function PageClient() {
  return (
    <section
      className="relative py-10 w-dvw max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="덱/카드 등록 섹션"
    >
      <div className="w-full text-center mx-auto relative z-10 space-y-8">
        {/* 덱과 카드 생성 제목 및 설명 */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            덱/카드 생성
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            나만의 타로 덱을 등록해보세요.
          </p>
        </div>

        {/* 덱 생성 및 카드 생성 폼 */}
        <div className="w-full p-6 sm:p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
          <DeckForm isEditMode={false} />
        </div>
      </div>
    </section>
  );
}
