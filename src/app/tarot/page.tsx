"use client";

import { useState } from "react";
import axios from "axios";

export default function TarotPage() {
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/tarot-gpt", {
        card: "The Tower", // 테스트용 카드
        questionType: "today", // 또는 'custom'
      });
      setFortune(res.data.fortune);
    } catch (err) {
      setError("운세를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🃏 타로운세</h1>
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? "분석 중..." : "운세 보기"}
      </button>
      <div className="mt-6 text-lg whitespace-pre-line">
        {error ? <p className="text-red-500">{error}</p> : fortune}
      </div>
    </div>
  );
}
