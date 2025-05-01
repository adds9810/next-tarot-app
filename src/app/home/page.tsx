"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // 구글 로그인의 경우 이메일에서 닉네임 추출
      if (user.app_metadata.provider === "google") {
        const emailNickname = user.email?.split("@")[0] || "";
        setNickname(emailNickname);
      } else {
        // 일반 회원가입의 경우 저장된 닉네임 사용
        const userNickname = user.user_metadata.nickname;
        setNickname(userNickname || user.email?.split("@")[0] || "");
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"
        />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="relative z-20 w-full max-w-6xl mx-auto space-y-12">
        {/* 환영 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="font-title text-4xl md:text-5xl lg:text-6xl text-[#FFD700] leading-tight tracking-wide">
            {nickname}님의 별빛 일기장
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            오늘의 별빛이 전해주는 감정을 남겨보세요.
            <br />
            당신만의 질문, 오늘의 리딩, 하나의 이야기로 기록됩니다.
          </p>
        </motion.div>

        {/* 메인 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"
        >
          {/* 별의 흐름 따라가기 */}
          <Link href="/fortune" className="group">
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
              >
                🌟
              </motion.div>
              <h3 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                별의 흐름 따라가기
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                오늘의 운세를 확인하고
                <br />
                새로운 통찰을 얻어보세요
              </p>
            </div>
          </Link>

          {/* 별에게 묻기 */}
          <Link href="/chat" className="group">
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
              >
                💫
              </motion.div>
              <h3 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                별에게 질문하기
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                당신만의 특별한 질문으로
                <br />
                새로운 이야기를 시작하세요
              </p>
            </div>
          </Link>

          {/* 남겨둔 속삭임 읽기 */}
          <Link href="/record" className="group">
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
              >
                📖
              </motion.div>
              <h3 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                남겨둔 속삭임 읽기
              </h3>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                지나간 날들의 이야기를
                <br />
                다시 한 번 마주해보세요
              </p>
            </div>
          </Link>
        </motion.div>

        {/* 최근 기록 미리보기 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto px-4"
        >
          <h2 className="font-title text-2xl text-[#FFD700] mb-6 text-center">
            최근의 별빛 기록
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 여기에 최근 기록 카드들이 들어갈 예정입니다 */}
            {/* 실제 데이터 연동 시 map으로 처리할 예정입니다 */}
            <div className="p-6 bg-[#1C1635]/30 backdrop-blur-sm rounded-xl border border-[#FFD700]/10">
              <p className="text-sm text-[#BFA2DB] mb-2">2024년 3월 21일</p>
              <h3 className="font-title text-lg text-[#FFD700] mb-2">
                오늘의 운세
              </h3>
              <p className="font-body text-white/80 text-sm line-clamp-3">
                새로운 시작을 알리는 별들의 움직임이 보입니다...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
