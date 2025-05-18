"use client";

import dynamic from "next/dynamic";

const Writer = dynamic(
  () => import("@/components/Writer").then((mod) => mod.Writer),
  {
    ssr: false,
  }
);

export default function Home() {
  return <Writer />;
}
