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
import { RecordDetail } from "@/types/record";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";
import LoadingIndicator from "@/components/LoadingIndicator";

interface PageClientProps {
  id: string;
}

export default function PageClient({ id }: PageClientProps) {
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 기록을 삭제하시겠어요?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("records").delete().eq("id", id);

    if (error) {
      toast({
        title: "삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "기록이 삭제되었습니다." });
      router.push("/record");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsAuthenticated(false);

          toast({
            title: "로그인이 필요합니다.",
            description: "해당 기록을 보려면 먼저 로그인해주세요.",
            variant: "destructive",
            duration: 5000,
          });

          router.replace("/login?redirect=/record/" + id);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        toast({
          title: "인증 오류",
          description: "로그인 정보를 확인할 수 없습니다.",
          variant: "destructive",
        });
        router.replace("/login?redirect=/record/" + id);
      }
    };

    checkAuth();
  }, [router, supabase.auth, id, toast]);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!isAuthenticated) return;

      try {
        const { data: recordData, error: recordError } = await supabase
          .from("records")
          .select("*")
          .eq("id", id)
          .single();

        if (recordError || !recordData) throw recordError;

        const { data: cardsData, error: cardsError } = await supabase
          .from("record_cards")
          .select(
            `
            type,
            cards (
              id,
              name,
              keywords,
              image_url,
              deck_id,
              deck_name
            )
          `
          )
          .eq("record_id", id);

        if (cardsError) throw cardsError;

        const mainCards =
          cardsData?.filter((c) => c.type === "main").map((c) => c.cards) || [];
        const subCards =
          cardsData?.filter((c) => c.type === "sub").map((c) => c.cards) || [];

        setRecord({
          ...recordData,
          main_cards_data: mainCards,
          sub_cards_data: subCards,
        } as RecordDetail);
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

    if (isAuthenticated) fetchRecord();
  }, [id, router, supabase, toast, isAuthenticated]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return <LoadingIndicator message="🔮 신비로운 데이터를 소환 중입니다..." />;
  }

  if (!record) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-10 w-dvw max-w-6xl px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="기록 상세 페이지"
    >
      <div className="w-full p-6 sm:p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl text-[#FFD700] font-title drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] break-all">
            {record.title}
          </h1>
          <p className="text-white/90 font-body">
            {format(new Date(record.created_at), "PPP", { locale: ko })}
          </p>
          {record.category && (
            <span className="text-sm inline-block bg-[#FFD70020] text-[#FFD700] px-3 py-1 rounded-full">
              {record.category}
            </span>
          )}
        </header>

        {record.image_urls?.length > 0 && (
          <section
            aria-label="기록 이미지 목록"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {record.image_urls.map((image, index) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={image}
                  alt={`기록 이미지 ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ))}
          </section>
        )}

        <section className="grid gap-6">
          {record.interpretation && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                카드 해석
              </h2>
              <p className="text-white whitespace-pre-wrap">
                {record.interpretation}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              조언 및 내용
            </h2>
            <p className="text-white whitespace-pre-wrap">{record.content}</p>
          </div>

          {record.feedback && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                후기 / 피드백
              </h2>
              <p className="text-white whitespace-pre-wrap">
                {record.feedback}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white mb-1">메인 카드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {record.main_cards_data?.map((card: CardType) => (
                <Card
                  key={card.id}
                  className="bg-white/5 border-white/10 p-4 flex items-center gap-4"
                >
                  <div className="relative w-12 h-20 overflow-hidden rounded-sm shrink-0">
                    <Image
                      src={card.image_url || "/images/default-card.jpg"}
                      alt={card.name || "타로 카드 이미지"}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white leading-snug">
                      {card.name}
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      {card.deck_name && <>{card.deck_name} · </>}
                      {card.keywords.join(", ")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {Array.isArray(record.sub_cards_data) &&
            record.sub_cards_data.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  서브 카드
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.sub_cards_data.map((card: CardType) => (
                    <Card
                      key={card.id}
                      className="bg-white/5 border-white/10 p-4 flex items-center gap-4"
                    >
                      <div className="relative w-12 h-20 overflow-hidden rounded-sm shrink-0">
                        <Image
                          src={card.image_url || "/images/default-card.jpg"}
                          alt={card.name || "타로 카드 이미지"}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-white leading-snug">
                          {card.name}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          {card.deck_name && <>{card.deck_name} · </>}
                          {card.keywords.join(", ")}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </section>

        <div className="flex flex-col md:flex-row items-stretch md:justify-between gap-4 pt-6 border-t border-white/10">
          <Link href={`/record/`}>
            <Button className="w-full text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 hover:border-[#FFD700]/40">
              목록으로
            </Button>
          </Link>
          <div className="space-x-2 flex justify-center">
            <Link href={`/record/${id}/edit`}>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                aria-label="기록 수정하기"
              >
                <Pencil className="w-4 h-4 mr-2" /> 수정
              </Button>
            </Link>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
              aria-label="기록 삭제하기"
            >
              <Trash2 className="w-4 h-4 mr-2" /> 삭제
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
