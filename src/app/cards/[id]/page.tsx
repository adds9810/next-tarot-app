import { Metadata } from "next";
import DeckForm from "@/components/deck/DeckForm";

export const metadata: Metadata = {
  title: "덱 생성 및 수정 | Whispers of the Stars",
  description: "나만의 타로 덱과 카드를 등록하고 관리해보세요.",
  openGraph: {
    title: "덱 생성 및 수정",
    description: "나만의 타로 덱과 카드를 등록하고 관리해보세요.",
    url: "/deck/new",
    images: ["/images/them/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "덱 생성 및 수정",
    description: "나만의 타로 덱과 카드를 등록하고 관리해보세요.",
    images: ["/images/them/og-default.png"],
  },
};

interface Props {
  params: { deckId: string };
}

export default function Page({ params }: Props) {
  return (
    <main className="container mx-auto px-4 py-8">
      <DeckForm deckId={params.deckId} />
    </main>
  );
}
