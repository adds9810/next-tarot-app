export const metadata = {
  title: "타로 기록 저장하기 | Whispers of the Stars",
  description:
    "지금 뽑은 타로카드와 해석을 기록으로 남기고 나만의 타로 아카이브를 만들어보세요.",
  openGraph: {
    title: "타로 기록 저장하기 | Whispers of the Stars",
    description:
      "지금 뽑은 타로카드와 해석을 기록으로 남기고 나만의 타로 아카이브를 만들어보세요.",
    url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/record/create",
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
    title: "타로 기록 저장하기 | Whispers of the Stars",
    description:
      "지금 뽑은 타로카드와 해석을 기록으로 남기고 나만의 타로 아카이브를 만들어보세요.",
    images: [
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
    ],
  },
};

import PageClient from "./PageClient";

export default function CreateRecordPage() {
  return <PageClient />;
}
