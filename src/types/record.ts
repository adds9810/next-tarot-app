import { Card } from "./card";

export interface Record {
  id: string;
  user_id: string;
  title: string;
  content: string;
  images: string[];
  main_cards: string[];
  sub_cards: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  main_cards_data?: Card[];
  sub_cards_data?: Card[];
}
