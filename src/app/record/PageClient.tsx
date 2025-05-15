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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LoadingIndicator from "@/components/LoadingIndicator";

const ITEMS_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 10;

export default function PageClient() {
  const supabase = createClientComponentClient();
  const [records, setRecords] = useState<RecordSummary[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<RecordSummary[]>([]);
  const [category, setCategory] = useState<RecordCategory | "전체">("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFiltered = category !== "전체" || searchTerm.trim() !== "";

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
      className="relative py-10 w-dvw px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록하기 섹션"
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <div className="container w-full text-center mx-auto relative z-10">
            <section
              className="space-y-4 animate-fade-in"
              aria-label="속삭임 기록 소개 영역"
            >
              <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                속삭임의 흔적
              </h1>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                당신의 이야기, 오늘 다시 꺼내 읽어보세요.
              </p>
            </section>

            {/* 검색 필터 */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              role="search"
              aria-label="기록 검색 및 필터"
              className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as RecordCategory | "전체")
                }
              >
                <SelectTrigger
                  className="w-full md:w-40 bg-white/5 text-white border-white/10"
                  aria-label="카테고리 선택"
                >
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
                type="search"
                className=" w-full md:w-80 text-white placeholder:text-white/50 bg-white/5 border-white/10"
                placeholder="제목, 내용, 키워드로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="검색어 입력"
              />
            </motion.form>

            {error ? (
              <p className="text-red-500 mt-8">{error}</p>
            ) : filteredRecords.length === 0 ? (
              <EmptyState
                title={
                  isFiltered
                    ? "찾으시는 흔적이 보이지 않아요."
                    : "아직 남겨진 흔적이 없어요."
                }
                description={
                  isFiltered
                    ? "조건을 바꿔 다시 찾아보거나, 새로운 기록을 남겨보세요."
                    : "당신의 첫 번째 이야기를 별빛 아래 남겨보세요."
                }
                buttonText="기록하러 가기"
                buttonLink="/record/create"
              />
            ) : (
              <>
                {/* CTA 버튼 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col justify-center items-center mt-8"
                >
                  <Link
                    href="/record/create"
                    className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0B0C2A] font-body text-base sm:text-lg overflow-hidden font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
                    aria-label="기록 남기기 페이지로 이동"
                    role="button"
                  >
                    <div
                      className="absolute inset-0 bg-white/20 transform skew-x-0 translate-x-full group-hover:-skew-x-12 group-hover:translate-x-0 transition-transform duration-500 group-hover:scale-150"
                      aria-hidden="true"
                    />
                    <span className="relative text-lg text-[#0B0C2A] font-medium tracking-wide">
                      흔적 남기기
                    </span>
                  </Link>

                  {/* 통계 유도 버튼 */}
                  <div className="mt-6 w-full text-center" aria-live="polite">
                    <div className="inline-block px-4 py-3 rounded-lg bg-[#1C1635]/70 border border-[#FFD700]/20 shadow-sm">
                      <p className="text-sm text-[#FFD700]">
                        내가 자주 뽑은 카드와 흐름이 궁금하다면?{" "}
                        <Link
                          href="/analysis"
                          className="underline hover:text-[#FFE466] ml-1"
                          aria-label="기록 분석 페이지로 이동"
                        >
                          기록 분석하기 →
                        </Link>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* 카드 목록 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
                >
                  {pageRecords.map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </motion.div>

                {/* 페이지네이션 */}
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className="text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                      />
                    </PaginationItem>

                    {Array.from({ length: endPage - startPage + 1 }).map(
                      (_, i) => {
                        const page = startPage + i;
                        const isActive = page === currentPage;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              className={
                                isActive
                                  ? "bg-[#FFD700] text-[#0B0C2A] cursor-pointer"
                                  : "text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    )}

                    {endPage < totalPages && (
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#BFA2DB]" />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className="text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>{" "}
        </>
      )}
    </section>
  );
}
