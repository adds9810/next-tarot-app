"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type CardType = Database["public"]["Tables"]["cards"]["Row"];

interface DeckCardProps {
  deck: Deck;
  cards: CardType[];
  onDelete: () => void;
}

export default function DeckCard({ deck, cards, onDelete }: DeckCardProps) {
  const router = useRouter();

  return (
    <Card className="p-6 bg-white/5 border border-white/10 text-white space-y-4 hover:shadow-lg transition-shadow">
      {/* 덱 제목 및 설명 */}
      <div className="flex justify-between items-start">
        <div
          className="space-y-1 cursor-pointer"
          onClick={() => router.push(`/cards/${deck.id}`)}
        >
          <h3 className="text-lg font-semibold text-white hover:text-[#FFD700] transition-colors">
            {deck.title}
          </h3>
          <p className="text-sm text-white/70">{deck.description}</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="text-sm"
          aria-label={`${deck.title} 덱 삭제하기`}
        >
          삭제
        </Button>
      </div>

      {/* 카드 미리보기 */}
      <div className="space-y-2 mt-2">
        <p className="text-sm text-white/60">카드 {cards.length}장</p>
        {cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="px-3 py-2 bg-white/10 text-sm rounded border border-white/10 text-white/90"
          >
            {card.title}
          </div>
        ))}
        {cards.length > 3 && (
          <p className="text-sm text-white/50">
            외 {cards.length - 3}장의 카드가 더 있습니다
          </p>
        )}
      </div>
    </Card>
  );
}
