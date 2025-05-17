import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "로그인 | Whispers of the Stars",
  description: "로그인하고 나만의 타로 기록을 저장하고 분석해보세요.",
  openGraph: {
    title: "로그인 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 로그인하고, 별빛으로 기록을 시작해보세요.",
    url: "/login",
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
    title: "로그인 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 로그인하고, 별빛으로 기록을 시작해보세요.",
    images: ["/images/them/og-default.png"],
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function LoginPage() {
  return <PageClient />;
}
