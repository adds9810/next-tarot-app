"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import DeckCard from "./DeckCard";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"];

export default function DeckList() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const [userId, setUserId] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login?redirect=/deck");
        return;
      }

      const id = session.user.id;
      setUserId(id);
      fetchDecksAndCards(id);
    };

    fetchSessionAndData();
  }, []);

  const fetchDecksAndCards = async (uid: string) => {
    try {
      const { data: decksData, error: decksError } = await supabase
        .from("decks")
        .select("*")
        .eq("user_id", uid);

      if (decksError) throw decksError;

      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", uid);

      if (cardsError) throw cardsError;

      setDecks(decksData || []);
      setCards(cardsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "불러오기 실패",
        description: "덱과 카드를 불러오는데 실패했습니다.",
      });
      router.push("/deck");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!deckToDelete) return;

    try {
      const { error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deckToDelete.id);

      if (error) throw error;

      setDecks(decks.filter((deck) => deck.id !== deckToDelete.id));
      setCards(cards.filter((card) => card.deck_id !== deckToDelete.id));

      toast({
        title: "삭제 완료",
        description: "덱이 삭제되었습니다.",
      });
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "덱을 삭제하는데 실패했습니다.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeckToDelete(null);
    }
  };

  if (loading) {
    return <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1
          className="text-3xl font-bold text-primary"
          aria-label="내 덱과 카드 관리"
        >
          내 덱과 카드 관리
        </h1>
        <Button onClick={() => router.push("/deck/new")}>새 덱 만들기</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            cards={cards.filter((card) => card.deck_id === deck.id)}
            onDelete={() => {
              setDeckToDelete(deck);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>덱 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            정말로 이 덱을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeckToDelete(null);
              }}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeck}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
