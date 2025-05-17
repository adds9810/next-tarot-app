"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

interface PageBackgroundProps {
  children: ReactNode;
}

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}

export default function PageBackground({ children }: PageBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    // 일반 별들 생성
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));

    // 별똥별 생성
    const newShootingStars = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 30}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 10 + i * 2,
    }));

    setStars(newStars);
    setShootingStars(newShootingStars);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div className="fixed inset-0 -z-10">
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
            opacity: 0.9,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070817]/60 via-[#1C1635]/80 to-[#070817] z-10" />
      </div>

      {/* 일반 별들 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
          className="fixed z-10"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "#FFD700",
            borderRadius: "50%",
            boxShadow: "0 0 4px #FFD700",
          }}
          aria-hidden="true"
        />
      ))}

      {/* 별똥별 */}
      {shootingStars.map((star) => (
        <motion.div
          key={`shooting-${star.id}`}
          initial={{
            opacity: 0,
            top: star.top,
            left: star.left,
          }}
          animate={{
            opacity: [0, 1, 0],
            top: ["0%", "100%"],
            left: [star.left, `${parseInt(star.left) + 20}%`],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
          className="fixed z-10"
          style={{
            width: "2px",
            height: "40px",
            background:
              "linear-gradient(to bottom, rgba(255,215,0,0), #FFD700)",
            transform: "rotate(45deg)",
            boxShadow: "0 0 4px #FFD700",
          }}
          aria-hidden="true"
        />
      ))}

      {/* 메인 콘텐츠 */}
      <div className="relative min-h-[calc(100dvh-110px)] w-full pt-16 md:pt-20 flex items-center justify-center z-20">
        {children}
      </div>
    </motion.div>
  );
}
