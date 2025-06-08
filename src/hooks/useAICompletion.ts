import { useState } from "react";
import { AIService } from "@/services/ai";
import { useWriterStore } from "@/store/writerStore";

export function useAICompletion() {
  const { settings } = useWriterStore();
  const [isLoading, setIsLoading] = useState(false);
  const aiService = AIService.getInstance();

  const getCompletion = async (text: string) => {
    if (!settings.isAIEnabled || !settings.aiAPIKey) {
      return null;
    }

    try {
      setIsLoading(true);
      const completion = await aiService.getCompletion({
        apiKey: settings.aiAPIKey,
        text,
      });
      return completion;
    } catch (error) {
      console.error("AI completion error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCompletion,
    isLoading,
  };
}
