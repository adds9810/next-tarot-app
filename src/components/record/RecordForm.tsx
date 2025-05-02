"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CardSelector from "@/components/record/CardSelector";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialImages?: string[];
  initialMainCards?: Card[];
  initialSubCards?: Card[];
  onSubmit: (formData: {
    title: string;
    content: string;
    images: string[];
    mainCards: Card[];
    subCards: Card[];
  }) => Promise<void>;
  isLoading?: boolean;
  redirectPathOnSuccess?: string;
}

export default function RecordForm({
  initialTitle = "",
  initialContent = "",
  initialImages = [],
  initialMainCards = [],
  initialSubCards = [],
  onSubmit,
  isLoading = false,
  redirectPathOnSuccess = "/record",
}: RecordFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState<string[]>(initialImages);
  const [mainCards, setMainCards] = useState<Card[]>(initialMainCards);
  const [subCards, setSubCards] = useState<Card[]>(initialSubCards);
  const { toast } = useToast();
  const router = useRouter();

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    mainCards?: string;
  }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "이미지는 최대 5장까지 업로드할 수 있습니다",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

    await onSubmit({ title, content, images, mainCards, subCards });

    if (redirectPathOnSuccess) {
      router.push(redirectPathOnSuccess); // ✅ 여기서 이동
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
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

          <div className="mt-2 space-y-2">
            <Label htmlFor="content" className="text-white">
              내용
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
          <div className="space-y-2">
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
              <Plus className="mr-2 h-4 w-4" />
              이미지 추가
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, index) => (
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

        <div className=" space-y-2">
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
