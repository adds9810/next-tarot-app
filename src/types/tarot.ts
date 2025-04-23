export interface TarotCard {
  id: number;
  name: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  description: string;
  category: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number?: number;
}

export interface Reading {
  id: string;
  userId: string;
  cards: TarotCard[];
  question?: string;
  interpretation: string;
  createdAt: Date;
}

export interface Fortune {
  id: string;
  date: Date;
  content: string;
  luckyNumber: number;
  luckyColor: string;
}
