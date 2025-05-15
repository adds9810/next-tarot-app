// src/app/layout.tsx (서버 컴포넌트 유지)
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whispers of the Stars | 오늘의 타로 운세",
  description:
    "78장의 타로카드로 오늘의 운세를 확인하고, 나만의 타로 기록을 남겨보세요. 감성적인 리딩과 맞춤형 분석까지 한 번에.",
  openGraph: {
    title: "Whispers of the Stars | 오늘의 타로 운세",
    description:
      "78장의 타로카드로 오늘의 운세를 확인하고, 나만의 타로 기록을 남겨보세요. 감성적인 리딩과 맞춤형 분석까지 한 번에.",
    url: "https://your-domain.com/",
    siteName: "Whispers of the Stars",
    images: [
      {
        url: "https://your-domain.com/images/them/og-default.png",
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
    title: "Whispers of the Stars | 오늘의 타로 운세",
    description:
      "78장의 타로카드로 오늘의 운세를 확인하고, 나만의 타로 기록을 남겨보세요. 감성적인 리딩과 맞춤형 분석까지 한 번에.",
    images: ["https://your-domain.com/images/them/og-default.png"],
  },
  icons: {
    icon: [{ url: "/images/favicon.ico", href: "/images/favicon.ico" }],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-[#070817]`}>
        <Providers>
          <Header />
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
