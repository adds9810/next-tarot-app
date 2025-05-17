import { Metadata } from "next";
import PageClient from "./PageClient";

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "타로 기록 수정하기 | Whispers of the Stars",
  description:
    "저장된 타로 기록을 수정하고 다시 저장해보세요. 기록은 당신의 흐름을 보여주는 중요한 단서가 됩니다.",
  openGraph: {
    title: "타로 기록 수정하기 | Whispers of the Stars",
    description:
      "저장된 타로 기록을 수정하고 다시 저장해보세요. 기록은 당신의 흐름을 보여주는 중요한 단서가 됩니다.",
    url: "/record/[id]/edit",
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
    title: "타로 기록 수정하기 | Whispers of the Stars",
    description:
      "저장된 타로 기록을 수정하고 다시 저장해보세요. 기록은 당신의 흐름을 보여주는 중요한 단서가 됩니다.",
    images: ["/images/them/og-default.png"],
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function EditRecordPage({ params }: PageProps) {
  return <PageClient id={params.id} />;
}
