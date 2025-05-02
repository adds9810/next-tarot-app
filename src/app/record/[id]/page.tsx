"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Card as CardType } from "@/types/card";
import { Record } from "@/types/record";
import { useToast } from "@/hooks/use-toast";
import ClientStarryBackground from "@/components/ClientStarryBackground";

interface PageProps {
  params: {
    id: string;
  };
}

export default function RecordDetailPage({ params }: PageProps) {
  const [record, setRecord] = useState<Record | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 기록을 삭제하시겠어요?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("records")
      .delete()
      .eq("id", params.id);

    if (error) {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "기록이 삭제되었습니다.",
      });
      router.push("/record");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setIsAuthenticated(false);
          router.replace("/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!isAuthenticated) return;

      try {
        // 1. 기록 데이터 가져오기
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("*")
          .eq("id", params.id)
          .single();

        if (recordError || !recordData) {
          throw recordError;
        }

        // 2. 연결된 카드 데이터 가져오기 (JOIN 방식)
        const { data: cardsData, error: cardsError } = await supabase
          .from("record_cards")
          .select(
            `
            type,
            cards (
              id,
              name,
              keywords
            )
          `
          )
          .eq("record_id", params.id);

        if (cardsError) {
          throw cardsError;
        }

        const mainCards =
          cardsData?.filter((c) => c.type === "main").map((c) => c.cards) || [];

        const subCards =
          cardsData?.filter((c) => c.type === "sub").map((c) => c.cards) || [];

        setRecord({
          ...recordData,
          main_cards_data: mainCards,
          sub_cards_data: subCards,
        } as Record);
      } catch (error) {
        console.error("Error fetching record:", error);
        toast({
          title: "기록을 불러오는데 실패했습니다",
          description: "잠시 후 다시 시도해주세요",
          variant: "destructive",
        });
        router.replace("/record");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecord();
    }
  }, [params.id, router, supabase, toast, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <ClientStarryBackground />
        <div className="w-full max-w-2xl p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 p-8">
              <p className="text-white text-center">로딩 중...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!record) {
    return null;
  }

  return (
    <>
      {" "}
      <ClientStarryBackground />
      <div className="min-h-screen  py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-8 space-y-8">
            {/* 헤더 */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">{record.title}</h1>
              <p className="text-gray-400">
                {format(new Date(record.created_at), "PPP", { locale: ko })}
              </p>
            </div>

            {/* 이미지 */}
            {record.images && record.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.images.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={image}
                      alt={`기록 이미지 ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 내용 */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white whitespace-pre-wrap">{record.content}</p>
            </div>

            {/* 메인 카드 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">메인 카드</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.main_cards_data?.map((card: CardType) => (
                  <Card
                    key={card.id}
                    className="bg-white/5 border-white/10 p-4"
                  >
                    <h3 className="text-lg font-medium text-white mb-2">
                      {card.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {card.keywords.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-full text-sm text-white"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 서브 카드 */}
            {record.sub_cards_data && record.sub_cards_data.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">서브 카드</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.sub_cards_data.map((card: CardType) => (
                    <Card
                      key={card.id}
                      className="bg-white/5 border-white/10 p-4"
                    >
                      <h3 className="text-lg font-medium text-white mb-2">
                        {card.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {card.keywords.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded-full text-sm text-white"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <Link href={`/record/${params.id}/edit`}>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  수정
                </Button>
              </Link>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
