"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  mode?: "login" | "signup";
}

interface AuthError {
  message: string;
}

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setSuccess("");

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }
        // 회원가입 로직 구현
      } else {
        // 로그인 로직 구현
      }
    } catch (err) {
      if (err instanceof Error) {
        setAuthError({ message: err.message });
      } else {
        setAuthError({ message: "알 수 없는 오류가 발생했습니다." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Google login error:", err);
      if (err instanceof Error) {
        setAuthError({ message: err.message });
      } else {
        setAuthError({ message: "구글 로그인 중 오류가 발생했습니다." });
      }
      setIsLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    try {
      // 네이버 로그인 로직 구현
    } catch (err) {
      if (err instanceof Error) {
        setAuthError({ message: err.message });
      } else {
        setAuthError({ message: "네이버 로그인 중 오류가 발생했습니다." });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">
          {mode === "login" ? "로그인" : "회원가입"}
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          {mode === "login" ? (
            <>
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                className="text-purple-400 hover:text-purple-300"
              >
                회원가입하기
              </Link>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300"
              >
                로그인하기
              </Link>
            </>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-200"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-200"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {mode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        )}

        {authError && (
          <div className="text-red-500 text-sm">{authError.message}</div>
        )}

        {success && <div className="text-green-500 text-sm">{success}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "처리중..." : mode === "login" ? "로그인" : "회원가입"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">소셜 로그인</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Image
              src="/google-icon.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Google
          </button>
          <button
            type="button"
            onClick={handleNaverLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-[#03C75A] text-sm font-medium text-white hover:bg-[#02b350]"
          >
            <Image
              src="/naver-icon.png"
              alt="Naver"
              width={20}
              height={20}
              className="mr-2"
            />
            Naver
          </button>
        </div>
      </div>
    </div>
  );
}
