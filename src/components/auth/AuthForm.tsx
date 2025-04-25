"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (type === "signup") {
        if (password !== confirmPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccess("인증 이메일을 보냈습니다. 이메일을 확인해주세요 ✨");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError("구글 로그인 중 오류가 발생했습니다.");
    }
  };

  const handleNaverLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "naver",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError("네이버 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#BFA2DB]/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0B0C2A] text-[#BFA2DB]">
              SNS 계정으로 {type === "login" ? "로그인" : "회원가입"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-[#BFA2DB]/30 rounded-full bg-[#281C40]/50 hover:bg-[#281C40]/70 transition-colors"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-[#BFA2DB]">Google</span>
          </button>

          <button
            type="button"
            onClick={handleNaverLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-[#BFA2DB]/30 rounded-full bg-[#281C40]/50 hover:bg-[#281C40]/70 transition-colors"
          >
            <Image
              src="/images/naver-logo.svg"
              alt="Naver"
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-[#BFA2DB]">Naver</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#BFA2DB]/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0B0C2A] text-[#BFA2DB]">
            또는 이메일로 {type === "login" ? "로그인" : "회원가입"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-[#BFA2DB] mb-2"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-body px-4 py-3 rounded-full bg-[#281C40]/50 border border-[#BFA2DB]/30 text-white placeholder-[#BFA2DB]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="별이 속삭이는 이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-[#BFA2DB] mb-2"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-body px-4 py-3 rounded-full bg-[#281C40]/50 border border-[#BFA2DB]/30 text-white placeholder-[#BFA2DB]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="별의 비밀을 입력하세요"
              required
            />
          </div>

          {type === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-body text-[#BFA2DB] mb-2"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full font-body px-4 py-3 rounded-full bg-[#281C40]/50 border border-[#BFA2DB]/30 text-white placeholder-[#BFA2DB]/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                placeholder="별의 비밀을 다시 한번 입력하세요"
                required
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-400 text-sm font-body">{error}</div>}

        {success && (
          <div className="text-[#FFD700] text-sm font-body">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-title bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#FFD700]/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0B0C2A]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {type === "login" ? "운세 보러 가기" : "별자리 등록하기"}
            </span>
          ) : type === "login" ? (
            "운세 보러 가기"
          ) : (
            "별자리 등록하기"
          )}
        </button>

        {type === "login" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                // 비밀번호 재설정 로직
              }}
              className="font-body text-[#BFA2DB] hover:text-[#FFD700] transition-colors duration-300"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
