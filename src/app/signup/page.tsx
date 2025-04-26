"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 16;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || password.length > maxLength) {
      return "별자리 암호는 8자에서 16자 사이여야 합니다";
    }

    let combinationCount = 0;
    if (hasUpperCase || hasLowerCase) combinationCount++; // 영문 포함
    if (hasNumbers) combinationCount++; // 숫자 포함
    if (hasSpecialChar) combinationCount++; // 특수문자 포함

    if (combinationCount < 2) {
      return "별자리 암호는 영문, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다";
    }

    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 비밀번호 유효성 검사
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("별자리 암호가 일치하지 않습니다");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: name,
          },
        },
      });

      if (error) throw error;

      if (data) {
        router.push(
          "/login?message=회원가입이 완료되었습니다. 이메일을 확인해 주세요."
        );
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("별자리 등록 중 오류가 발생했습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      aria-label="회원가입 섹션"
    >
      <div className="relative z-20 text-center px-4 w-full max-w-lg mx-auto animate-fade-in">
        {/* 감성적 소개 문구 */}
        <section className="mb-8 space-y-4" aria-label="서비스 소개">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            당신만의 <br className="md:hidden" /> 별자리를 등록하고
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            감정의 여정을 시작해보세요.
          </p>
        </section>

        {/* 회원가입 폼 */}
        <div className="w-full animate-fade-in-delay">
          <div className="p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-200">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="text-left">
                <label
                  htmlFor="name"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신을 부를 이름은?
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="닉네임을 입력해주세요"
                  required
                  aria-required="true"
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="email"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  별빛을 받을 주소는?
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="이메일을 입력해주세요"
                  required
                  aria-required="true"
                />
              </div>
              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신만의 비밀 열쇠
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 bg-[#0B0C2A]/80 border ${
                    passwordError ? "border-red-500" : "border-[#FFD700]/10"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base`}
                  placeholder="비밀번호를 입력해주세요"
                  required
                  aria-required="true"
                  minLength={6}
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400 font-body">
                    {passwordError}
                  </p>
                )}
                {/* <p className="mt-1 text-xs text-[#BFA2DB]/70 font-body">
                  8~16자의 영문, 숫자, 특수문자 중 2가지 이상을 조합해 주세요.
                </p> */}
              </div>
              <div className="text-left">
                <label
                  htmlFor="confirmPassword"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신만의 비밀 열쇠 재확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0B0C2A]/80 border ${
                    password !== confirmPassword && confirmPassword
                      ? "border-red-500"
                      : "border-[#FFD700]/10"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body`}
                  placeholder="비밀번호를 다시 한 번 입력하세요"
                />
                {password !== confirmPassword && confirmPassword && (
                  <p className="mt-1 text-xs text-red-400 font-body">
                    별자리 암호가 일치하지 않습니다
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="text-red-400 text-sm text-center font-body"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFD700] text-[#0B0C2A] px-6 py-4 rounded-lg hover:bg-[#FFE566] transition-colors font-body font-medium text-lg transform hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all duration-300"
              >
                {loading ? "별자리 생성 중..." : "나만의 별자리 완성하기"}
              </button>
            </form>

            <div className="mt-6 text-center text-base text-[#BFA2DB] font-body">
              <p>
                이미 별자리가 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-[#FFD700] hover:text-[#FFE566] transition-colors hover:underline decoration-[#FFD700]/30 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-sm block md:inline"
                >
                  별의 문 열기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
