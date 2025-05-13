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
  title: "Whispers of the Stars",
  description: "당신의 운명을 타로와 함께",
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
