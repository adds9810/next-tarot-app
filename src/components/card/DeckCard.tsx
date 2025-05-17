"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type CardType = Database["public"]["Tables"]["cards"]["Row"];
type ExtendedDeck = Deck & {
  image_url?: string;
};
interface DeckCardProps {
  deck: ExtendedDeck;
  cards: CardType[];
  onDelete: () => void;
}

export default function DeckCard({ deck, cards, onDelete }: DeckCardProps) {
  const defaultImage = "/images/them/default-deck.png";
  const router = useRouter();
  const handleCardClick = () => {
    router.push(`/cards/${deck.id}`);
  };
  // console.log("Deck image URL: ", deck.image_url);

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer p-6 bg-[#0B0C2A] rounded-2xl border border-[#FFD70020] shadow-xl hover:shadow-2xl transition-all duration-300 space-y-3"
      tabIndex={0}
      role="button"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center">
            {/* 덱 이미지 */}
            <img
              src={deck.image_url || defaultImage} // image_url이 없으면 기본 이미지로 표시
              alt={deck.name}
              className="object-cover w-16 h-16 rounded-md"
            />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
              {deck.name || "제목 없음"}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2">
              {deck.description || "설명이 없습니다."}
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete();
          }}
          aria-label={`${deck.name} 덱 삭제하기`}
        >
          삭제
        </Button>
      </div>

      <div className="text-sm text-white/80 mt-3">
        <p className="mb-2">카드 {cards.length}장</p>
        <div className="space-y-1">
          {/* 카드 이름을 보여주는 부분 */}
          {cards.slice(0, 3).map((card) => (
            <p
              key={card.id}
              className="truncate bg-white/10 text-white px-3 py-1 rounded"
            >
              {card.name || "제목 없음"}
            </p>
          ))}
          {cards.length > 3 && (
            <p className="text-xs text-white/60 pt-1">
              외 {cards.length - 3}장의 카드가 더 있습니다
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
