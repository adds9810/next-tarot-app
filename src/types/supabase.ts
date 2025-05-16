export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          user_id?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          deck_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          content: string;
          deck_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          content?: string;
          deck_id?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
