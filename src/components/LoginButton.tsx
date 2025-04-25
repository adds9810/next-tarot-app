"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      alert("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-body px-4 py-2 rounded-full bg-[#281C40]/50 border border-[#BFA2DB]/30 text-white placeholder-[#BFA2DB]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="font-body px-4 py-2 rounded-full bg-[#281C40]/50 border border-[#BFA2DB]/30 text-white placeholder-[#BFA2DB]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="font-body bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
