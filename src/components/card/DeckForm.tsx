"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import LoadingIndicator from "@/components/LoadingIndicator";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type CardType = Database["public"]["Tables"]["cards"]["Row"];

const cardSchema = z.object({
  name: z.string().min(1, "카드 이름을 입력해주세요"),
  content: z.string().min(1, "카드 내용을 입력해주세요"),
  keywords: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "덱 이름을 입력해주세요"),
  description: z.string().optional(),
  cards: z.array(cardSchema),
});

interface DeckFormProps {
  deckId: string;
}

export default function DeckForm({ deckId }: DeckFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const isEditMode = deckId !== "create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      cards: [{ name: "", content: "", keywords: [], image_url: "" }],
    },
  });

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/login?redirect=/cards/${deckId}`);
        return;
      }

      if (isEditMode) {
        try {
          const { data: deck } = await supabase
            .from("decks")
            .select("*")
            .eq("id", deckId)
            .single();

          const { data: cards } = await supabase
            .from("cards")
            .select("*")
            .eq("deck_id", deckId);

          form.reset({
            name: deck?.name || "",
            description: deck?.description || "",
            cards:
              cards?.map((card) => ({
                name: card.name,
                content: card.content,
                keywords: card.keywords || [],
                image_url: card.image_url || "",
              })) || [],
          });
        } catch {
          toast({
            variant: "destructive",
            title: "불러오기 실패",
            description: "덱 정보를 가져오지 못했습니다.",
          });
          router.push("/cards");
        }
      }

      setLoading(false);
    };

    checkSessionAndFetch();
  }, [deckId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    try {
      if (!isEditMode) {
        const { data: deck } = await supabase
          .from("decks")
          .insert({
            name: values.name,
            description: values.description,
            user_id: session.user.id,
          })
          .select()
          .single();

        await supabase.from("cards").insert(
          values.cards.map((card) => ({
            name: card.name,
            content: card.content,
            deck_id: deck.id,
            user_id: session.user.id,
          }))
        );
      } else {
        await supabase
          .from("decks")
          .update({
            name: values.name,
            description: values.description,
          })
          .eq("id", deckId);

        await supabase.from("cards").delete().eq("deck_id", deckId);

        await supabase.from("cards").insert(
          values.cards.map((card) => ({
            name: card.name,
            content: card.content,
            deck_id: deckId,
            user_id: session.user.id,
          }))
        );
      }

      toast({
        title: "저장 완료",
        description: "덱이 저장되었습니다.",
      });
      router.push("/cards");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "덱 저장 중 문제가 발생했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />;
  }

  return (
    <Card className="p-6 md:p-8 bg-white/5 border border-white/10 text-white space-y-10 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>덱 이름</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white/10 border-white/20 placeholder:text-white/40 text-white"
                      placeholder="덱의 이름을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>덱 설명</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-white/10 border-white/20 placeholder:text-white/40 text-white"
                      placeholder="덱에 대한 설명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">카드 목록</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const cards = form.getValues("cards");
                  form.setValue("cards", [
                    ...cards,
                    { name: "", content: "", keywords: [], image_url: "" },
                  ]);
                }}
              >
                카드 추가
              </Button>
            </div>

            {form.watch("cards").map((_, index) => (
              <Card key={index} className="p-4 bg-white/10 border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white">카드 {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const cards = form.getValues("cards");
                        form.setValue(
                          "cards",
                          cards.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name={`cards.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카드 이름</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="카드의 이름을 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`cards.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카드 내용</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="카드의 내용을 입력하세요"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cards")}
            >
              {isEditMode ? "취소하고 돌아가기" : "취소"}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "저장 중..."
                : isEditMode
                ? "수정 완료"
                : "덱 생성하기"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
