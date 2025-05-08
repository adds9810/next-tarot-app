"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

import RecordForm from "@/components/record/RecordForm";
import { useToast } from "@/hooks/use-toast";
import ClientStarryBackground from "@/components/ClientStarryBackground";
import { Card } from "@/types/card";

type RecordFormData = {
  title: string;
  content: string;
  interpretation: string;
  feedback: string;
  imageUrls: string[];
  mainCards: Card[];
  subCards: Card[];
};

export default function CreateRecordPage() {
  const supabase = createPagesBrowserClient();
  const router = useRouter();
  const { toast } = useToast();

  const [initialValues, setInitialValues] = useState<Partial<RecordFormData>>(
    {}
  );
  useEffect(() => {
    const saved = sessionStorage.getItem("tarot_temp_record");
    console.log("📦 등록 페이지에서 sessionStorage 내용:", saved);

    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("📌 parsed session data:", parsed); // ✅ 여기는 확인 가능

      const next = {
        title: parsed.title || "오늘의 운세",
        content: parsed.content || "",
        interpretation: parsed.interpretation || "",
        feedback: parsed.feedback || "",
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
      };

      console.log("📌 about to set:", next); // ✅ 이걸로 확인하자
      setInitialValues(next);
    } else {
      setInitialValues({
        title: "",
        content: "",
        interpretation: "",
        feedback: "",
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
    <div className="min-h-screen flex items-center justify-center py-12">
      <ClientStarryBackground />
      <div className="w-full max-w-2xl p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">새로운 기록</h1>
          <p className="text-gray-400">타로 카드 기록을 남겨보세요</p>
        </div>
        {initialValues.title !== undefined && (
          <RecordForm
            initialTitle={initialValues.title}
            initialContent={initialValues.content}
            initialInterpretation={initialValues.interpretation}
            initialFeedback={initialValues.feedback}
            initialMainCards={initialValues.mainCards}
            initialSubCards={initialValues.subCards}
            initialImageUrls={initialValues.imageUrls}
            onSubmit={handleCreate}
            redirectPathOnSuccess="/record"
          />
        )}
      </div>
    </div>
  );
}
