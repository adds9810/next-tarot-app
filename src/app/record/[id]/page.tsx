export const metadata = {
  title: "타로 기록 상세보기 | Whispers of the Stars",
  description:
    "선택한 타로 카드와 그 해석을 다시 확인해보세요. 기록은 당신이 지나온 여정을 보여주는 감성 아카이브입니다.",
};

import PageClient from "./PageClient";

interface PageProps {
  params: { id: string };
}

export default function RecordDetailPage({ params }: PageProps) {
  return <PageClient id={params.id} />;
}
