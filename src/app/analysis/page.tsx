export const metadata = {
  title: "타로 기록 분석 | Whispers of the Stars",
  description:
    "자주 등장한 타로 카드와 키워드를 분석하고, 반복되는 질문 속에서 당신만의 흐름을 찾아보세요. 기록 기반 맞춤 분석으로 더 깊은 통찰을 제공합니다.",
  openGraph: {
    title: "타로 기록 분석 | Whispers of the Stars",
    description:
      "자주 등장한 타로 카드와 키워드를 분석하고, 반복되는 질문 속에서 당신만의 흐름을 찾아보세요. 기록 기반 맞춤 분석으로 더 깊은 통찰을 제공합니다.",
    url: "https://your-domain.com/analysis",
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
    title: "타로 기록 분석 | Whispers of the Stars",
    description:
      "자주 등장한 타로 카드와 키워드를 분석하고, 반복되는 질문 속에서 당신만의 흐름을 찾아보세요. 기록 기반 맞춤 분석으로 더 깊은 통찰을 제공합니다.",
    images: ["https://your-domain.com/images/them/og-default.png"],
  },
};

import PageClient from "./PageClient";

export default function AnalysisPage() {
  return <PageClient />;
}
