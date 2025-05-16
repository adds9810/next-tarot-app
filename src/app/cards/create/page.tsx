import { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "덱 등록 | Whispers of the Stars",
  description: "나만의 타로 덱을 등록해보세요.",
  openGraph: {
    title: "덱 등록",
    description: "나만의 타로 덱을 등록해보세요.",
    url: "/cards/create",
    images: ["/images/them/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "덱 등록",
    description: "나만의 타로 덱을 등록해보세요.",
    images: ["/images/them/og-default.png"],
  },
};

export default function Page() {
  return <PageClient />;
}
