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
    record.image_urls && record.image_urls.length > 0
      ? record.image_urls[0]
      : null;
  return (
    <Link href={`/record/${record.id}`} passHref>
      <MotionDiv
        className="p-6 bg-[#0B0C2A] rounded-2xl border border-[#FFD70020] shadow-xl hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/20 mb-3">
            {thumbnail ? (
              <Image
                src={thumbnail}
                priority
                alt={record.title}
                sizes="(max-width: 768px) 100vw, 33vw"
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <Image
                src="/images/them/board.png"
                alt="기본 썸네일 이미지"
                fill
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
          {record.category && (
            <span className="text-xs text-[#FFD700] bg-[#FFD70020] px-2 py-1 rounded-full inline-block mb-1">
              {record.category}
            </span>
          )}
          <h3 className="text-lg font-semibold text-white truncate">
            {record.title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2">{record.content}</p>
          {record.cards && record.cards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {record.cards.map((card, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-[#FFD700] text-[#0B0C2A]"
                >
                  {card}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500">
            {new Date(record.created_at).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </MotionDiv>
    </Link>
  );
}
