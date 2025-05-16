"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeckCard from "@/components/card/DeckCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"];

export default function CardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Deck | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?redirect=/cards");
        return;
      }

      try {
        const { data: decksData } = await supabase
          .from("decks")
          .select("*")
          .eq("user_id", session.user.id);

        const { data: cardsData } = await supabase
          .from("cards")
          .select("*")
          .eq("user_id", session.user.id);

        setDecks(decksData || []);
        setCards(cardsData || []);
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "불러오기 실패",
          description: "덱/카드를 불러오는데 실패했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase, toast]);

  const handleDeleteDeck = async () => {
    if (!deleteTarget) return;

    try {
      await supabase.from("decks").delete().eq("id", deleteTarget.id);
      setDecks(decks.filter((d) => d.id !== deleteTarget.id));
      setCards(cards.filter((c) => c.deck_id !== deleteTarget.id));
      toast({ title: "삭제 완료", description: "덱이 삭제되었습니다." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "덱 삭제 중 오류가 발생했습니다.",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />;
  }

  return (
    <section className="py-10 px-4 md:px-8 max-w-6xl mx-auto space-y-8 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-title text-[#FFD700]">
          내 덱과 카드 관리
        </h1>
        <Button onClick={() => router.push("/cards/new")}>새 덱 만들기</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            cards={cards.filter((card) => card.deck_id === deck.id)}
            onDelete={() => setDeleteTarget(deck)}
          />
        ))}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>덱 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            정말로 <strong>{deleteTarget?.title}</strong> 덱을 삭제하시겠습니까?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeck}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
