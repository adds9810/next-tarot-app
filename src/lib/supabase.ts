// lib/supabase.ts
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

// 브라우저 클라이언트 생성 (인자 없음)
export const supabase = createPagesBrowserClient();
