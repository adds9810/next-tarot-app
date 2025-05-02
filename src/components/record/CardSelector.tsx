"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Deck {
  id: string;
  name: string;
}

interface CardSelectorProps {
  selectedCards: Card[];
  onChange: (cards: Card[]) => void;
  maxCards: number;
  isMain: boolean;
}

export default function CardSelector({
  selectedCards,
  onChange,
  maxCards,
  isMain,
}: CardSelectorProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("all");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  useEffect(() => {
    fetchCards();
  }, [selectedDeck]);

  const fetchDecks = async () => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.from("decks").select("*");
      if (error) throw error;
      setDecks(data || []);
    } catch (error) {
      console.error("Error fetching decks:", error);
      toast({
        title: "덱 목록을 불러오는데 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const fetchCards = async () => {
    try {
      const supabase = createClientComponentClient();
      let query = supabase.from("cards").select("*");

      if (selectedDeck !== "all") {
        query = query.eq("deck_id", selectedDeck);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast({
        title: "카드 목록을 불러오는데 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const handleCardSelect = async (card: Card) => {
    if (selectedCards.length >= maxCards) {
      toast({
        title: `최대 ${maxCards}장까지만 선택할 수 있습니다`,
        variant: "destructive",
      });
      return;
    }

    if (selectedCards.some((selected) => selected.id === card.id)) {
      toast({
        title: "이미 선택된 카드입니다",
        variant: "destructive",
      });
      return;
    }

    const newSelectedCards = [...selectedCards, card];
    onChange(newSelectedCards);
  };

  const handleCardRemove = (cardId: string) => {
    const newSelectedCards = selectedCards.filter((card) => card.id !== cardId);
    onChange(newSelectedCards);
  };

  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedDeck === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDeck("all")}
          className={
            selectedDeck === "all"
              ? "bg-white/10 text-white"
              : "text-white hover:bg-white/10"
          }
        >
          전체
        </Button>
        {decks.map((deck) => (
          <Button
            key={deck.id}
            variant={selectedDeck === deck.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDeck(deck.id)}
            className={
              selectedDeck === deck.id
                ? "bg-white/10 text-white"
                : "text-black hover:text-white hover:bg-white/10"
            }
          >
            {deck.name}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="카드명 또는 키워드로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            {isMain ? "메인 카드 선택" : "서브 카드 선택"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="카드 검색..." />
            <CommandEmpty>카드를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[200px]">
                {filteredCards.map((card) => (
                  <CommandItem
                    key={card.id}
                    onSelect={() => {
                      handleCardSelect(card);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCards.some((c) => c.id === card.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {card.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        {selectedCards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between rounded-md border border-white/10 p-2 bg-white/5"
          >
            <span className="text-white">{card.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => handleCardRemove(card.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
