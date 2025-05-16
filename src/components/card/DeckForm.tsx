"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";
import { motion } from "framer-motion";
import { ImageIcon, X } from "lucide-react";

// CardType 정의 추가
export type CardType = {
  name: string;
  notes: string;
  keywords: string[];
  image_url: string;
};

type DeckFormProps = {
  deck?: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    user_id: string;
  };
  cards?: CardType[];
  isEditMode?: boolean;
};

export default function DeckForm({
  deck,
  cards = [],
  isEditMode = false,
}: DeckFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const [name, setName] = useState(deck?.name || "");
  const [description, setDescription] = useState(deck?.description || "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    deck?.image_url ? [deck.image_url] : []
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [cardList, setCardList] = useState<CardType[]>(
    cards.length
      ? cards
      : [{ name: "", notes: "", keywords: [], image_url: "" }]
  );
  const [cardImageFiles, setCardImageFiles] = useState<(File | null)[]>(
    cards.map(() => null)
  );
  const [loading, setLoading] = useState(false);
  const [decks, setDecks] = useState([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxUploads = 1 - imageUrls.length;

    if (files.length > maxUploads) {
      toast({
        title: "이미지는 1장만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImageFiles(files); // 이미지 파일 상태 업데이트
    setImageUrls(previewUrls); // 이미지 URL 상태 업데이트
  };

  const handleCardImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || file.size === 0) return;
    const url = URL.createObjectURL(file);
    const newCards = [...cardList];
    newCards[index].image_url = url;
    setCardList(newCards);
    const newFiles = [...cardImageFiles];
    newFiles[index] = file;
    setCardImageFiles(newFiles);
  };
  const removeDeckImage = async () => {
    if (deck?.image_url) {
      // 덱 이미지 경로가 있을 경우 삭제
      const { error } = await supabase.storage
        .from("deck-images")
        .remove([deck.image_url.split("/deck-images/")[1]]); // 경로에서 'deck-images/' 이후 부분만 제거하여 삭제
      if (error) {
        toast({
          title: "덱 이미지 삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setImageUrls([]); // 이미지 URL 상태 초기화
        setImageFiles([]); // 파일 상태 초기화
        toast({
          title: "덱 이미지 삭제 완료",
          description: "덱 이미지가 삭제되었습니다.",
          variant: "default",
        });
      }
    }
  };

  const removeCardImage = async (index: number) => {
    const card = cardList[index];
    if (card.image_url) {
      // 카드 이미지 경로가 있을 경우 삭제
      const { error } = await supabase.storage
        .from("card-images")
        .remove([card.image_url.split("/card-images/")[1]]); // 경로에서 'card-images/' 이후 부분만 제거하여 삭제
      if (error) {
        toast({
          title: "카드 이미지 삭제 실패",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "카드 이미지 삭제 완료",
          description: "카드 이미지가 삭제되었습니다.",
          variant: "default",
        });
        const newCards = [...cardList];
        newCards[index].image_url = ""; // 카드 이미지 URL 삭제
        setCardList(newCards); // 상태 업데이트
      }
    }
  };

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  const uploadImages = async (): Promise<string[]> => {
    const uploaded: string[] = [];

    for (const file of imageFiles) {
      if (!file || file.size === 0) {
        toast({
          title: "유효하지 않은 이미지 파일입니다.",
          variant: "destructive",
        });
        uploaded.push("");
        continue;
      }

      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .replace(/_+/g, "_");

      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const path = `/deck-${timestamp}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("deck-images")
        .upload(path, file);

      if (error) {
        toast({
          title: "이미지 업로드 실패",
          description: file.name,
          variant: "destructive",
        });
        uploaded.push("");
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("deck-images")
        .getPublicUrl(path);
      uploaded.push(urlData?.publicUrl || "");
    }

    return uploaded;
  };

  const uploadCardImages = async (): Promise<string[]> => {
    const uploaded: string[] = [];

    for (let i = 0; i < cardImageFiles.length; i++) {
      const file = cardImageFiles[i];

      if (!file || file.size === 0) {
        uploaded.push(cardList[i]?.image_url || "");
        continue;
      }

      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_") // 특수문자와 공백을 "_"로 대체
        .replace(/_+/g, "_"); // 여러 개의 "_"를 하나로 변경

      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const path = `card-${timestamp}-${Math.random()
        .toString(36)
        .slice(2)}-${safeFileName}`; // 카드 이미지는 "card-images/" 경로에 업로드

      const { error } = await supabase.storage
        .from("card-images")
        .upload(path, file);

      if (error) {
        toast({
          title: "카드 이미지 업로드 실패",
          description: file.name,
          variant: "destructive",
        });
        uploaded.push(""); // 빈값 넣어 오류 처리
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("card-images")
        .getPublicUrl(path);
      uploaded.push(urlData?.publicUrl || "");
    }

    return uploaded;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 덱 이름과 설명이 비어 있을 때 경고
    if (!name || !description) {
      toast({
        title: "덱 이름과 설명을 입력해주세요!",
        description: "덱 등록을 위해 이름과 설명이 필요합니다.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // 카드가 없을 경우 경고
    if (cardList.length === 0 || cardList.some((card) => !card.name)) {
      toast({
        title: "카드를 추가해주세요!",
        description: "덱을 등록하기 전에 최소한 하나의 카드를 추가해주세요.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("인증되지 않은 사용자입니다.");

      const uploadedDeckUrls = await uploadImages();
      const uploadedCardUrls = await uploadCardImages();
      const finalImageUrl = uploadedDeckUrls[0] || "";

      let deckId: string;
      let updatedDeck = {
        name,
        description,
        user_id: session.user.id,
        image_url: finalImageUrl,
      };

      // 덱을 새로 추가할 때와 수정할 때의 처리
      if (!isEditMode) {
        const { data: insertedDeck, error } = await supabase
          .from("decks")
          .insert(updatedDeck)
          .select()
          .single();
        if (error || !insertedDeck) throw error;
        deckId = insertedDeck.id;
        setDecks((prevDecks) => [...prevDecks, insertedDeck]); // 새 덱을 상태에 추가
      } else {
        const { error } = await supabase
          .from("decks")
          .update(updatedDeck)
          .eq("id", deck?.id);
        if (error) throw error;
        deckId = deck!.id;

        // 수정된 덱을 배열에서 업데이트하여 그대로 유지
        setDecks((prevDecks) => {
          return prevDecks.map((d) =>
            d.id === deckId ? { ...d, ...updatedDeck } : d
          );
        });

        await supabase.from("cards").delete().eq("deck_id", deckId);
      }

      // 카드 추가
      const cardInserts = cardList.map((c, i) => ({
        deck_id: deckId,
        name: c.name,
        notes: c.notes,
        keywords: c.keywords,
        image_url: uploadedCardUrls[i] || "",
        user_id: session.user.id,
      }));

      const { error: cardInsertError } = await supabase
        .from("cards")
        .insert(cardInserts);
      if (cardInsertError) throw cardInsertError;

      toast({ title: "저장 완료", description: "덱이 저장되었습니다." });
      router.push("/cards");
    } catch (e: any) {
      toast({
        title: "저장 실패",
        description: e?.message || "오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "작성 중인 내용이 사라집니다. 그래도 나가시겠습니까?"
    );
    if (confirmLeave) router.push("/cards");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 text-left"
      aria-label="덱 작성 폼"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row gap-6 px-4 pb-6 h-[calc(100vh-160px)]">
        <div className="sm:w-64 flex flex-col gap-6 border-r border-white/10 pr-4 flex-shrink-0">
          <div>
            <label className="text-white font-medium block mb-1">덱 이름</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white font-medium block mb-1">덱 설명</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white font-medium block mb-1">
              대표 이미지
            </label>
            <div className="w-32 h-32 relative border rounded bg-gray-300 flex items-center justify-center overflow-hidden">
              {imageUrls.length === 0 ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex items-center justify-center w-full h-full"
                  >
                    <ImageIcon className="w-6 h-6 opacity-70" />
                  </label>
                </>
              ) : (
                <>
                  <img
                    src={imageUrls[0]}
                    alt="대표 이미지"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={removeDeckImage}
                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="pt-2 border-t border-white/10">
            <Button
              type="button"
              onClick={handleCancel}
              className="w-full text-[#EAE7FF] hover:text-[#FFD700] border border-[#FFD700]/20 hover:border-[#FFD700]/40"
            >
              {isEditMode ? "취소하고 목록으로" : "취소하고 목록으로"}
            </Button>
            <Button
              type="submit"
              className="w-full mt-2 bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566]"
              disabled={loading}
            >
              {loading ? "저장 중..." : isEditMode ? "저장하기" : "덱 등록"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          <label className="block font-medium text-white">카드 목록</label>
          {cardList.map((card, index) => (
            <div
              key={index}
              className="p-4 border border-white/10 rounded bg-white/5 space-y-2"
            >
              <Input
                placeholder="카드 이름"
                value={card.name}
                onChange={(e) => {
                  const newCards = [...cardList];
                  newCards[index].name = e.target.value;
                  setCardList(newCards);
                }}
                className="bg-white/10 border-white/10 text-white"
              />
              <Textarea
                placeholder="카드 노트"
                value={card.notes}
                onChange={(e) => {
                  const newCards = [...cardList];
                  newCards[index].notes = e.target.value;
                  setCardList(newCards);
                }}
                className="bg-white/10 border-white/10 text-white"
              />
              <Input
                placeholder="키워드 (쉼표로 구분)"
                value={card.keywords.join(", ")}
                onChange={(e) => {
                  const newCards = [...cardList];
                  newCards[index].keywords = e.target.value
                    .split(",")
                    .map((s) => s.trim());
                  setCardList(newCards);
                }}
                className="bg-white/10 border-white/10 text-white"
              />
              <div className="w-24 h-24 relative border rounded bg-gray-300 flex items-center justify-center overflow-hidden">
                {card.image_url === "" ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCardImageChange(index, e)}
                      className="hidden"
                      id={`card-image-${index}`}
                    />
                    <label
                      htmlFor={`card-image-${index}`}
                      className="cursor-pointer flex items-center justify-center w-full h-full"
                    >
                      <ImageIcon className="w-5 h-5 opacity-70" />
                    </label>
                  </>
                ) : (
                  <>
                    <img
                      src={card.image_url}
                      alt="카드 이미지"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeCardImage(index)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              {cardList.length > 1 && index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    const newCardList = [...cardList];
                    const newCardImageFiles = [...cardImageFiles];
                    newCardList.splice(index, 1);
                    newCardImageFiles.splice(index, 1);
                    setCardList(newCardList);
                    setCardImageFiles(newCardImageFiles);
                  }}
                >
                  카드 삭제
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              setCardList([
                ...cardList,
                { name: "", notes: "", keywords: [], image_url: "" },
              ]);
              setCardImageFiles((prev) => [...prev, null]);
            }}
            className="w-full bg-white/5 text-white border-white/10 hover:bg-white/10"
          >
            카드 추가
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
