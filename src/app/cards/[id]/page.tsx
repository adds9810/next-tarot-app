import { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "덱 수정 | Whispers of the Stars",
  description: "등록한 덱과 카드를 수정해보세요.",
  openGraph: {
    title: "덱 수정",
    description: "등록한 덱과 카드를 수정해보세요.",
    url: "/cards/[id]",
    images: ["/images/them/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "덱 수정",
    description: "등록한 덱과 카드를 수정해보세요.",
    images: ["/images/them/og-default.png"],
  },
};

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  return <PageClient />;
}
