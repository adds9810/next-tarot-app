// app/tarot/page.tsx
export const metadata = {
  title: "오늘의 타로운세 | Whispers of the Stars",
  description:
    "카드를 뽑고 별들이 전하는 메시지를 확인해보세요. 감성적인 리딩과 맞춤형 해석이 준비되어 있어요.",
};

import PageClient from "./PageClient";

export default function TarotPage() {
  return <PageClient />;
}
