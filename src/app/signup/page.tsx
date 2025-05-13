"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthError } from "@supabase/supabase-js";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const router = useRouter();
  const supabase = createClientComponentClient();
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
    if (hasUpperCase || hasLowerCase) combinationCount++;
    if (hasNumbers) combinationCount++;
    if (hasSpecialChar) combinationCount++;

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
          data: { nickname: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

  const handleGoogleSignUp = async () => {
    try {
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
      if (error) throw error;
    } catch (error) {
      setError("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="relative py-10 px-4 w-dvw sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="relative z-20 text-center w-full max-w-lg mx-auto animate-fade-in">
        <section className="mb-8 space-y-4" aria-label="서비스 소개">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            당신만의 <br className="md:hidden" /> 별자리를 등록하고
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            감정의 여정을 시작해보세요.
          </p>
        </section>

        <div className="w-full max-w-sm mx-auto animate-fade-in-delay">
          <div className="p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-200">
            {/* 소셜 회원가입 */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 bg-white/90 text-gray-800 hover:bg-white transition-colors text-base focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
                aria-label="Google로 별자리 등록하기"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google로 별자리 등록하기
              </Button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#FFD700]/20" />
              </div>
              <div className="relative bg-[#281C40] px-4 text-sm text-[#BFA2DB] font-body">
                또는 이메일로 등록하기
              </div>
            </div>

            <form
              onSubmit={handleSignUp}
              className="space-y-6"
              aria-label="회원가입 폼"
            >
              <div className="text-left">
                <Label
                  htmlFor="name"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신을 부를 이름은?
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="닉네임을 입력해주세요"
                  required
                  aria-required="true"
                />
              </div>

              <div className="text-left">
                <Label
                  htmlFor="email"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  별빛을 받을 주소는?
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body text-base"
                  placeholder="이메일을 입력해주세요"
                  required
                  aria-required="true"
                />
              </div>

              <div className="text-left">
                <Label
                  htmlFor="password"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  당신만의 비밀 열쇠
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 bg-[#0B0C2A]/80 border ${
                    passwordError ? "border-red-500" : "border-[#FFD700]/10"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all duration-300 font-body text-base`}
                  placeholder="비밀번호를 입력해주세요"
                  required
                  aria-required="true"
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-400 font-body">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="text-left">
                <Label
                  htmlFor="confirmPassword"
                  className="block font-body text-base text-[#BFA2DB] mb-2"
                >
                  비밀 열쇠 재확인
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-[#0B0C2A]/80 border ${
                    password !== confirmPassword && confirmPassword
                      ? "border-red-500"
                      : "border-[#FFD700]/10"
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all duration-300 font-body text-base`}
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
              <Button
                type="submit"
                disabled={loading}
                className="group px-6 py-3 w-full min-w-[200px] bg-[#FFD700] text-[#0B0C2A]  rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
              >
                {loading ? "별자리 생성 중..." : "나만의 별자리 완성하기"}
              </Button>
            </form>

            <div className="mt-6 text-center text-base text-[#BFA2DB] font-body">
              <p>
                이미 별자리가 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-[#FFD700] hover:text-[#FFE566] hover:underline underline-offset-4 decoration-[#FFD700]/30 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-sm block md:inline"
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
