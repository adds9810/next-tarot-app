"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import GuestMain from "@/components/main/GuestMain";
import UserMain from "@/components/main/UserMain";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          // 로그인한 사용자의 세션이 존재하는 경우
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (!existingUser) {
            await supabase.from("users").insert({
              id: session.user.id,
              email: session.user.email,
              nickname:
                session.user.user_metadata?.nickname ||
                session.user.user_metadata?.full_name ||
                session.user.email?.split("@")[0],
              profile_image: session.user.user_metadata?.avatar_url || null,
            });
          }
          // 구글 로그인의 경우 이메일에서 닉네임 추출
          if (session.user.app_metadata.provider === "google") {
            const emailNickname = session.user.email?.split("@")[0] || "";
            setNickname(emailNickname);
          } else {
            // 일반 회원가입의 경우 저장된 닉네임 사용
            const userNickname = session.user.user_metadata.nickname;
            setNickname(
              userNickname || session.user.email?.split("@")[0] || ""
            );
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    checkAuth();

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // 구글 로그인의 경우 이메일에서 닉네임 추출
        if (session.user.app_metadata.provider === "google") {
          const emailNickname = session.user.email?.split("@")[0] || "";
          setNickname(emailNickname);
        } else {
          // 일반 회원가입의 경우 저장된 닉네임 사용
          const userNickname = session.user.user_metadata.nickname;
          setNickname(userNickname || session.user.email?.split("@")[0] || "");
        }
      } else {
        setUser(null);
        setNickname("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]" />
      </div>
    );
  }

  return (
    <main className=" text-white overflow-hidden">
      {user ? <UserMain nickname={nickname} /> : <GuestMain />}
    </main>
  );
}
