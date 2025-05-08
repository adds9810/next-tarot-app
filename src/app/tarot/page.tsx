"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/types/card";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

type Step = 1 | 2 | 3 | 4 | 5;

export default function TarotPage() {
  const [step, setStep] = useState<Step>(1);
  const [question, setQuestion] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [fortuneText, setFortuneText] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const supabase = createBrowserSupabaseClient();

  // 카드 JSON 불러오기
  useEffect(() => {
    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", "00000000-0000-0000-0000-000000000001") // 유니버셜 덱
        .order("order_index", { ascending: true });

      if (error) {
        console.error("카드 불러오기 실패:", error.message);
      } else {
        setCards(data || []);
      }
    };

    fetchCards();
  }, []);

  // Step 3에서 카드 섞기 & 애니메이션
  useEffect(() => {
    if (step === 3 && cards.length > 0) {
      const shuffled = [...cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledCards(shuffled);
      setIsShuffling(true);
      const timer = setTimeout(() => {
        setIsShuffling(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, cards]);

  useEffect(() => {
    if (type === "today") setStep(3);
    else if (type === "custom") setStep(2);
  }, [type]);

  // 카드 선택 시 OpenAI 분석
  const handleCardSelect = async (card: Card) => {
    setSelectedCard(card);
    setStep(4);

    const payload = {
      card: card.name,
      questionType: question ? "custom" : "today",
    };

    try {
      const res = await fetch("/api/tarot-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setFortuneText(data.fortune || "운세를 받아오지 못했습니다.");
    } catch (err) {
      console.error("OpenAI 호출 실패:", err);
      setFortuneText("운세 분석에 실패했습니다.");
    } finally {
      setStep(5);
    }
  };
  const saveToSessionAndGo = () => {
    if (!selectedCard || !fortuneText) return;

    const payload = {
      title: question || "오늘의 운세",
      content: fortuneText,
      main_card_id: selectedCard.id,
      main_card_name: selectedCard.name,
      main_card_image: selectedCard.image_url,
      main_card_keywords: selectedCard.keywords,
    };

    sessionStorage.setItem("tarot_temp_record", JSON.stringify(payload));
    router.push("/record/create");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-3xl font-medium text-[#FFD700]">
              별들이 속삭입니다.
              <br />
              어떤 운세를 듣고 싶으신가요?
            </h2>
            <div className="space-y-4">
              <Button
                onClick={() => setStep(3)}
                className="w-full max-w-xs bg-[#FFD700] text-[#0B0C2A]"
              >
                오늘의 운세
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="w-full max-w-xs border border-[#FFD700]/10 text-white"
              >
                내가 원하는 운세
              </Button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-3xl font-medium text-[#FFD700]">
              당신의 마음속 질문을 들려주세요
            </h2>
            <div className="max-w-md mx-auto">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 내 연애운은 어떨까요?"
                className="bg-[#1C1635]/50 border-[#FFD700]/10 text-white"
              />
              <Button
                onClick={() => setStep(3)}
                className="w-full mt-4 bg-[#FFD700] text-[#0B0C2A]"
              >
                다음
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            {isShuffling ? (
              <>
                <h2 className="text-xl text-[#FFD700]">
                  카드를 섞고 있어요...
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {shuffledCards.slice(0, 12).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [0, 360], x: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-16 h-24 bg-[#1C1635]/50 border border-[#FFD700]/10 rounded"
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-medium text-[#FFD700]">
                  지금 당신에게 다가오는 카드를 한 장 골라보세요
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
                  {shuffledCards.map((card) => (
                    <motion.div
                      key={card.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardSelect(card)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-[2/3] bg-[#1C1635]/50 border border-[#FFD700]/10 rounded overflow-hidden">
                        <img
                          src="/images/cards/card-back.png"
                          alt="card-back"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-medium text-[#FFD700]">
              별들이 당신의 운명을 읽고 있습니다...
            </h2>
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-center"
          >
            <h2 className="text-3xl font-medium text-[#FFD700]">
              {selectedCard?.name}
            </h2>
            <img
              src={selectedCard?.image_url}
              alt={selectedCard?.name}
              className="w-40 mx-auto rounded-lg border border-[#FFD700]/20"
            />
            <p className="text-lg text-[#BFA2DB]">
              {question || "오늘의 운세"}
            </p>
            <div className="max-w-2xl mx-auto p-6 bg-[#1C1635]/50 border border-[#FFD700]/10 rounded-lg">
              <p className="text-white leading-relaxed">{fortuneText}</p>
            </div>
            <p className="text-[#BFA2DB]">이 리딩을 마음속에 간직하시겠어요?</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={saveToSessionAndGo}
                className="bg-[#FFD700] text-[#0B0C2A]"
              >
                저장하기
              </Button>
              <Button className="border border-[#FFD700]/10 text-white">
                메인으로
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}
