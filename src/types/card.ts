export interface Card {
  id: string;
  deck_id: string;
  name: string;
  image: string;
  keywords: string[];
  created_at?: string;
  updated_at?: string;
}
