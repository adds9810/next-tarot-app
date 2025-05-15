export const metadata = {
  title: "나의 타로 기록 | Whispers of the Stars",
  description:
    "지금까지 저장한 타로 운세 기록을 한눈에 확인하고 다시 돌아볼 수 있어요.",
  openGraph: {
    title: "나의 타로 기록 | Whispers of the Stars",
    description:
      "지금까지 저장한 타로 운세 기록을 한눈에 확인하고 다시 돌아볼 수 있어요.",
    url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/record",
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
    title: "나의 타로 기록 | Whispers of the Stars",
    description:
      "지금까지 저장한 타로 운세 기록을 한눈에 확인하고 다시 돌아볼 수 있어요.",
    images: [
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
    ],
  },
};

import PageClient from "./PageClient";

export default function RecordPage() {
  return <PageClient />;
}
