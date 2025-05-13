"use client";

import { usePathname } from "next/navigation";
import PageBackground from "@/components/background/PageBackground";
import ClientStarryBackground from "@/components/background/ClientStarryBackground";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPlainBackground = pathname.startsWith("/record");
  return !isPlainBackground ? (
    <PageBackground>
      <main>{children}</main>
    </PageBackground>
  ) : (
    <ClientStarryBackground>
      <main>{children}</main>
    </ClientStarryBackground>
  );
}
