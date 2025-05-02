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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("📦 Auth Event:", _event);
      console.log("📦 Session from onAuthStateChange:", session);

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
