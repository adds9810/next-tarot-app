"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RecordCard from "./RecordCard";
import EmptyState from "../EmptyState";
import Link from "next/link";
import { motion } from "framer-motion";

interface Record {
  id: string;
  title: string;
  content: string;
  created_at: string;
  cards?: string[];
}

export default function RecordList() {
  const [records, setRecords] = useState<Record[]>([]);
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <EmptyState
        title="아직 작성된 기록이 없어요"
        description="처음으로 별 속에 담긴 당신의 이야기를 남겨보세요."
        buttonText="기록하러 가기"
        buttonLink="/records/new"
      />
    );
  }

  return (
    <>
      {" "}
      {/* CTA 버튼 그룹 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
      >
        <Link
          href="/record/new"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </>
  );
}
