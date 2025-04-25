"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
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
            nickname: nickname,
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
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError("Google 로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0C2A] text-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/starry-night.jpg"
            alt="Starry Night Background"
            fill
            priority
            className="object-cover object-center"
            quality={100}
            sizes="100vw"
            style={{
              objectPosition: "center",
              opacity: 0.6,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#281C40]/60 via-[#281C40]/80 to-[#0B0C2A] z-10" />

          {/* 별빛 효과 */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                background: "#FFD700",
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="relative z-20 text-center px-4">
          <h1 className="font-title text-3xl md:text-5xl text-[#FFD700] mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] animate-fade-in">
            새로운 별자리를 등록하고
            <br />
            운세의 세계로 들어오세요
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg animate-fade-in-delay tracking-wide">
            당신만의 별자리를 등록하면
            <br />더 특별한 운세를 받아볼 수 있습니다
          </p>

          {/* 회원가입 폼 */}
          <div className="w-full max-w-md mx-auto animate-fade-in-delay">
            <div className="p-8 bg-[#281C40]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300">
              <h2 className="font-title text-xl mb-6 text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                새로운 별자리 등록하기
              </h2>

              {/* 소셜 회원가입 버튼 */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-2 bg-white/90 text-gray-800 px-4 py-3 rounded-lg hover:bg-white transition-colors font-body"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google로 별자리 등록하기
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FFD700]/20"></div>
                </div>
                <div className="relative bg-[#281C40] px-4 text-sm text-[#BFA2DB] font-body">
                  또는 이메일로 등록하기
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label
                    htmlFor="nickname"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 이름 (닉네임)
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body"
                    placeholder="당신의 별자리 이름을 입력하세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 주소 (이메일)
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0B0C2A]/80 border border-[#FFD700]/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body"
                    placeholder="별자리 주소(이메일)를 입력하세요"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 암호
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 bg-[#0B0C2A]/80 border ${
                      passwordError ? "border-red-500" : "border-[#FFD700]/10"
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 focus:border-[#FFD700]/30 hover:border-[#FFD700]/30 transition-all duration-300 font-body`}
                    placeholder="별자리 암호를 입력하세요"
                  />
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-400 font-body">
                      {passwordError}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[#BFA2DB]/70 font-body">
                    8~16자의 영문, 숫자, 특수문자 중 2가지 이상을 조합해 주세요
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-body text-sm font-medium text-[#BFA2DB] mb-1"
                  >
                    별자리 암호 확인
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
                    placeholder="별자리 암호를 다시 한 번 입력하세요"
                  />
                  {password !== confirmPassword && confirmPassword && (
                    <p className="mt-1 text-xs text-red-400 font-body">
                      별자리 암호가 일치하지 않습니다
                    </p>
                  )}
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center font-body">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFD700] text-[#0B0C2A] px-4 py-3 rounded-lg hover:bg-[#FFE566] transition-colors font-body font-medium transform hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(255,215,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "별자리 생성 중..." : "별자리 등록하기"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-[#BFA2DB] font-body">
                이미 별자리가 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-[#FFD700] hover:text-[#FFE566] transition-colors hover:underline decoration-[#FFD700]/30 underline-offset-4"
                >
                  별자리 연결하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
