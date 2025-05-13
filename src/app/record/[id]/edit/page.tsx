"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/types/card";
import { RecordCategory } from "@/types/record";
import RecordForm from "@/components/record/RecordForm";
import ClientStarryBackground from "@/components/background/ClientStarryBackground";

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
          .eq("id", params.id)
          .single();

        if (recordError) throw recordError;

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
          .eq("record_id", params.id);

        if (linkError) throw linkError;

        const safeCardLinks = (cardLinks ?? []) as {
          type: "main" | "sub";
          cards: Partial<Card> | null;
        }[];

        const mainCards: Card[] = safeCardLinks
          .filter(
            (c) =>
              c.type === "main" && c.cards && typeof c.cards.id === "string"
          )
          .map((c) => ({
            id: c.cards!.id ?? "",
            name: c.cards!.name ?? "",
            keywords: c.cards!.keywords ?? [],
            image_url: c.cards!.image_url ?? "",
            deck_id: c.cards!.deck_id ?? "",
            deck_name: c.cards!.deck_name ?? "",
          }));

        const subCards: Card[] = safeCardLinks
          .filter(
            (c) => c.type === "sub" && c.cards && typeof c.cards.id === "string"
          )
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
          mainCards,
          subCards,
          category: recordData.category || "기타",
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
        .eq("id", params.id);

      if (updateError) throw updateError;

      await supabase.from("record_cards").delete().eq("record_id", params.id);

      const mainIds = mainCards.map((c) => c.id);
      const subIds = subCards.map((c) => c.id);
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
            initialInterpretation={record.interpretation}
            initialFeedback={record.feedback}
            initialImageUrls={record.image_urls}
            initialMainCards={record.mainCards}
            initialSubCards={record.subCards}
            initialCategory={record.category}
            onSubmit={handleUpdate}
            isLoading={isLoading}
            redirectPathOnSuccess={`/record/${params.id}`}
          />
        </div>
      </div>
    </>
  );
}
