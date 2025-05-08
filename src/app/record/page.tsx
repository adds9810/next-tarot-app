"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import ClientStarryBackground from "@/components/ClientStarryBackground";
import RecordCard from "@/components/record/RecordCard";
import EmptyState from "@/components/EmptyState";
import { RecordSummary } from "@/types/record";

export default function RecordPage() {
  const [records, setRecords] = useState<RecordSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setRecords([]);
          return;
        }

        const { data, error } = await supabase
          .from("records")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (error) {
        console.error("Error fetching records:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [supabase]);

  return (
    <section
      className="relative py-12 px-4 w-screen sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록하기 섹션"
    >
      <ClientStarryBackground />
      <div className="container w-full text-center mx-auto relative z-10">
        {/* 소개 문구 */}
        <section className="space-y-4 animate-fade-in" aria-label="서비스 소개">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            속삭임의 흔적
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            당신의 이야기, 오늘 다시 꺼내 읽어보세요.
          </p>
        </section>

        {/* 에러/로딩 처리 */}
        {loading ? (
          <div className="text-center py-8">
            <p>로딩 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            title="아직 작성된 기록이 없어요"
            description="처음으로 별 속에 담긴 당신의 이야기를 남겨보세요."
            buttonText="기록하러 가기"
            buttonLink="/record/create"
          />
        ) : (
          <>
            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
            >
              <Link
                href="/record/create"
                className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                aria-label="기록 흔적 남기기"
              >
                <div
                  className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                  aria-hidden="true"
                />
                <span className="relative font-body text-lg text-[#0B0C2A] font-medium tracking-wide">
                  흔적 남기기
                </span>
              </Link>
            </motion.div>

            {/* 기록 카드 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
