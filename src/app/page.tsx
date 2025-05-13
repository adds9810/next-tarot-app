"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import GuestMain from "@/components/main/GuestMain";
import UserMain from "@/components/main/UserMain";
import MysticSpinner from "@/components/MysticSpinner";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");

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

  if (!mounted || isLoading) {
    return <MysticSpinner />;
  }

  return (
    <div className=" text-white overflow-hidden">
      {user ? <UserMain nickname={nickname} /> : <GuestMain />}
    </div>
  );
}
