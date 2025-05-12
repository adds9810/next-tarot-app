"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CardSelector from "@/components/record/CardSelector";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecordCategory } from "@/types/record";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RecordFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialInterpretation?: string;
  initialFeedback?: string;
  initialImageUrls?: string[];
  initialMainCards?: Card[];
  initialSubCards?: Card[];
  initialCategory?: RecordCategory;
  onSubmit: (formData: {
    title: string;
    content: string;
    interpretation: string;
    feedback: string;
    imageUrls: string[];
    mainCards: Card[];
    subCards: Card[];
    category: RecordCategory;
  }) => Promise<void>;
  isLoading?: boolean;
  redirectPathOnSuccess?: string;
}

export default function RecordForm({
  initialTitle = "",
  initialContent = "",
  initialInterpretation = "",
  initialFeedback = "",
  initialImageUrls = [],
  initialMainCards = [],
  initialSubCards = [],
  initialCategory = "기타",
  onSubmit,
  isLoading = false,
  redirectPathOnSuccess = "/record",
}: RecordFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [interpretation, setInterpretation] = useState(initialInterpretation);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [mainCards, setMainCards] = useState<Card[]>(initialMainCards);
  const [subCards, setSubCards] = useState<Card[]>(initialSubCards);
  const [category, setCategory] = useState<RecordCategory>(
    () => initialCategory || "기타"
  );
  useEffect(() => {}, [initialCategory, category]);

  const { toast } = useToast();
  const router = useRouter();

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    mainCards?: string;
  }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageUrls.length + files.length > 5) {
      toast({
        title: "이미지는 최대 5장까지 업로드할 수 있습니다",
        variant: "destructive",
      });
      return;
    }
    setImageUrls([
      ...imageUrls,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      content?: string;
      mainCards?: string;
    } = {};

    if (!title.trim()) newErrors.title = "제목을 입력해 주세요";
    if (!content.trim()) newErrors.content = "내용을 입력해 주세요";
    if (mainCards.length === 0)
      newErrors.mainCards = "메인 카드를 최소 1장 이상 선택해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit({
      title,
      content,
      interpretation,
      feedback,
      imageUrls,
      mainCards,
      subCards,
      category,
    });

    if (redirectPathOnSuccess) {
      router.push(redirectPathOnSuccess);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              maxLength={50}
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-gray-500",
                errors.title && "border-red-500"
              )}
              placeholder="제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="category" className="text-white">
              카테고리
            </Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value as RecordCategory);
              }}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1635]/90 text-white border-white/10">
                {(
                  [
                    "오늘의 운세",
                    "연애 / 관계",
                    "진로 / 직업",
                    "건강 / 감정",
                    "재정 / 돈",
                    "자기 성찰",
                    "기타",
                  ] as RecordCategory[]
                ).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 해석 */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="interpretation" className="text-white">
              카드 해석
            </Label>
            <Textarea
              id="interpretation"
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              placeholder="카드 해석 내용을 입력하세요"
            />
          </div>

          {/* 조언 및 내용 */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="content" className="text-white">
              조언 및 내용
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content)
                  setErrors({ ...errors, content: undefined });
              }}
              className={cn(
                "min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-gray-500",
                errors.content && "border-red-500"
              )}
              placeholder="내용을 입력하세요"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* 피드백 */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="feedback" className="text-white">
              후기 / 피드백
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              placeholder="나중에 느낀 점이나 결과를 기록해보세요"
            />
          </div>

          {/* 이미지 */}
          <div className="space-y-2 mt-4">
            <Label className="text-white">이미지 (최대 5장)</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Plus className="mr-2 h-4 w-4" /> 이미지 추가
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-[200px] object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 카드 선택 */}
        <div className="space-y-2">
          <Label className="text-white">메인 카드</Label>
          <CardSelector
            type="main"
            selectedCards={mainCards}
            onChange={setMainCards}
            maxCards={10}
            excludeCardIds={subCards.map((card) => card.id)}
          />
          {errors.mainCards && (
            <p className="text-sm text-red-500">{errors.mainCards}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-white">서브 카드</Label>
          <CardSelector
            type="sub"
            selectedCards={subCards}
            onChange={setSubCards}
            maxCards={10}
            excludeCardIds={mainCards.map((card) => card.id)}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-white/10">
        <Button
          type="button"
          onClick={() => router.push("/record")}
          className="text-sm text-white underline hover:text-gray-300 transition"
        >
          취소하고 목록으로
        </Button>

        <Button
          type="submit"
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
