// lib/supabase.ts
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

// Supabase 브라우저 클라이언트 생성
export const supabase = createPagesBrowserClient();

// 이미지 업로드 함수
export async function uploadImageToSupabase(
  file: File,
  userId: string
): Promise<string | null> {
  const timestamp = Date.now();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("record-images") // 🔁 실제 버킷 이름으로 바꿔야 함
    .upload(fileName, file);

  if (error) {
    console.error("이미지 업로드 실패:", error.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("record-images") // 🔁 동일하게 버킷 이름 일치
    .getPublicUrl(fileName);

  return publicUrl;
}
