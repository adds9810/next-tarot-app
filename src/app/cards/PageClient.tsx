"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/supabase";
import DeckCard from "@/components/card/DeckCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyState from "@/components/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingIndicator from "@/components/LoadingIndicator";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Deck = Database["public"]["Tables"]["decks"]["Row"];
type Card = Database["public"]["Tables"]["cards"]["Row"] & {
  keywords?: string[];
};

const ITEMS_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 10;

export default function PageClient() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Deck | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDecks = decks.filter((deck) => {
    const matchedCards = cards.filter((c) => c.deck_id === deck.id);
    const text = [
      deck.name,
      ...matchedCards.map((c) => c.name || ""),
      ...matchedCards.flatMap((c) => c.keywords || []),
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredDecks.length / ITEMS_PER_PAGE);
  const currentGroup = Math.floor((currentPage - 1) / MAX_PAGE_BUTTONS);
  const startPage = currentGroup * MAX_PAGE_BUTTONS + 1;
  const endPage = Math.min(startPage + MAX_PAGE_BUTTONS - 1, totalPages);
  const pageDecks = filteredDecks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?redirect=/cards");
        return;
      }

      try {
        const { data: decksData } = await supabase
          .from("decks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        const { data: cardsData } = await supabase
          .from("cards")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        setDecks(decksData || []);
        setCards(cardsData || []);
      } catch {
        toast({
          variant: "destructive",
          title: "불러오기 실패",
          description: "덱/카드를 불러오지 못했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await supabase.from("decks").delete().eq("id", deleteTarget.id);
      setDecks(decks.filter((d) => d.id !== deleteTarget.id));
      setCards(cards.filter((c) => c.deck_id !== deleteTarget.id));
      toast({ title: "삭제 완료", description: "덱이 삭제되었습니다." });
    } catch {
      toast({
        variant: "destructive",
        title: "삭제 실패",
        description: "덱 삭제 중 문제가 발생했습니다.",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <section
      className="relative py-10 w-dvw px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="덱/카드 관리 섹션"
    >
      {loading ? (
        <LoadingIndicator message="🌠 별빛을 모으는 중이에요" />
      ) : (
        <>
          <div className="container w-full text-center mx-auto relative z-10">
            {/* 제목 및 설명 */}
            <section
              className="space-y-4 animate-fade-in"
              aria-label="덱/카드 관리 소개 영역"
            >
              <h1 className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                내 덱과 카드 관리
              </h1>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                당신의 덱과 카드들을 이곳에서 관리해보세요.
              </p>
            </section>

            {/* 검색 */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              role="search"
              aria-label="덱 및 카드 검색 필터"
              className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="search"
                placeholder="덱 이름, 카드 이름 또는 키워드로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 w-full md:w-96"
                aria-label="덱 및 카드 검색 입력창"
              />
            </motion.form>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col justify-center items-center mt-8"
            >
              <Link
                href="/cards/create"
                className="group relative px-8 py-4 w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0B0C2A] font-body text-base sm:text-lg overflow-hidden font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
                aria-label="덱 만들기 페이지로 이동"
                role="button"
              >
                <div
                  className="absolute inset-0 bg-white/20 transform skew-x-0 translate-x-full group-hover:-skew-x-12 group-hover:translate-x-0 transition-transform duration-500 group-hover:scale-150"
                  aria-hidden="true"
                />
                <span className="relative text-lg text-[#0B0C2A] font-medium tracking-wide">
                  새 덱 만들기
                </span>
              </Link>
            </motion.div>

            {/* 목록 */}
            {filteredDecks.length === 0 ? (
              <EmptyState
                title={
                  searchTerm.trim()
                    ? "찾으시는 흔적이 보이지 않아요."
                    : "아직 남겨진 흔적이 없어요."
                }
                description={
                  searchTerm.trim()
                    ? "조건을 바꿔 다시 찾아보거나, 새로운 덱을 등록해보세요."
                    : "당신의 첫 번째 덱을 별빛 아래 만들어보세요."
                }
                buttonText="덱 만들기"
                buttonLink="/cards/create"
              />
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 text-left"
                  role="list"
                  aria-label="덱 목록"
                >
                  {pageDecks.map((deck) => (
                    <DeckCard
                      key={deck.id}
                      deck={deck}
                      cards={cards.filter((c) => c.deck_id === deck.id)}
                      onDelete={() => setDeleteTarget(deck)}
                    />
                  ))}
                </motion.div>

                {/* 페이지네이션 */}
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className="text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                      />
                    </PaginationItem>
                    {Array.from({ length: endPage - startPage + 1 }).map(
                      (_, i) => {
                        const page = startPage + i;
                        const isActive = page === currentPage;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              className={
                                isActive
                                  ? "bg-[#FFD700] text-[#0B0C2A] cursor-pointer"
                                  : "text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    )}
                    {endPage < totalPages && (
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#BFA2DB]" />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        className="text-[#BFA2DB] hover:bg-[#FFD700]/10 cursor-pointer"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>

          {/* 삭제 모달 */}
          <Dialog
            open={!!deleteTarget}
            onOpenChange={() => setDeleteTarget(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>덱 삭제</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">
                정말로 <strong>{deleteTarget?.name}</strong> 덱을
                삭제하시겠습니까?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  취소
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </section>
  );
}
