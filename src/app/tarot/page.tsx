export const metadata = {
  title: "오늘의 타로 운세 | Whispers of the Stars",
  description:
    "78장의 타로카드로 오늘의 운세를 확인하고, 감성적인 메시지를 받아보세요.",
  openGraph: {
    title: "오늘의 타로 운세 | Whispers of the Stars",
    description: "카드를 한 장 뽑고, 별들이 전하는 오늘의 메시지를 들어보세요.",
    url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/tarot",
    siteName: "Whispers of the Stars",
    images: [
      {
        url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
        width: 1200,
        height: 630,
        alt: "Whispers of the Stars 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "오늘의 타로 운세 | Whispers of the Stars",
    description: "카드를 한 장 뽑고, 별들이 전하는 오늘의 메시지를 들어보세요.",
    images: [
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
    ],
  },
};

import PageClient from "./PageClient";

export default function TarotPage() {
  return <PageClient />;
}
