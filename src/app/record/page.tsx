"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import RecordCard from "@/components/record/RecordCard";
import EmptyState from "@/components/EmptyState";
import { RecordSummary, RecordCategory } from "@/types/record";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 10;

export default function RecordPage() {
  const supabase = createClientComponentClient();
  const [records, setRecords] = useState<RecordSummary[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RecordSummary[]>([]);
  const [category, setCategory] = useState<RecordCategory | "전체">("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterRecords = (all: RecordSummary[]) => {
    return all.filter((record) => {
      const matchesCategory =
        category === "전체" || record.category === category;
      const keywordMatch = [
        record.title,
        record.content,
        ...(record.cards || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && keywordMatch;
    });
  };

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return setRecords([]);

        const { data, error } = await supabase
          .from("records")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setRecords(data || []);
        setFilteredRecords(filterRecords(data || []));
      } catch (err) {
        setError("기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [supabase]);

  useEffect(() => {
    const newFiltered = filterRecords(records);
    setFilteredRecords(newFiltered);
    setCurrentPage(1); // 검색 조건 변경 시 첫 페이지로 초기화
  }, [searchTerm, category]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const currentGroup = Math.floor((currentPage - 1) / MAX_PAGE_BUTTONS);
  const startPage = currentGroup * MAX_PAGE_BUTTONS + 1;
  const endPage = Math.min(startPage + MAX_PAGE_BUTTONS - 1, totalPages);
  const pageRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section
      className="relative py-12 px-4 w-screen sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록하기 섹션"
    >
      {/* 메인 콘텐츠 */}
      <div className="container w-full text-center mx-auto relative z-10">
        <section className="space-y-4 animate-fade-in" aria-label="서비스 소개">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            속삭임의 흔적
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            당신의 이야기, 오늘 다시 꺼내 읽어보세요.
          </p>
        </section>

        {/* 검색 필터 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value as RecordCategory | "전체")
            }
          >
            <SelectTrigger className="w-40 bg-white/5 text-white border-white/10">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="bg-[#1C1635] text-white border-white/10">
              {[
                "전체",
                "오늘의 운세",
                "연애 / 관계",
                "진로 / 직업",
                "건강 / 감정",
                "재정 / 돈",
                "자기 성찰",
                "기타",
              ].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="max-w-md w-full md:w-80 text-white placeholder:text-white/50 bg-white/5 border-white/10"
            placeholder="제목, 내용, 키워드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-white mt-8">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500 mt-8">{error}</p>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="기록이 없습니다"
            description="조건에 맞는 기록이 없습니다. 필터를 조정해보세요."
            buttonText="기록하러 가기"
            buttonLink="/record/create"
          />
        ) : (
          <>
            {/* CTA 버튼 */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/record/create">
                <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-8 py-4 text-lg">
                  흔적 남기기
                </Button>
              </Link>
            </motion.div>

            {/* 통계 유도 버튼 */}
            <div className="mt-6 w-full text-center">
              <div className="inline-block px-4 py-3 rounded-lg bg-[#1C1635]/70 border border-[#FFD700]/20 shadow-sm">
                <p className="text-sm text-[#FFD700]">
                  내가 자주 뽑은 카드와 흐름이 궁금하다면?{" "}
                  <Link
                    href="/analysis"
                    className="underline hover:text-[#FFE466] ml-1"
                  >
                    기록 분석하기 →
                  </Link>
                </p>
              </div>
            </div>

            {/* 카드 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {pageRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                variant="outline"
              >
                처음
              </Button>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                variant="outline"
              >
                이전
              </Button>

              {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
                const page = startPage + i;
                return (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={page === currentPage ? "default" : "outline"}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                variant="outline"
              >
                다음
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                variant="outline"
              >
                끝
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
