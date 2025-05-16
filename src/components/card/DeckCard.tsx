"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"];

interface DeckCardProps {
  deck: Deck;
  cards: Card[];
  onDelete: () => void;
}

export default function DeckCard({ deck, cards, onDelete }: DeckCardProps) {
  const router = useRouter();

  return (
    <Card
      className="p-6 space-y-4 bg-[#1C1635]/50 border-[#FFD700]/10 hover:shadow-xl hover:border-[#FFD700]/30 cursor-pointer transition-all duration-300"
      onClick={() => router.push(`/deck/${deck.id}`)}
      role="button"
      aria-label={`${deck.title} 덱 수정 페이지로 이동`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-[#FFD700]">{deck.title}</h3>
          <p className="text-sm text-[#BFA2DB]">{deck.description}</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`${deck.title} 덱 삭제하기`}
        >
          삭제
        </Button>
      </div>

      <div className="space-y-1 text-sm text-white">
        <p className="text-[#BFA2DB]">카드 {cards.length}장</p>
        {cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="px-3 py-2 bg-[#2A1B4C]/40 border border-[#FFD700]/10 rounded-md"
          >
            {card.title}
          </div>
        ))}
        {cards.length > 3 && (
          <p className="text-xs text-[#BFA2DB]/70">
            외 {cards.length - 3}장의 카드가 더 있습니다
          </p>
        )}
      </div>
    </Card>
  );
}
