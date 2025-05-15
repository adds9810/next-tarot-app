"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/types/card";
import { useRouter, useSearchParams } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import MysticSpinner from "@/components/MysticSpinner";
import LoadingIndicator from "@/components/LoadingIndicator";

type Step = 1 | 2 | 3 | 4 | 5;

function TarotContent() {
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
  const supabase = createPagesBrowserClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);

        const { data: cardsData, error } = await supabase
          .from("cards")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("deck_id", "00000000-0000-0000-0000-000000000001") // Universal 덱
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (error) {
          console.error("회원 카드 불러오기 실패:", error.message);
        } else {
          setCards(cardsData || []);
        }
      } else {
        setIsLoggedIn(false);

        const { data: baseCards, error } = await supabase
          .from("base_cards")
          .select("*")
          .eq("deck_id", "00000000-0000-0000-0000-000000000001") // Universal 덱
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        if (error) {
          console.error("비회원 카드 불러오기 실패:", error.message);
        } else {
          setCards(baseCards || []);
        }
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data: cardsData, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("deck_id", "00000000-0000-0000-0000-000000000001") // Universal 덱 ID
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("카드 불러오기 실패:", error.message);
      } else {
        setCards(cardsData || []);
      }
    };

    fetchCards();
  }, []);
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

  const handleQuestionSubmit = () => {
    if (!question.trim()) {
      alert("질문을 입력해주세요.");
      return;
    }
    setStep(3);
  };

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

  const saveToSessionAndGo = async () => {
    if (!selectedCard || !fortuneText) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const isToday = question.trim() === "";

    const payload = {
      title: question || "오늘의 운세",
      content: fortuneText,
      interpretation: selectedCard.keywords.join(", "),
      feedback: "",
      main_card_id: selectedCard.id,
      main_card_name: selectedCard.name,
      main_card_image: selectedCard.image_url,
      main_card_keywords: selectedCard.keywords,
      category: isToday ? "오늘의 운세" : "기타",
    };

    sessionStorage.setItem("tarot_temp_record", JSON.stringify(payload));
    if (session) {
      router.push("/record/create");
    } else {
      router.push("/login?redirect=/record/create");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center w-full sm:max-w-xl mx-auto animate-fade-in">
            <section className="mb-8 space-y-4 " aria-labelledby="step1-title">
              <h1
                id="step1-title"
                className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
              >
                별들이 속삭입니다.
              </h1>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                어떤 운세를 듣고 싶으신가요?
              </p>
            </section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 "
              role="group"
              aria-label="운세 종류 선택"
            >
              <Button
                onClick={() => setStep(3)}
                className="px-6 py-3 w-full min-w-[200px] bg-[#FFD700] text-[#0B0C2A] font-body text-base sm:text-lg  font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
              >
                오늘의 운세
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="w-full  text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 text-center"
              >
                내가 원하는 운세
              </Button>
            </motion.div>
          </div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center w-full sm:max-w-xl mx-auto"
            role="group"
            aria-label="운세 종류 선택"
          >
            <section
              className="text-center space-y-4"
              aria-labelledby="step2-title"
            >
              <h1
                id="step2-title"
                className="font-title text-3xl md:text-4xl text-[#FFD700] mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
              >
                당신의 마음속 <br className="md:hidden" />
                질문을 들려주세요
              </h1>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed">
                원하는 질문을 자유롭게 입력해 주세요.
              </p>
            </section>
            <div className="max-w-md mx-auto space-y-4 mt-4">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 내 연애운은 어떨까요?"
                className="bg-[#1C1635]/50 border-[#FFD700]/20 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQuestionSubmit();
                  }
                }}
              />
              <Button
                onClick={() => handleQuestionSubmit()}
                className="w-full bg-[#FFD700] text-[#0B0C2A]"
              >
                다음
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <div className="space-y-8 text-center ">
            {isShuffling ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 "
              >
                <div aria-labelledby="step3-title">
                  <h2
                    id="step3-title"
                    className="font-title text-xl text-primary text-[#FFD700]"
                  >
                    카드를 섞고 있어요.
                  </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {shuffledCards.slice(0, 12).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [0, 360], x: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-16 h-24 bg-[#1C1635]/50 border border-[#FFD700]/20 rounded"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, function: "ease" }}
                  className="cursor-pointer"
                >
                  <h2
                    id="step3-title"
                    className="font-title text-3xl font-medium text-[#FFD700]"
                  >
                    당신에게 다가오는 카드를 <br className="md:hidden" /> 한 장
                    골라보세요
                  </h2>
                </motion.div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {shuffledCards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, rotate: 45, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        function: "ease",
                        delay: 0.4,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardSelect(card)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-[2/3] bg-[#1C1635]/50 border border-[#FFD700]/20 rounded overflow-hidden">
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
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4 w-full sm:max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              aria-labelledby="step4-title"
            >
              <h2
                id="step4-title"
                className="font-title text-xl text-primary text-[#FFD700]"
              >
                별들이 당신의 운명을 읽고 있습니다.
              </h2>
            </motion.div>
            <MysticSpinner />;
          </div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, function: "ease" }}
            className="space-y-6 text-center w-full"
          >
            <h2 className="text-3xl font-medium text-[#FFD700]">
              {selectedCard?.name}
            </h2>
            <img
              src={selectedCard?.image_url}
              alt={selectedCard?.name}
              className="w-40 mx-auto rounded-lg border border-[#FFD700]/20"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <p className="text-lg text-[#BFA2DB]">
                {question || "오늘의 운세"}
              </p>
              <div className="max-w-2xl mx-auto p-6 bg-[#1C1635]/50 border border-[#FFD700]/20 rounded-lg">
                <p className="text-white leading-relaxed">{fortuneText}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <p className="text-[#BFA2DB]">
                이 리딩을 마음속에 간직하시겠어요?
              </p>
              <div className="flex gap-4 justify-center flex-col sm:flex-row items-center sm:gap-6 ">
                {isLoggedIn ? (
                  <Button
                    onClick={saveToSessionAndGo}
                    className="px-6 py-3 w-full sm:w-auto min-w-[200px] bg-[#FFD700] text-[#0B0C2A] font-body text-base sm:text-lg font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
                  >
                    저장하기
                  </Button>
                ) : (
                  <Button
                    onClick={saveToSessionAndGo}
                    className="px-6 py-3 w-full sm:w-auto min-w-[200px] bg-[#FFD700] text-[#0B0C2A] font-body text-base sm:text-lg font-medium tracking-wide rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/20"
                  >
                    로그인하고 저장하기
                  </Button>
                )}
                <Button className="px-6 py-3 w-full sm:w-auto min-w-[200px] text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 text-center">
                  메인으로
                </Button>
              </div>
            </motion.div>
          </motion.div>
        );
    }
  };
  return (
    <section
      className="relative py-10 w-dvw px-6 lg:px-8 flex flex-col items-center justify-center"
      aria-label="타로 운세 보기"
    >
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </section>
  );
}

export default function PageClient() {
  return (
    <Suspense
      fallback={
        <LoadingIndicator message="🌌 우주가 당신의 운세를 준비하고 있어요." />
      }
    >
      <TarotContent />
    </Suspense>
  );
}
