export const metadata = {
  title: "회원가입 | Whispers of the Stars",
  description:
    "Whispers of the Stars에 가입하고 나만의 타로 기록을 저장하고 분석해보세요.",
  openGraph: {
    title: "회원가입 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 가입하고, 감성적인 타로 여정을 시작하세요.",
    url: "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/signup",
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
    title: "회원가입 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 가입하고, 감성적인 타로 여정을 시작하세요.",
    images: [
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app/images/them/og-default.png",
    ],
  },
};

import PageClient from "./PageClient";

export default function SignUpPage() {
  return <PageClient />;
}
