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
}
export interface RecordSummary {
  id: string;
  title: string;
  content: string;
  created_at: string;
  cards?: string[];
  image_urls: string[];
}
