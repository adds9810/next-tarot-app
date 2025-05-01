import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RecordCard from "@/components/RecordCard";
import EmptyState from "@/components/EmptyState";
export default async function recordPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: records, error } = await supabase
    .from("records")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("records", records);
  return (
    <section
      className="relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록하기 섹션"
    >
      <div className="relative z-20 text-center w-full max-w-7xl mx-auto animate-fade-in">
        {/* 감성적 소개 문구 */}
        <section
          className="mb-8 space-y-4 animate-fade-in"
          aria-label="서비스 소개"
        >
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            속삭임의 흔적
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            당신의 이야기, 오늘 다시 꺼내 읽어보세요.
          </p>
        </section>
        {/* 게시글 목록 */}
        {error && (
          <p className="text-red-400 mb-4">
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        )}
        {records && records.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 작성된 기록이 없어요"
            description="처음으로 별 속에 담긴 당신의 이야기를 남겨보세요."
            buttonText="기록하러 가기"
            buttonLink="/records/new"
          />
        )}
      </div>
    </section>
  );
}
