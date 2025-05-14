"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Card } from "@/types/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CardSelectorProps {
  type: "main" | "sub";
  selectedCards: Card[];
  onChange: (cards: Card[]) => void;
  maxCards?: number;
  excludeCardIds?: string[]; // ✅ 추가
}

export default function CardSelector({
  type,
  selectedCards,
  onChange,
  maxCards = 10,
  excludeCardIds,
}: CardSelectorProps) {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching cards:", error);
        return;
      }

      setCards(data || []);
    };

    fetchCards();
  }, [supabase]);

  const filteredCards = cards.filter((card) => {
    const searchLower = searchQuery.toLowerCase();

    // 🔽 1. excludeCardIds에 포함된 카드면 제외
    const isExcluded = excludeCardIds?.includes(card.id);
    if (isExcluded) return false;

    // 🔽 2. 검색 필터
    return (
      card.name.toLowerCase().includes(searchLower) ||
      card.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      ) ||
      card.deck_name.toLowerCase().includes(searchLower)
    );
  });

  const handleSelect = (card: Card) => {
    if (selectedCards.length >= maxCards) {
      return;
    }

    if (selectedCards.some((selected) => selected.id === card.id)) {
      return;
    }

    onChange([...selectedCards, card]);
    setOpen(false);
    setSearchQuery("");
  };

  const handleRemove = (cardId: string) => {
    onChange(selectedCards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-[#1C1635]/50 border-[#FFD700]/20 text-white hover:bg-[#1C1635]/70 hover:border-[#FFD700]/30"
          >
            {type === "main" ? "메인 카드 선택" : "서브 카드 선택"}
            <span className="text-[#BFA2DB] text-sm">
              {selectedCards.length}/{maxCards}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-[#1C1635] border-[#FFD700]/10">
          <Command className="w-full">
            <CommandInput
              placeholder="카드명, 키워드, 덱 이름으로 검색..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0 text-white placeholder:text-[#BFA2DB]/50"
            />
            <CommandEmpty className="py-6 text-center text-[#BFA2DB]">
              검색 결과가 없습니다.
            </CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {filteredCards.map((card) => (
                <CommandItem
                  key={card.id}
                  value={card.name}
                  onSelect={() => handleSelect(card)}
                  className="text-white hover:bg-[#281C40] cursor-pointer"
                  disabled={selectedCards.some(
                    (selected) => selected.id === card.id
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{card.name}</span>
                    <span className="text-sm text-[#BFA2DB]">
                      {card.deck_name} • {card.keywords.join(", ")}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCards.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch justify-stretch gap-2 flex-wrap">
          {selectedCards.map((card) => (
            <div
              key={card.id}
              className="w-auto flex items-center justify-between p-3 bg-[#1C1635]/50 border border-[#FFD700]/20 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="font-medium text-white">{card.name}</span>
                <span className="text-sm text-[#BFA2DB]">
                  {card.deck_name} • {card.keywords.join(", ")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(card.id)}
                className="h-8 w-8 text-[#BFA2DB] hover:text-white hover:bg-[#281C40]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
