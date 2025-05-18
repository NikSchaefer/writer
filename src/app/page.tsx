"use client";

import { WriterProvider } from "@/contexts/WriterContext";
import { Writer } from "@/components/Writer";

export default function Home() {
  return (
    <WriterProvider>
      <Writer />
    </WriterProvider>
  );
}
