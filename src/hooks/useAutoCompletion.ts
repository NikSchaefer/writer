import { useState, useRef, useEffect } from "react";
import { useAICompletion } from "@/hooks/useAICompletion";

interface UseCompletionProps {
  text: string;
  isAIEnabled: boolean;
  aiAPIKey: string | null;
}

export function useCompletion({
  text,
  isAIEnabled,
  aiAPIKey,
}: UseCompletionProps) {
  const { getCompletion, isLoading } = useAICompletion();
  const [isCompleting, setIsCompleting] = useState(false);
  const [previewCompletion, setPreviewCompletion] = useState<string | null>(
    null
  );
  const [lastText, setLastText] = useState(text);
  const completionTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (text === lastText) {
      return;
    }

    if (!isAIEnabled || !aiAPIKey || !text || isCompleting || isLoading) {
      setLastText(text);
      return;
    }

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }

    completionTimeoutRef.current = setTimeout(async () => {
      setIsCompleting(true);
      const completion = await getCompletion(text);
      setIsCompleting(false);
      setPreviewCompletion(completion);
      setLastText(text);
    }, 3000);

    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [
    text,
    isAIEnabled,
    aiAPIKey,
    isCompleting,
    isLoading,
    getCompletion,
    lastText,
  ]);

  return {
    previewCompletion,
    setPreviewCompletion,
    isCompleting,
    isLoading,
  };
}
