"use client";

import dynamic from "next/dynamic";

const StarryBackground = dynamic(() => import("./StarryBackground"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#070817]" />,
});

export default function ClientStarryBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#070817] via-[#1C1635]/95 to-[#070817]" />
      <StarryBackground />
    </div>
  );
}
