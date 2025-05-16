"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/types/card";
import { RecordCategory } from "@/types/record";
import RecordForm from "@/components/record/RecordForm";

interface PageClientProps {
  id: string;
}

export default function PageClient({ id }: PageClientProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<{
    title: string;
    content: string;
    interpretation: string;
    feedback: string;
    image_urls: string[];
    mainCards: Card[];
    subCards: Card[];
    category: RecordCategory;
  } | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("*")
          .eq("id", id)
          .single();

        if (recordError || !recordData)
          throw recordError || new Error("기록 데이터를 찾을 수 없습니다.");

        const { data: cardLinks, error: linkError } = await supabase
          .from("record_cards")
          .select(
            `
          type,
          cards:card_id (
            id, name, keywords, image_url, deck_id, deck_name
          )
        `
          )
          .eq("record_id", id);

        if (linkError) throw linkError;

        const safeCardLinks = (cardLinks ?? []) as {
          type: "main" | "sub";
          cards: Partial<Card> | null;
        }[];

        const extractCards = (type: "main" | "sub") =>
          safeCardLinks
            .filter((c) => c.type === type && c.cards?.id)
            .map((c) => ({
              id: c.cards!.id ?? "",
              name: c.cards!.name ?? "",
              keywords: c.cards!.keywords ?? [],
              image_url: c.cards!.image_url ?? "",
              deck_id: c.cards!.deck_id ?? "",
              deck_name: c.cards!.deck_name ?? "",
            }));

        setRecord({
          title: recordData.title,
          content: recordData.content,
          interpretation: recordData.interpretation || "",
          feedback: recordData.feedback || "",
          image_urls: recordData.image_urls || [],
          mainCards: extractCards("main"),
          subCards: extractCards("sub"),
          category: recordData.category || "기타",
        });
      } catch (error: any) {
        toast({
          title: "불러오기 실패",
          description: error?.message || "기록을 불러오지 못했습니다.",
          variant: "destructive",
        });
        router.replace("/record");
      } finally {
        setIsLoading(false);
      }
    };

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "로그인이 필요합니다.",
          description: "기록을 수정하려면 먼저 로그인해주세요.",
          variant: "destructive",
        });
        router.replace(`/login?redirect=/record/${id}/edit`);
        return;
      }

      await fetchRecord(); // ✅ 여기서 실행
    };

    checkAuth();
  }, [id, supabase, toast, router]);

  const handleUpdate = async ({
    title,
    content,
    interpretation,
    feedback,
    imageUrls,
    mainCards,
    subCards,
    category,
  }: {
    title: string;
    content: string;
    interpretation: string;
    feedback: string;
    imageUrls: string[];
    mainCards: Card[];
    subCards: Card[];
    category: RecordCategory;
  }) => {
    try {
      // Step 1: 기록을 업데이트
      const { error: updateError } = await supabase
        .from("records")
        .update({
          title,
          content,
          interpretation,
          feedback,
          image_urls: imageUrls,
          category,
        })
        .eq("id", id); // 기존 레코드 업데이트

      if (updateError) throw updateError;

      // Step 2: 기존 카드 삭제 (record_cards 테이블에서 삭제)
      const { error: deleteError } = await supabase
        .from("record_cards")
        .delete()
        .eq("record_id", id); // 해당 기록에 관련된 카드 삭제

      if (deleteError) throw deleteError;

      // Step 3: 카드 IDs 처리
      const mainIds = mainCards.map((c) => c.id);
      const subIds = subCards.map((c) => c.id);
      const allIds = [...mainIds, ...subIds];

      // Step 4: base_cards 테이블에서 카드 ID 목록 조회
      const { data: fullCards, error: cardFetchError } = await supabase
        .from("base_cards")
        .select("id")
        .in("id", allIds); // 해당 ID들이 존재하는지 확인

      if (cardFetchError) throw cardFetchError;

      // Step 5: 새로 삽입할 카드 데이터 생성
      const newRows = fullCards.map((card) => ({
        record_id: id,
        card_id: card.id,
        type: mainIds.includes(card.id) ? "main" : "sub", // 타입에 맞게 구분
      }));

      // Step 6: 새로운 카드 데이터 삽입
      const { error: insertError } = await supabase
        .from("record_cards")
        .insert(newRows); // 새 카드 데이터 삽입

      if (insertError) throw insertError;

      // Step 7: 성공적인 업데이트 후, 피드백과 리디렉션
      toast({ title: "수정 완료" });
      router.push(`/record/${id}`); // 수정 후, 해당 기록 페이지로 이동
    } catch (error: any) {
      // 오류 처리
      toast({
        title: "수정 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !record) {
    return (
      <div className="text-white text-center py-12" aria-live="polite">
        불러오는 중...
      </div>
    );
  }

  return (
    <section
      className="relative py-10 w-dvw max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록 생성 섹션"
    >
      <div className="w-full text-center mx-auto relative z-10 space-y-8">
        <div className="space-y-4 animate-fade-in">
          <h1
            id="edit-title"
            className="font-title text-3xl md:text-4xl text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          >
            속삭임을 다시 꺼내며
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            그날의 이야기와 감정을 새롭게 담아보세요.
          </p>
        </div>

        <div className="w-full p-6 sm:p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
          <RecordForm
            initialTitle={record.title}
            initialContent={record.content}
            initialInterpretation={record.interpretation}
            initialFeedback={record.feedback}
            initialImageUrls={record.image_urls}
            initialMainCards={record.mainCards}
            initialSubCards={record.subCards}
            initialCategory={record.category}
            onSubmit={handleUpdate}
            isLoading={isLoading}
            redirectPathOnSuccess={`/record/${id}`}
          />
        </div>
      </div>
    </section>
  );
}
