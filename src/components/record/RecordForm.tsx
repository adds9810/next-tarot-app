"use client";

import { useState } from "react";
import { Card } from "@/types/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CardSelector from "./CardSelector";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RecordFormProps {
  onSubmit: (formData: {
    title: string;
    content: string;
    images: File[];
    mainCards: Card[];
    subCards: Card[];
    tags: string[];
  }) => void;
  isSubmitting: boolean;
}

export default function RecordForm({
  onSubmit,
  isSubmitting,
}: RecordFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mainCards, setMainCards] = useState<Card[]>([]);
  const [subCards, setSubCards] = useState<Card[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "이미지는 최대 5장까지 업로드할 수 있습니다",
        variant: "destructive",
      });
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMainCardsChange = (cards: Card[]) => {
    setMainCards(cards);
  };

  const handleSubCardsChange = (cards: Card[]) => {
    setSubCards(cards);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainCards.length === 0) {
      toast({
        title: "메인 카드를 최소 1장 이상 선택해주세요",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      title,
      content,
      images,
      mainCards,
      subCards,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>이미지 (최대 5장)</Label>
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
          className="w-full"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <Plus className="mr-2 h-4 w-4" />
          이미지 추가
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
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
        <Label>메인 카드</Label>
        <CardSelector
          selectedCards={mainCards}
          onChange={handleMainCardsChange}
          maxCards={10}
          isMain={true}
        />
      </div>

      <div className="space-y-2">
        <Label>서브 카드</Label>
        <CardSelector
          selectedCards={subCards}
          onChange={handleSubCardsChange}
          maxCards={10}
          isMain={false}
        />
      </div>

      <div className="space-y-2">
        <Label>태그</Label>
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
            placeholder="태그 입력 후 Enter"
          />
          <Button type="button" onClick={addTag}>
            추가
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
            >
              <span>{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
