"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"];

export default function DeckManager() {
  const { data: session } = useSession();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeckDialogOpen, setIsDeckDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [newDeck, setNewDeck] = useState({ title: "", description: "" });
  const [newCard, setNewCard] = useState({
    title: "",
    content: "",
    deck_id: "",
  });

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (session?.user) {
      fetchDecksAndCards();
    }
  }, [session]);

  const fetchDecksAndCards = async () => {
    try {
      const { data: decksData, error: decksError } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", session?.user.id);

      if (decksError) throw decksError;

      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", session?.user.id);

      if (cardsError) throw cardsError;

      setDecks(decksData || []);
      setCards(cardsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async () => {
    try {
      const { data, error } = await supabase
        .from("decks")
        .insert([
          {
            title: newDeck.title,
            description: newDeck.description,
            user_id: session?.user.id,
          },
        ])
        .select();

      if (error) throw error;

      setDecks([...decks, data[0]]);
      setIsDeckDialogOpen(false);
      setNewDeck({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  const handleCreateCard = async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .insert([
          {
            title: newCard.title,
            content: newCard.content,
            deck_id: newCard.deck_id,
            user_id: session?.user.id,
          },
        ])
        .select();

      if (error) throw error;

      setCards([...cards, data[0]]);
      setIsCardDialogOpen(false);
      setNewCard({ title: "", content: "", deck_id: "" });
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm("정말로 이 덱을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("decks").delete().eq("id", deckId);

      if (error) throw error;

      setDecks(decks.filter((deck) => deck.id !== deckId));
      setCards(cards.filter((card) => card.deck_id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("정말로 이 카드를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) throw error;

      setCards(cards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  if (loading) {
    return <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">내 덱과 카드 관리</h1>
        <div className="space-x-4">
          <Dialog open={isDeckDialogOpen} onOpenChange={setIsDeckDialogOpen}>
            <DialogTrigger asChild>
              <Button>새 덱 만들기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 덱 만들기</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="덱 제목"
                  value={newDeck.title}
                  onChange={(e) =>
                    setNewDeck({ ...newDeck, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="덱 설명"
                  value={newDeck.description}
                  onChange={(e) =>
                    setNewDeck({ ...newDeck, description: e.target.value })
                  }
                />
                <Button onClick={handleCreateDeck}>만들기</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">새 카드 만들기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 카드 만들기</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <select
                  className="w-full p-2 border rounded-md"
                  value={newCard.deck_id}
                  onChange={(e) =>
                    setNewCard({ ...newCard, deck_id: e.target.value })
                  }
                >
                  <option value="">덱을 선택하세요</option>
                  {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                      {deck.title}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="카드 제목"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard({ ...newCard, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="카드 내용"
                  value={newCard.content}
                  onChange={(e) =>
                    setNewCard({ ...newCard, content: e.target.value })
                  }
                />
                <Button onClick={handleCreateCard}>만들기</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{deck.title}</h3>
                <p className="text-muted-foreground">{deck.description}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteDeck(deck.id)}
                aria-label={`${deck.title} 덱 삭제`}
              >
                삭제
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                카드 {cards.filter((card) => card.deck_id === deck.id).length}장
              </p>
              {cards
                .filter((card) => card.deck_id === deck.id)
                .map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                  >
                    <span>{card.title}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                      aria-label={`${card.title} 카드 삭제`}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
