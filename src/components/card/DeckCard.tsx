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
    <Card
      onClick={() => router.push(`/cards/${deck.id}`)}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow"
      tabIndex={0}
      role="button"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {deck.name || "제목 없음"}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2">
            {deck.description || "설명이 없습니다."}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          aria-label={`${deck.name} 덱 삭제하기`}
        >
          삭제
        </Button>
      </div>

      <div className="text-sm text-white/80 mt-3">
        <p className="mb-2">카드 {cards.length}장</p>
        <div className="space-y-1">
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
