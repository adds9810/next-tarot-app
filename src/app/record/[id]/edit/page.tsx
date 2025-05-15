export const metadata = {
  title: "타로 기록 수정하기 | Whispers of the Stars",
  description:
    "저장된 타로 기록을 수정하고 다시 저장해보세요. 기록은 당신의 흐름을 보여주는 중요한 단서가 됩니다.",
};

import PageClient from "./PageClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditRecordPage({ params }: PageProps) {
  return <PageClient id={params.id} />;
}
