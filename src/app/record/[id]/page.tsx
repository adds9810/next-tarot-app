import PageClient from "./PageClient";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    metadataBase: new URL(
      "https://next-tarot-83fwiwbsh-adds9810s-projects.vercel.app"
    ),
    title: "타로 기록 상세보기 | Whispers of the Stars",
    description:
      "선택한 타로 카드와 그 해석을 다시 확인해보세요. 기록은 당신이 지나온 여정을 보여주는 감성 아카이브입니다.",
    openGraph: {
      title: "타로 기록 상세보기 | Whispers of the Stars",
      description: "감성적인 타로 해석과 기록을 확인해보세요.",
      url: `/record/${params.id}`,
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
      title: "타로 기록 상세보기 | Whispers of the Stars",
      description: "감성적인 타로 해석과 기록을 확인해보세요.",
      images: ["/images/them/og-default.png"],
    },
    icons: {
      icon: "/images/favicon.ico",
    },
  };
}

export default function RecordDetailPage({ params }: PageProps) {
  return <PageClient id={params.id} />;
}
