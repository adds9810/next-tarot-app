import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "기록 남기기 | Whispers of the Stars",
  description: "오늘의 타로 리딩을 기록해보세요.",
  openGraph: {
    title: "기록 남기기",
    description: "오늘의 타로 리딩을 기록해보세요.",
    url: "/record/create",
    images: ["/images/them/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "기록 남기기",
    description: "오늘의 타로 리딩을 기록해보세요.",
    images: ["/images/them/og-default.png"],
  },
};

const PageClient = dynamic(() => import("./PageClient"), { ssr: false });

export default function Page() {
  return <PageClient />;
}
