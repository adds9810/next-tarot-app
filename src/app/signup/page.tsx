import { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://next-tarot-app.vercel.app/"),
  title: "회원가입 | Whispers of the Stars",
  description:
    "Whispers of the Stars에 가입하고 나만의 타로 기록을 저장하고 분석해보세요.",
  openGraph: {
    title: "회원가입 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 가입하고, 감성적인 타로 여정을 시작하세요.",
    url: "/signup",
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
    title: "회원가입 | Whispers of the Stars",
    description:
      "Whispers of the Stars에 가입하고, 감성적인 타로 여정을 시작하세요.",
    images: ["/images/them/og-default.png"],
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function SignUpPage() {
  return <PageClient />;
}
