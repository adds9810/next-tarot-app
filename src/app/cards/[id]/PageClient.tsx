"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeckForm from "@/components/card/DeckForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/types/supabase";
export type CardType = {
  name: string;
  notes: string;
  keywords: string[];
  image_url: string;
};

export default function PageClient() {
  const { id } = useParams(); // URL 파라미터에서 id를 가져옵니다.
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [deck, setDeck] = useState<any>(null); // 덱 데이터
  const [cards, setCards] = useState<CardType[]>([]); // 카드 데이터, 타입 지정
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDeckData = async () => {
      try {
        setLoading(true);

        // 덱 정보 가져오기
        const { data: deckData, error: deckError } = await supabase
          .from("decks")
          .select("*")
          .eq("id", id)
          .single();

        if (deckError || !deckData) {
          toast({
            title: "덱을 찾을 수 없습니다.",
            description: "유효한 덱 ID를 확인해 주세요.",
            variant: "destructive",
          });
          return;
        }

        setDeck(deckData);

        // 해당 덱의 카드 목록 가져오기
        const { data: cardsData, error: cardsError } = await supabase
          .from("cards")
          .select("*")
          .eq("deck_id", id);

        if (cardsError) {
          toast({
            title: "카드 목록을 불러오지 못했습니다.",
            description: "덱에 관련된 카드들을 불러오는 데 실패했습니다.",
            variant: "destructive",
          });
          return;
        }

        setCards(cardsData); // 제대로 된 타입으로 상태를 업데이트
      } catch (err) {
        toast({
          title: "덱 로딩 실패",
          description: "덱 정보를 불러오는 데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDeckData();
  }, [id, supabase, toast]);

  if (loading) {
    return <p>로딩 중...</p>; // 로딩 중 메시지
  }

  if (!deck) {
    return <p>덱 정보를 찾을 수 없습니다.</p>; // 덱 정보가 없는 경우
  }

  return (
    <section className="relative py-10 w-dvw max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full text-center mx-auto relative z-10 space-y-8">
        <div className="space-y-4 animate-fade-in">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            덱/카드 수정
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            등록한 나만의 타로 덱을 수정해보세요.
          </p>
        </div>

        {/* 덱 생성 및 카드 생성 폼 */}
        <div className="w-full p-6 sm:p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
          {/* deckId와 함께 카드 목록도 DeckForm으로 전달 */}
          <DeckForm deck={deck} cards={cards} isEditMode={true} />
        </div>
      </div>
    </section>
  );
}
