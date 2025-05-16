"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weather";
import { getWeatherEmoji } from "@/lib/getWeatherEmoji";

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
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const weather = await fetchWeather("Seoul");
      setWeatherData(weather);

      const res = await fetch("/data/weatherMessages.json");
      const json = await res.json();
      setMessages(json);
    };
    loadData();
  }, []); // 상태 추가

  // 날씨 데이터 로딩 완료 후 애니메이션 시작
  useEffect(() => {
    if (weatherData) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, 100); // 약간의 여유 시간 (0.1초 정도)

      return () => clearTimeout(timer);
    }
  }, [weatherData]);

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

    const emoji = getWeatherEmoji(weatherData.description);
    const line1 = (
      <span className="inline-flex items-center justify-center text-white text-lg md:text-xl font-semibold">
        {`${weatherData.city}의 날씨는`}
        <span
          role="img"
          aria-label={weatherData.description}
          className="ml-2 text-2xl md:text-3xl"
        >
          {emoji}
        </span>
        {`${weatherData.description}, ${weatherData.temp}°C입니다.`}
      </span>
    );
    const line2 =
      messages?.[timeSlot]?.[weatherKey] ||
      "오늘도 조용히 나만의 속도로 흘러가요.";

    return { line1, line2 };
  };

  const { line1, line2 } = getMessage();

  return (
    <section
      className="relative py-10 px-6 lg:px-8 flex flex-col items-center justify-center"
      role="main"
      aria-label="사용자 메인 페이지"
    >
      {/* 메인 콘텐츠 */}
      <div className="relative z-20 w-full max-w-6xl mx-auto space-y-12">
        {/* 환영 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-center space-y-6 px-4 md:px-8"
        >
          {/* 1. 타이틀 */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-title text-4xl md:text-5xl lg:text-6xl text-[#FFD700] leading-tight tracking-wide"
          >
            {nickname}님의 <br className="md:hidden" />
            별빛 일기장
          </motion.h1>

          {/* 2. 날씨 안내 */}
          {isAnimated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={weatherData ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-xl mx-auto space-y-2"
            >
              {weatherData ? (
                <>
                  <p className="text-white text-lg font-semibold">{line1}</p>
                  <p className="text-[#BFA2DB] text-base">{line2}</p>
                </>
              ) : (
                <p className="text-gray-400 text-base">
                  날씨 정보를 불러오는 중입니다.
                </p>
              )}
            </motion.div>
          )}

          {/* 3. 소개 문구 */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 space-y-4"
            aria-label="서비스 소개"
          >
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              오늘의 흐름을 카드에 담고,
              <br className="md:hidden" /> 감정과 질문을 별에 남겨보세요.
              <br />
              당신의 리딩은 별빛처럼 쌓여갑니다.
            </p>
          </motion.section>
        </motion.div>

        {/* 메인 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"
        >
          {/* 별의 흐름 따라가기 */}
          <Link
            href="/tarot?type=today"
            className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
            aria-label="오늘의 운세 확인하기"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
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
            href="/tarot?type=custom"
            className="group focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 rounded-2xl"
            aria-label="별에게 질문하기"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
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
            aria-label="이전 리딩 기록 보기"
          >
            <div className="h-full p-8 bg-[#1C1635]/50 backdrop-blur-sm rounded-2xl border border-[#FFD700]/20 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col items-center text-center space-y-4">
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
        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={isAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="max-w-5xl mx-auto px-4"
          aria-label="최근 기록"
        >
          <h2 className="font-title text-2xl text-[#FFD700] mb-6 text-center">
            최근 남긴 속삭임
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 여기에 최근 기록 카드들이 들어갈 예정 
          </div>
        </motion.section> */}
      </div>
    </section>
  );
}
