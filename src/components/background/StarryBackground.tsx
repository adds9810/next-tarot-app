import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

interface StarryBackgroundProps {
  enabled?: boolean;
}

export default function StarryBackground({
  enabled = true,
}: StarryBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // 사용자의 감소된 모션 설정 확인
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleReducedMotionChange);
    return () =>
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
  }, []);

  useEffect(() => {
    if (!enabled || isReducedMotion) {
      setStars([]);
      return;
    }

    const starColors = ["bg-white", "bg-yellow-100", "bg-blue-100"];

    const starCount = isMobile ? 35 : 60;
    const newStars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3.5 + 1.5, // 1.5px ~ 5px
      delay: Math.random() * 8, // 더 다양한 시작 시간
      duration: Math.random() * 4 + 3, // 3-7초
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));

    setStars(newStars);
  }, [enabled, isMobile, isReducedMotion]);

  if (!enabled || isReducedMotion || stars.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none "
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.color} shadow-[0_0_2px_#fff] animate-twinkle`}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
