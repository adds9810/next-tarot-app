"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { RecordSummary } from "@/types/record";

interface RecordCardProps {
  record: RecordSummary;
}

const MotionDiv = motion.div;

export default function RecordCard({ record }: RecordCardProps) {
  const thumbnail =
    record.main_card_image_url ||
    (record.image_urls && record.image_urls.length > 0
      ? record.image_urls[0]
      : "/images/them/board.png");

  return (
    <Link
      href={`/record/${record.id}`}
      passHref
      aria-label={`"${record.title}" 상세 보기`}
    >
      <MotionDiv
        className="h-full p-6 bg-[#0B0C2A] rounded-2xl border border-[#FFD70020] shadow-xl hover:shadow-2xl transition-all duration-300 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* 상단 라벨 */}
        <div className="flex justify-between items-center text-xs text-[#FFD700]">
          {record.category && (
            <span
              className="bg-[#FFD70020] px-2 py-1 rounded-full"
              aria-label={`카테고리: ${record.category}`}
            >
              {record.category}
            </span>
          )}
          <time
            dateTime={new Date(record.created_at).toISOString()}
            className="text-xs text-[#FFD70099]"
          >
            {new Date(record.created_at).toLocaleDateString("ko-KR")}
          </time>
        </div>

        {/* 이미지 */}
        <div
          className="relative aspect-video rounded-xl overflow-hidden bg-black/20"
          role="img"
          aria-label={record.title || "타로 카드 썸네일"}
        >
          <Image
            src={thumbnail}
            alt={record.title || "타로 카드 이미지"}
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 제목 */}
        <h3 className="text-base font-semibold text-white truncate">
          {record.title}
        </h3>

        {/* 내용 */}
        <p className="text-sm text-gray-300 line-clamp-2">{record.content}</p>

        {/* 카드 키워드 */}
        {Array.isArray(record.cards) && record.cards.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mt-2"
            aria-label="카드 키워드 목록"
          >
            {record.cards.map((card, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-[#FFD700] text-[#0B0C2A]"
                aria-label={`키워드: ${card}`}
              >
                {card}
              </span>
            ))}
          </div>
        )}
      </MotionDiv>
    </Link>
  );
}
