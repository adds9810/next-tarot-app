import { Card } from "./card";

export interface RecordDetail {
  id: string;
  user_id: string;
  title: string;
  content: string;
  interpretation?: string;
  feedback?: string;
  image_urls: string[];
  main_cards: string[];
  sub_cards: string[];
  created_at: string;
  updated_at: string;
  main_cards_data?: Card[];
  sub_cards_data?: Card[];
  category?: string;
}

export type RecordCategory =
  | "오늘의 운세"
  | "연애 / 관계"
  | "진로 / 직업"
  | "건강 / 감정"
  | "재정 / 돈"
  | "자기 성찰"
  | "기타";

export interface RecordSummary {
  id: string;
  title: string;
  content: string;
  created_at: string;
  cards?: string[];
  main_card_image_url?: string;
  image_urls?: string[];
  category?: string;
}
