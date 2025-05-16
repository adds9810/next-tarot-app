"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import GuestMain from "@/components/main/GuestMain";
import UserMain from "@/components/main/UserMain";
import MysticSpinner from "@/components/MysticSpinner";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const { toast } = useToast();

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

  // ✅ 회원가입 성공 메시지 표시 (최초 렌더링 시 1회 실행)
  useEffect(() => {
    const storedMessage = localStorage.getItem("signup_message");
    if (storedMessage) {
      toast({
        title: "회원가입 완료",
        description: storedMessage,
        duration: 5000,
      });
      localStorage.removeItem("signup_message");
    }
  }, []);

  if (!mounted || isLoading) {
    return <MysticSpinner />;
  }

  return (
    <div className="text-white overflow-hidden">
      {user ? <UserMain nickname={nickname} /> : <GuestMain />}
    </div>
  );
}
