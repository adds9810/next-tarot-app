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
type Card = Database["public"]["Tables"]["cards"]["Row"];

const cardSchema = z.object({
  title: z.string().min(1, "카드 제목을 입력해주세요"),
  content: z.string().min(1, "카드 내용을 입력해주세요"),
  keywords: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "덱 제목을 입력해주세요"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      cards: [{ title: "", content: "", keywords: [], image_url: "" }],
    },
  });

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/login?redirect=/deck/${deckId}`);
        return;
      }

      if (deckId !== "new") {
        try {
          const { data: deck, error: deckError } = await supabase
            .from("decks")
            .select("*")
            .eq("id", deckId)
            .single();
          if (deckError) throw deckError;

          const { data: cards, error: cardsError } = await supabase
            .from("cards")
            .select("*")
            .eq("deck_id", deckId);
          if (cardsError) throw cardsError;

          form.reset({
            title: deck.title,
            description: deck.description || "",
            cards: cards.map((card) => ({
              title: card.title,
              content: card.content,
              keywords: [],
              image_url: "",
            })),
          });
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            variant: "destructive",
            title: "불러오기 실패",
            description: "덱과 카드를 불러오는데 실패했습니다.",
          });
          router.push("/deck");
        }
      }

      setLoading(false);
    };

    checkSessionAndFetch();
  }, [deckId, router, supabase, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "인증 오류",
        description: "로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (deckId === "new") {
        const { data: deck, error: deckError } = await supabase
          .from("decks")
          .insert([
            {
              title: values.title,
              description: values.description,
              user_id: session.user.id,
            },
          ])
          .select()
          .single();
        if (deckError) throw deckError;

        const { error: cardsError } = await supabase.from("cards").insert(
          values.cards.map((card) => ({
            title: card.title,
            content: card.content,
            deck_id: deck.id,
            user_id: session.user.id,
          }))
        );
        if (cardsError) throw cardsError;
      } else {
        const { error: deckError } = await supabase
          .from("decks")
          .update({
            title: values.title,
            description: values.description,
          })
          .eq("id", deckId);
        if (deckError) throw deckError;

        await supabase.from("cards").delete().eq("deck_id", deckId);

        const { error: cardsError } = await supabase.from("cards").insert(
          values.cards.map((card) => ({
            title: card.title,
            content: card.content,
            deck_id: deckId,
            user_id: session.user.id,
          }))
        );
        if (cardsError) throw cardsError;
      }

      toast({
        title: "저장 완료",
        description: "덱이 저장되었습니다.",
      });
      router.push("/deck");
    } catch (error) {
      console.error("Error saving deck:", error);
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "덱을 저장하는데 실패했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />;
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>덱 제목</FormLabel>
                  <FormControl>
                    <Input placeholder="덱의 제목을 입력하세요" {...field} />
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
                      placeholder="덱에 대한 설명을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">카드 목록</h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const cards = form.getValues("cards");
                  form.setValue("cards", [
                    ...cards,
                    { title: "", content: "", keywords: [], image_url: "" },
                  ]);
                }}
              >
                카드 추가
              </Button>
            </div>

            {form.watch("cards").map((_, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">카드 {index + 1}</h4>
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
                  name={`cards.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카드 제목</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="카드의 제목을 입력하세요"
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
              onClick={() => router.push("/deck")}
            >
              취소
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
