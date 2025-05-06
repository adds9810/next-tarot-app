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

export default function NewRecordPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [mainCards, setMainCards] = useState<Card[]>([]);
  const [subCards, setSubCards] = useState<Card[]>([]);
  // const [tags, setTags] = useState<string[]>([]);
  // const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    mainCards?: string;
  }>({});

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/login");
      }
    };

    checkSession();
  }, [router, supabase.auth]);

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
  // const addTag = () => {
  //   if (tagInput.trim() && !tags.includes(tagInput.trim())) {
  //     setTags([...tags, tagInput.trim()]);
  //     setTagInput("");
  //   }
  // };

  // const removeTag = (tagToRemove: string) => {
  //   setTags(tags.filter((tag) => tag !== tagToRemove));
  // };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      content?: string;
      mainCards?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "제목을 입력해 주세요";
    }

    if (!content.trim()) {
      newErrors.content = "내용을 입력해 주세요";
    }

    if (mainCards.length === 0) {
      newErrors.mainCards = "메인 카드를 최소 1장 이상 선택해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("인증되지 않은 사용자입니다.");
      }

      // [1] records 테이블에 먼저 기록 저장
      const { data: insertedRecords, error: insertError } = await supabase
        .from("records")
        .insert({
          title,
          content,
          images,
          user_id: session.user.id,
          created_at: new Date(),
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const recordId = insertedRecords.id;

      // [2] 선택된 카드 ID 목록 정리
      const mainCardIds = mainCards.map((card) => card.id);
      const subCardIds = subCards.map((card) => card.id);
      const allCardIds = [...mainCardIds, ...subCardIds];

      // [3] Supabase에서 카드 상세 정보 조회
      const { data: fullCards, error: fetchError } = await supabase
        .from("cards")
        .select("id") // 이제는 card_id만 필요하므로 id만 조회
        .in("id", allCardIds);

      if (fetchError) {
        throw fetchError;
      }

      // [4] 조회된 카드 정보로 record_cards 데이터 구성
      const cardRows = fullCards.map((card) => ({
        record_id: recordId,
        card_id: card.id,
        type: mainCardIds.includes(card.id) ? "main" : "sub",
      }));

      // [5] record_cards 테이블에 insert
      const { error: cardInsertError } = await supabase
        .from("record_cards")
        .insert(cardRows);

      if (cardInsertError) {
        throw cardInsertError;
      }

      toast({
        title: "기록이 저장되었습니다.",
        description: "타로 기록이 성공적으로 저장되었습니다.",
      });

      router.push("/record");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "기록 저장 실패",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-centerpy-12">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">새로운 기록</h1>
          <p className="text-gray-400">타로 카드 기록을 남겨보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors({ ...errors, title: undefined });
                }
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

          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">
              내용
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors({ ...errors, content: undefined });
                }
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
              excludeCardIds={mainCards.map((card) => card.id)} // ✅ 메인카드 제외
            />
          </div>

          {/* <div className="space-y-2">
            <Label className="text-white">태그</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                placeholder="태그 입력 후 Enter"
              />
              <Button
                type="button"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                onClick={addTag}
              >
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md"
                >
                  <span className="text-white">{tag}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div> */}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </form>
      </div>
    </div>
  );
}
