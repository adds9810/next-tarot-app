export const metadata = {
  title: "로그인 | Whispers of the Stars",
  description: "로그인하고 나만의 타로 기록을 저장하고 분석해보세요.",
  openGraph: {
    title: "로그인 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 로그인하고, 별빛으로 기록을 시작해보세요.",
    url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/login",
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
    title: "로그인 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 로그인하고, 별빛으로 기록을 시작해보세요.",
    images: [
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
    ],
  },
};

import PageClient from "./PageClient";

export default function LoginPage() {
  return <PageClient />;
}
