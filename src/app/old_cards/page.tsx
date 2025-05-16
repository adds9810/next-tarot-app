import { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "내 덱과 카드 관리 | Whispers of the Stars",
  description: "등록한 덱과 카드를 관리하세요.",
  openGraph: {
    title: "내 덱과 카드 관리",
    description: "등록한 덱과 카드를 관리하세요.",
    url: "/cards",
    images: ["/images/them/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "내 덱과 카드 관리",
    description: "등록한 덱과 카드를 관리하세요.",
    images: ["/images/them/og-default.png"],
  },
};

export default function DeckPage() {
  return <PageClient />;
}
