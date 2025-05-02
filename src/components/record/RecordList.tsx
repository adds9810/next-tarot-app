"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RecordCard from "./RecordCard";
import EmptyState from "../EmptyState";

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
      try {
        const { data, error } = await supabase
          .from("records")
          .select("*")
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
