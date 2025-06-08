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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const completionTimeoutRef = useRef<NodeJS.Timeout>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Clear any existing timeouts when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // Handle text changes and trigger completion
  useEffect(() => {
    if (text === lastText) {
      return;
    }

    // Clear any existing completion when text changes
    setPreviewCompletion(null);
    setCurrentWordIndex(0);

    if (!isAIEnabled || !aiAPIKey || !text || isCompleting || isLoading) {
      setLastText(text);
      return;
    }

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }

    // Wait 1.5 seconds before showing completion
    completionTimeoutRef.current = setTimeout(async () => {
      setIsCompleting(true);
      const completion = await getCompletion(text);
      setIsCompleting(false);

      if (completion) {
        // Add a fade-in effect
        setPreviewCompletion("");
        fadeTimeoutRef.current = setTimeout(() => {
          setPreviewCompletion(completion.replace(/\n/g, " "));
        }, 100);
      }

      setLastText(text);
    }, 1500);

    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
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

  // Function to accept the next word of the completion
  const acceptNextWord = () => {
    if (!previewCompletion) return null;

    const words = previewCompletion.split(" ");
    if (currentWordIndex >= words.length) return null;

    const nextWord = words[currentWordIndex];
    setCurrentWordIndex((prev) => prev + 1);

    // Update the preview completion to remove the accepted word
    const remainingWords = words.slice(currentWordIndex + 1).join(" ");
    if (remainingWords) {
      setPreviewCompletion(remainingWords.replace(/\n/g, " "));
    } else {
      setPreviewCompletion(null);
      setCurrentWordIndex(0);
    }

    return nextWord;
  };

  return {
    previewCompletion,
    setPreviewCompletion,
    isCompleting,
    isLoading,
    acceptNextWord,
    currentWordIndex,
  };
}

function wrapWithPrompts(text: string) {
  return `
  :

  ${text}
  `;
}
