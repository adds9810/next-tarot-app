"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import GuestMain from "@/components/main/GuestMain";
import UserMain from "@/components/main/UserMain";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const { toast } = useToast();

  // ✅ 로그인 상태 확인
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);

        const nickname =
          session.user.user_metadata?.nickname ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          "";

        setNickname(nickname);
      } else {
        setUser(null);
        setNickname("");
      }

      setIsLoading(false);
      setMounted(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ 가입 안내 메시지 (소셜 로그인 포함) 지연 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      const storedMessage = localStorage.getItem("signup_message");
      if (storedMessage) {
        toast({
          title: "🎉 가입 완료",
          description: storedMessage,
          duration: 5000,
        });
        localStorage.removeItem("signup_message");
      }
    }, 300); // 살짝 지연

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || isLoading) {
    return (
      <LoadingIndicator message="🔮 기억의 흔적을 조심스럽게 불러오는 중이에요." />
    );
  }

  return (
    <div className="text-white overflow-hidden">
      {user ? <UserMain nickname={nickname} /> : <GuestMain />}
    </div>
  );
}
