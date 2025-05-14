"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RecordForm from "@/components/record/RecordForm";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/types/card";
import { RecordCategory } from "@/types/record";

type RecordFormData = {
  title: string;
  content: string;
  interpretation: string;
  feedback: string;
  imageUrls: string[];
  mainCards: Card[];
  subCards: Card[];
  category: RecordCategory;
};

export default function CreateRecordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  const [initialValues, setInitialValues] =
    useState<Partial<RecordFormData> | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("tarot_temp_record");
    if (saved) {
      const parsed = JSON.parse(saved);

      setInitialValues({
        title: parsed.title || "오늘의 운세",
        content: parsed.content || "",
        interpretation: parsed.interpretation || "",
        feedback: parsed.feedback || "",
        category: parsed.category || "기타",
        mainCards: [
          {
            id: parsed.main_card_id,
            name: parsed.main_card_name || "",
            image_url: parsed.main_card_image || "",
            keywords: parsed.main_card_keywords || [],
            deck_id: "00000000-0000-0000-0000-000000000001",
            deck_name: "Universal",
          },
        ],
        subCards: [],
        imageUrls: [],
      });
      setTimeout(() => {
        sessionStorage.removeItem("tarot_temp_record");
      }, 500);
    } else {
      setInitialValues({
        title: "",
        content: "",
        interpretation: "",
        feedback: "",
        category: "기타",
        mainCards: [],
        subCards: [],
        imageUrls: [],
      });
    }
  }, []);

  const handleCreate = async ({
    title,
    content,
    interpretation,
    feedback,
    imageUrls,
    mainCards,
    subCards,
    category,
  }: RecordFormData) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session)
        throw new Error("인증되지 않은 사용자입니다.");

      const { data: insertedRecord, error: insertError } = await supabase
        .from("records")
        .insert({
          title,
          content,
          interpretation,
          feedback,
          image_urls: imageUrls,
          user_id: session.user.id,
          created_at: new Date(),
          category,
          main_card_image_url: mainCards[0]?.image_url || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const recordId = insertedRecord.id;
      const mainIds = mainCards.map((c) => c.id);
      const subIds = subCards.map((c) => c.id);
      const allIds = [...mainIds, ...subIds];

      if (allIds.length === 0) {
        toast({ title: "기록이 저장되었습니다. (카드 연결 없음)" });
        router.push("/record");
        router.refresh();
        return;
      }

      const { data: cards, error: cardFetchError } = await supabase
        .from("cards")
        .select("id")
        .in("id", allIds);

      if (cardFetchError) throw cardFetchError;
      if (!cards) throw new Error("카드 정보를 불러오지 못했습니다.");

      const rows = cards.map((card) => ({
        record_id: recordId,
        card_id: card.id,
        type: mainIds.includes(card.id) ? "main" : "sub",
      }));

      const { error: linkError } = await supabase
        .from("record_cards")
        .insert(rows);

      if (linkError) throw linkError;

      toast({ title: "기록이 저장되었습니다." });
      router.push("/record");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "기록 저장 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <section
      className="relative py-10 w-dvw max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록 생성 섹션"
    >
      <div className="w-full text-center mx-auto relative z-10 space-y-8">
        {/* 제목 및 부제 */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            카드의 속삭임
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
            오늘의 이야기를 카드로 남겨보세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="w-full p-6 sm:p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
          {initialValues && initialValues.category !== undefined && (
            <RecordForm
              initialTitle={initialValues.title}
              initialContent={initialValues.content}
              initialInterpretation={initialValues.interpretation}
              initialFeedback={initialValues.feedback}
              initialCategory={initialValues.category}
              initialMainCards={initialValues.mainCards}
              initialSubCards={initialValues.subCards}
              initialImageUrls={initialValues.imageUrls}
              onSubmit={handleCreate}
              redirectPathOnSuccess="/record"
            />
          )}
        </div>
      </div>
    </section>
  );
}
