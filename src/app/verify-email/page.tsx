"use client";

import Link from "next/link";

export default function VerifyEmail() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-20 text-center px-4">
        <div className="bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#FFD700]/20 max-w-md mx-auto">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="font-title text-3xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            이메일을 확인해 주세요
          </h1>
          <p className="font-body text-lg text-white/90 mb-6">
            가입하신 이메일 주소로 인증 링크를 보내드렸습니다.
            <br />
            이메일을 확인하고 링크를 클릭하여 가입을 완료해 주세요.
          </p>
          <div className="space-y-4">
            <p className="font-body text-sm text-[#BFA2DB]">
              이메일이 도착하지 않았나요?
              <br />
              스팸 메일함도 확인해 주세요.
            </p>
            <Link
              href="/login"
              className="inline-block font-body text-[#FFD700] hover:text-[#FFE566] transition-colors"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
