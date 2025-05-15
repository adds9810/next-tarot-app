import { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://next-tarot-app.vercel.app/"),
  title: "오늘의 타로 운세 | Whispers of the Stars",
  description:
    "78장의 타로카드로 오늘의 운세를 확인하고, 감성적인 메시지를 받아보세요.",
  openGraph: {
    title: "오늘의 타로 운세 | Whispers of the Stars",
    description: "카드를 한 장 뽑고, 별들이 전하는 오늘의 메시지를 들어보세요.",
    url: "/tarot",
    siteName: "Whispers of the Stars",
    images: [
      {
        url: "/images/them/og-default.png",
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
    images: ["/images/them/og-default.png"],
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function TarotPage() {
  return <PageClient />;
}
