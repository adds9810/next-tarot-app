"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import RecordForm from "@/components/record/RecordForm";
import { useToast } from "@/hooks/use-toast";
import ClientStarryBackground from "@/components/ClientStarryBackground";
import { Card } from "@/types/card";

type RecordFormData = {
  title: string;
  content: string;
  images: string[];
  mainCards: Card[];
  subCards: Card[];
};

export default function CreateRecordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  const [initialValues, setInitialValues] = useState<Partial<RecordFormData>>(
    {}
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("tarot_temp_record");
    if (saved) {
      const parsed = JSON.parse(saved);
      setInitialValues({
        title: parsed.title || "오늘의 운세",
        content: parsed.content || "",
        mainCards: [
          {
            id: parsed.main_card_id || "1", // ID는 임시, 실제 연결 시 cards 테이블과 맞춰야 함
            name: parsed.main_card_name || "",
            image: parsed.main_card_image || "",
            keywords: parsed.main_card_keywords || [],
            deck_id: "1",
            deck_name: "Universal Tarot",
          },
        ],
        subCards: [],
        images: [],
      });
    }
  }, []);

  const handleCreate = async ({
    title,
    content,
    images,
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
          images,
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

      const { data: cards } = await supabase
        .from("cards")
        .select("id")
        .in("id", allIds);

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
            initialMainCards={initialValues.mainCards}
            initialSubCards={initialValues.subCards}
            initialImages={initialValues.images}
            onSubmit={handleCreate}
            redirectPathOnSuccess="/record"
          />
        )}
      </div>
    </div>
  );
}
