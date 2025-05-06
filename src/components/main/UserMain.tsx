"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weather";

type Messages = {
  [key: string]: {
    [key: string]: string;
  };
};
interface UserMainProps {
  nickname: string;
}

export default function UserMain({ nickname }: UserMainProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const weather = await fetchWeather("Seoul");
      setWeatherData(weather);

      const res = await fetch("/data/weatherMessages.json");
      const json = await res.json();
      setMessages(json);
    };
    loadData();
  }, []);

  const getTimeSlot = (
    hour: number
  ): "morning" | "afternoon" | "evening" | "night" => {
    if (hour >= 5 && hour < 9) return "morning";
    if (hour >= 9 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  const getMessage = () => {
    if (!weatherData) return { line1: "", line2: "" };
    const hour = new Date().getHours();
    const timeSlot = getTimeSlot(hour);

    const description = weatherData.description.toLowerCase();

    // 날씨 키워드 맵핑
    const weatherKey = description.includes("비")
      ? "rain"
      : description.includes("눈")
      ? "snow"
      : description.includes("구름")
      ? "clouds"
      : description.includes("맑음") || description.includes("clear")
      ? "clear"
      : description.includes("안개") || description.includes("흐림")
      ? "mist"
      : description.includes("천둥")
      ? "thunderstorm"
      : "clear"; // fallback

    const line1 = `${weatherData.city}의 날씨는 ${weatherData.description}, ${weatherData.temp}°C입니다.`;
    const line2 =
      messages?.[timeSlot]?.[weatherKey] ||
      "오늘도 조용히 나만의 속도로 흘러가요.";

    return { line1, line2 };
  };

  const { line1, line2 } = getMessage();

  return (
    <section
      className="relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      role="main"
      aria-label="사용자 메인 페이지"
    >
      {/* 메인 콘텐츠 */}
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
          {weatherData ? (
            <>
              <p className="text-white text-lg font-semibold">{line1}</p>
              <p className="text-[#BFA2DB] text-base">{line2}</p>
            </>
          ) : (
            <p className="text-gray-400">날씨 정보를 불러오는 중입니다...</p>
          )}
          {/* 서비스 소개 문구 */}
          <section className="mt-6 space-y-4" aria-label="서비스 소개">
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              오늘의 흐름을 카드에 담고,
              <br className="md:hidden" /> 감정과 질문을 별에 남겨보세요.
              <br />
              당신의 리딩은 별빛처럼 쌓여갑니다.
            </p>
          </section>
        </motion.div>

        {/* 메인 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"
        >
          {/* 별의 흐름 따라가기 */}
          <Link
            href="/tarot"
            className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
                aria-hidden="true"
              >
                🌟
              </motion.div>
              <h2 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                별의 흐름 따라가기
              </h2>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                오늘의 운세를 확인하고
                <br />
                새로운 통찰을 얻어보세요
              </p>
            </div>
          </Link>

          {/* 별에게 묻기 */}
          <Link
            href="/tarot"
            className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
                aria-hidden="true"
              >
                💫
              </motion.div>
              <h2 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                별에게 질문하기
              </h2>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                당신만의 특별한 질문으로
                <br />
                새로운 이야기를 시작하세요
              </p>
            </div>
          </Link>

          {/* 남겨둔 속삭임 읽기 */}
          <Link
            href="/record"
            className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl sm:text-5xl mb-2"
                aria-hidden="true"
              >
                📖
              </motion.div>
              <h2 className="font-title text-xl sm:text-2xl text-[#FFD700] group-hover:text-[#FFE566]">
                남겨둔 속삭임 읽기
              </h2>
              <p className="font-body text-[#BFA2DB] group-hover:text-white/90 text-sm sm:text-base">
                지나간 날들의 이야기를
                <br />
                다시 한 번 마주해보세요
              </p>
            </div>
          </Link>
        </motion.div>

        {/* 최근 기록 미리보기 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto px-4"
          aria-label="최근 기록"
        >
          <h2 className="font-title text-2xl text-[#FFD700] mb-6 text-center">
            최근의 별빛 기록
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 최근 기록 카드 */}
            <article
              className="p-6 bg-[#1C1635]/30 backdrop-blur-sm rounded-xl border border-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#FFD700]/30"
              tabIndex={0}
            >
              <time className="text-sm text-[#BFA2DB] mb-2 block">
                2024년 3월 21일
              </time>
              <h3 className="font-title text-lg text-[#FFD700] mb-2">
                오늘의 운세
              </h3>
              <p className="font-body text-white/80 text-sm line-clamp-3">
                새로운 시작을 알리는 별들의 움직임이 보입니다...
              </p>
            </article>
          </div>
        </motion.section>
      </div>
    </section>
  );
}
