import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 싱글톤 패턴으로 Supabase 클라이언트 생성
let supabase: ReturnType<typeof createBrowserClient>;

if (typeof window !== "undefined") {
  supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
} else {
  // 서버 사이드에서는 새로운 인스턴스 생성
  supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
