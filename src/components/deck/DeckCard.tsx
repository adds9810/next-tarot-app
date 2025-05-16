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
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3
            className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
            onClick={() => router.push(`/deck/${deck.id}`)}
            role="button"
            tabIndex={0}
            aria-label={`${deck.title} 덱 수정하기`}
          >
            {deck.title}
          </h3>
          <p className="text-muted-foreground">{deck.description}</p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          aria-label={`${deck.title} 덱 삭제하기`}
        >
          삭제
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">카드 {cards.length}장</p>
        {cards.slice(0, 3).map((card) => (
          <div key={card.id} className="p-2 bg-muted/50 rounded-md text-sm">
            {card.title}
          </div>
        ))}
        {cards.length > 3 && (
          <p className="text-sm text-muted-foreground">
            외 {cards.length - 3}장의 카드가 더 있습니다
          </p>
        )}
      </div>
    </Card>
  );
}
