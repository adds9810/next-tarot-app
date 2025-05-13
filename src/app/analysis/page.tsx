"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const categories = [
  { id: "today", label: "오늘의 운세" },
  { id: "love", label: "연애 / 관계" },
  { id: "career", label: "진로 / 직업" },
  { id: "health", label: "건강 / 감정" },
  { id: "finance", label: "재정 / 돈" },
  { id: "self", label: "자기 성찰" },
  { id: "other", label: "기타" },
];

type CardInfo = {
  name: string;
  keywords: string[];
  image_url: string;
};

export default function AnalysisPage() {
  const supabase = createClientComponentClient();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map((c) => c.id)
  );
  const [keyword, setKeyword] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const cardMap: Record<
    string,
    { count: number; keywords: string[]; image_url: string }
  > = {};
  const keywordMap: Record<string, number> = {};
  const questionSet = new Set<string>();

  const handleAnalyze = async () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      let query = supabase
        .from("records")
        .select(
          `
          id, title, content, interpretation, created_at, category,
          record_cards (
            type,
            cards (
              name,
              keywords,
              image_url
            )
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (startDate) query = query.gte("created_at", startDate.toISOString());
      if (endDate) query = query.lte("created_at", endDate.toISOString());
      if (selectedCategories.length > 0) {
        query = query.in(
          "category",
          selectedCategories.map((cat) =>
            cat === "today"
              ? "오늘의 운세"
              : cat === "love"
              ? "연애 / 관계"
              : cat === "career"
              ? "진로 / 직업"
              : cat === "health"
              ? "건강 / 감정"
              : cat === "finance"
              ? "재정 / 돈"
              : cat === "self"
              ? "자기 성찰"
              : "기타"
          )
        );
      }

      const { data: records, error } = await query;
      if (error) throw error;

      const cardMap: Record<
        string,
        { count: number; keywords: string[]; image_url: string }
      > = {};
      const keywordMap: Record<string, number> = {};
      const questionSet = new Set<string>();

      const enrichedRecords = records.map((r) => {
        const mainCardEntry = r.record_cards?.find(
          (c: any) => c.type === "main"
        );

        // 핵심 수정: cards는 단일 객체이므로 [0] 빼고 직접 접근
        const rawCard = mainCardEntry?.cards as CardInfo | undefined;

        // 🔍 여기 세 줄만 추가해줘!
        console.log("🎴 record ID:", r.id);
        console.log("🔍 mainCardEntry:", mainCardEntry);
        console.log("🃏 rawCard:", rawCard);

        // 타입 오류 방지 + 정상 출력 보장
        const name = rawCard?.name ?? "";
        const keywords = Array.isArray(rawCard?.keywords)
          ? rawCard.keywords
          : [];
        const image_url = rawCard?.image_url ?? "";

        if (name) {
          if (!cardMap[name]) {
            cardMap[name] = { count: 1, keywords, image_url };
          } else {
            cardMap[name].count++;
          }
          keywords.forEach((k: string) => {
            keywordMap[k] = (keywordMap[k] || 0) + 1;
          });
        }

        if (r.title) questionSet.add(r.title);

        return {
          id: r.id,
          title: r.title,
          date: r.created_at?.slice(0, 10) || "",
          card: name,
          keywords,
        };
      });

      const topCards = Object.entries(cardMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([name, data]) => ({
          name,
          count: data.count,
          image_url: data.image_url,
        }));

      const topKeywords = Object.entries(keywordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([k]) => k);

      setAnalysisResult({
        topCards,
        topKeywords,
        commonQuestions: Array.from(questionSet).slice(0, 3),
        records: enrichedRecords,
      });
    } catch (err: any) {
      console.error("분석 오류:", err);
      alert("분석 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 폼 컴포넌트 포함 UI는 유지된 상태 */}
        <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-[#FFD700]">
              나의 타로 기록 분석하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#BFA2DB]">시작일</Label>
                <Popover open={startOpen} onOpenChange={setStartOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      onClick={() => setStartOpen(true)}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1C1635]/50 border-[#FFD700]/20 text-white",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#FFD700]" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: ko })
                      ) : (
                        <span>날짜를 선택하세요</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1C1635] border-[#FFD700]/10">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartOpen(false); // 선택 후 닫기
                      }}
                      disabled={(date) => !!endDate && date > endDate}
                      initialFocus
                      className="bg-[#1C1635] text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-[#BFA2DB]">종료일</Label>
                <Popover open={endOpen} onOpenChange={setEndOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      onClick={() => setEndOpen(true)}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1C1635]/50 border-[#FFD700]/20 text-white",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#FFD700]" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: ko })
                      ) : (
                        <span>날짜를 선택하세요</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1C1635] border-[#FFD700]/10">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndOpen(false);
                      }}
                      disabled={(date) => !!startDate && date < startDate}
                      initialFocus
                      className="bg-[#1C1635] text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#BFA2DB]">카테고리</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.id,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter(
                              (id) => id !== category.id
                            )
                          );
                        }
                      }}
                      className="border-[#FFD700]/20 data-[state=checked]:bg-[#FFD700] data-[state=checked]:text-[#0B0C2A]"
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm text-[#BFA2DB] cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[#BFA2DB]">키워드</Label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="기억에 남는 질문이나 키워드를 입력해보세요"
                className="bg-[#1C1635]/50 border-[#FFD700]/20 text-white placeholder:text-[#BFA2DB]/50"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566] transition-all duration-300"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  분석 중...
                </div>
              ) : (
                "분석하기"
              )}
            </Button>
          </CardContent>
        </Card>
        {analysisResult && (
          <div className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#FFD700]">
                  자주 등장한 카드 TOP 3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisResult.topCards.map((card: any) => (
                    <div
                      key={card.name}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div className="w-32 h-48 relative">
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-full h-full object-cover rounded-lg border border-[#FFD700]/20"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-[#0B0C2A] font-bold">
                          {card.count}
                        </div>
                      </div>
                      <p className="text-[#BFA2DB]">{card.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#FFD700]">
                  자주 등장한 키워드
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysisResult.topKeywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#1C1635] border border-[#FFD700]/20 rounded-full text-[#BFA2DB]"
                  >
                    {kw}
                  </span>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#FFD700]">
                  자주 한 질문 유형
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.commonQuestions.map(
                    (q: string, i: number) => (
                      <li
                        key={i}
                        className="text-[#BFA2DB] p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg"
                      >
                        {q}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
            {/* 기록 미리보기 */}
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#FFD700]">
                  기록 미리보기
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.records.map((record: any) => (
                  <div
                    key={record.id}
                    className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[#FFD700] font-medium">
                          {record.title}
                        </h3>
                        <p className="text-sm text-[#BFA2DB]">{record.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#BFA2DB]">{record.card}</p>
                        <p className="text-sm text-[#BFA2DB]/70">
                          {Array.isArray(record.keywords)
                            ? record.keywords.join(", ")
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
