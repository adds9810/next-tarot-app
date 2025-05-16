"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { supabase } from "@/lib/supabase";

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mainCards, setMainCards] = useState<Card[]>(initialMainCards);
  const [subCards, setSubCards] = useState<Card[]>(initialSubCards);
  const [category, setCategory] = useState<RecordCategory>(
    () => initialCategory || "기타"
  );

  const { toast } = useToast();
  const router = useRouter();

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    mainCards?: string;
  }>({});

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxUploads = 5 - imageUrls.length;

    if (files.length > maxUploads) {
      toast({
        title: "이미지는 최대 5장까지 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setImageUrls((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { title?: string; content?: string; mainCards?: string } =
      {};
    if (!title.trim()) newErrors.title = "제목을 입력해 주세요";
    if (!content.trim()) newErrors.content = "내용을 입력해 주세요";
    if (mainCards.length === 0)
      newErrors.mainCards = "메인 카드를 최소 1장 이상 선택해주세요";
    setErrors(newErrors);

    const firstErrorField = Object.keys(newErrors)[0];
    if (firstErrorField) {
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }
    }
    return Object.keys(newErrors).length === 0;
  };
  const uploadImages = async (): Promise<string[]> => {
    const uploaded: string[] = [];

    for (const file of imageFiles) {
      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const path = `user-${timestamp}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("record-images")
        .upload(path, file);
      if (error) {
        toast({
          title: "이미지 업로드 실패",
          description: file.name,
          variant: "destructive",
        });
        continue;
      }
      const { data: urlData } = supabase.storage
        .from("record-images")
        .getPublicUrl(path);
      if (urlData?.publicUrl) uploaded.push(urlData.publicUrl);
    }

    // 기존 이미지 URL과 새로 업로드한 URL 합쳐서 반환
    return [
      ...imageUrls.filter((url) => !url.startsWith("blob:")),
      ...uploaded,
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const uploadedUrls = await uploadImages();
    await onSubmit({
      title,
      content,
      interpretation,
      feedback,
      imageUrls: uploadedUrls,
      mainCards,
      subCards,
      category,
    });
    console.log("🔥 mainCards:", mainCards);
    console.log("🔥 subCards:", subCards);

    if (redirectPathOnSuccess) {
      router.push(redirectPathOnSuccess);
    }
  };

  const handleCancel = () => {
    const confirm = window.confirm(
      "저장하지 않은 내용은 사라집니다. 그래도 나가시겠습니까?"
    );
    if (confirm) router.push(redirectPathOnSuccess || "/record");
  };

  const isEditMode = !!initialTitle || !!initialContent;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 text-left"
      aria-label="타로 기록 작성 폼"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <div className="space-y-6">
        {[
          {
            label: "카테고리",
            id: "category",
            content: (
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as RecordCategory)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1635]/90 text-white border-white/10">
                  {[
                    "오늘의 운세",
                    "연애 / 관계",
                    "진로 / 직업",
                    "건강 / 감정",
                    "재정 / 돈",
                    "자기 성찰",
                    "기타",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            label: "제목",
            id: "title",
            content: (
              <>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title)
                      setErrors({ ...errors, title: undefined });
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
              </>
            ),
          },
          {
            label: "메인 카드",
            id: "main-cards",
            content: (
              <>
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
              </>
            ),
          },
          {
            label: "서브 카드",
            id: "sub-cards",
            content: (
              <CardSelector
                type="sub"
                selectedCards={subCards}
                onChange={setSubCards}
                maxCards={10}
                excludeCardIds={mainCards.map((card) => card.id)}
              />
            ),
          },
          {
            label: "카드 해석",
            id: "interpretation",
            content: (
              <Textarea
                id="interpretation"
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="카드 해석 내용을 입력하세요"
              />
            ),
          },
          {
            label: "조언 및 내용",
            id: "content",
            content: (
              <>
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
              </>
            ),
          },
          {
            label: "후기 / 피드백",
            id: "feedback",
            content: (
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="나중에 느낀 점이나 결과를 기록해보세요"
              />
            ),
          },
          {
            label: "이미지 (최대 5장)",
            id: "image-upload",
            content: (
              <>
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
                  size={"sm"}
                  className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> 이미지 추가
                </Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-[200px] object-scale-down rounded-md"
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
              </>
            ),
          },
        ].map(({ label, id, content }) => (
          <div
            key={id}
            className="flex flex-col sm:flex-row sm:items-start gap-2"
          >
            <Label htmlFor={id} className="text-white sm:w-32 pt-2">
              {label}
            </Label>
            <div className="flex flex-col sm:flex-1 gap-2 w-full">
              {content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4 border-t border-white/10 flex-col sm:flex-row gap-4">
        <Button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 font-body text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 rounded-lg hover:border-[#FFD700]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 w-full sm:w-auto text-center"
        >
          {isEditMode ? "취소하고 목록으로" : "취소하고 목록으로"}
        </Button>

        <Button
          type="submit"
          className="px-4 py-2 font-body bg-[#FFD700] text-[#0B0C2A] rounded-lg hover:bg-[#FFE566] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-lg shadow-[#FFD700]/20 w-full sm:w-auto text-center"
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : isEditMode ? "저장하기" : "남기기"}
        </Button>
      </div>
    </motion.form>
  );
}
