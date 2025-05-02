"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/types/card";
import RecordForm from "@/components/record/RecordForm";
import ClientStarryBackground from "@/components/ClientStarryBackground";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditRecordPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [record, setRecord] = useState<{
    title: string;
    content: string;
    images: string[];
    mainCards: Card[];
    subCards: Card[];
  } | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("*")
          .eq("id", params.id)
          .single();

        if (recordError) throw recordError;

        const { data: cardLinks, error: linkError } = await supabase
          .from("record_cards")
          .select("type, cards(id, name, keywords)")
          .eq("record_id", params.id);

        if (linkError) throw linkError;

        const mainCards = cardLinks
          .filter((c) => c.type === "main")
          .map((c) => c.cards);

        const subCards = cardLinks
          .filter((c) => c.type === "sub")
          .map((c) => c.cards);

        setRecord({
          title: recordData.title,
          content: recordData.content,
          images: recordData.images || [],
          mainCards,
          subCards,
        });
      } catch (error: any) {
        toast({
          title: "불러오기 실패",
          description: error.message,
          variant: "destructive",
        });
        router.replace("/record");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [params.id, router, supabase, toast]);

  const handleUpdate = async ({
    title,
    content,
    images,
    mainCards,
    subCards,
  }: any) => {
    try {
      const { error: updateError } = await supabase
        .from("records")
        .update({ title, content, images })
        .eq("id", params.id);

      if (updateError) throw updateError;

      await supabase.from("record_cards").delete().eq("record_id", params.id);

      const mainIds = mainCards.map((c: Card) => c.id);
      const subIds = subCards.map((c: Card) => c.id);
      const allIds = [...mainIds, ...subIds];

      const { data: fullCards, error: cardFetchError } = await supabase
        .from("cards")
        .select("id")
        .in("id", allIds);

      if (cardFetchError) throw cardFetchError;

      const newRows = fullCards.map((card) => ({
        record_id: params.id,
        card_id: card.id,
        type: mainIds.includes(card.id) ? "main" : "sub",
      }));

      const { error: insertError } = await supabase
        .from("record_cards")
        .insert(newRows);

      if (insertError) throw insertError;

      toast({ title: "수정 완료" });
      router.push("/record");
    } catch (error: any) {
      toast({
        title: "수정 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !record)
    return <div className="text-white text-center py-12">불러오는 중...</div>;

  return (
    <>
      <ClientStarryBackground />
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-2xl p-8 space-y-8 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">기록 수정</h1>
            <p className="text-gray-400">이전에 작성한 내용을 수정해보세요</p>
          </div>
          <RecordForm
            initialTitle={record.title}
            initialContent={record.content}
            initialImages={record.images}
            initialMainCards={record.mainCards}
            initialSubCards={record.subCards}
            onSubmit={handleUpdate}
            isLoading={isLoading}
            redirectPathOnSuccess={`/record/${params.id}`}
          />
        </div>
      </div>
    </>
  );
}
