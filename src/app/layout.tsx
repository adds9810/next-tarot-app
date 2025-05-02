import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import PageBackground from "@/components/PageBackground";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

// Google Font
const inter = Inter({ subsets: ["latin"] });

// Metadata
export const metadata: Metadata = {
  title: "Whispers of the Stars",
  description: "당신의 운명을 타로와 함께",
  icons: {
    icon: [
      {
        url: "/images/favicon.ico",
        href: "/images/favicon.ico",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* Providers로 래핑하여 Supabase 인증 상태 제공 */}
        <Providers>
          {/* Header에 로그인 상태 전달 */}
          <Header />
          {/* 페이지 배경 */}
          <PageBackground>
            <main>{children}</main>
          </PageBackground>
        </Providers>
        {/* Toaster 컴포넌트 (알림용) */}
        <Toaster />
      </body>
    </html>
  );
}
