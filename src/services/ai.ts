import { GoogleGenAI } from "@google/genai";

export interface AICompletionOptions {
  apiKey: string;
  text: string;
}

export class AIService {
  private static instance: AIService;
  private genAI: GoogleGenAI | null = null;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private initialize(apiKey: string) {
    if (!this.genAI) {
      this.genAI = new GoogleGenAI({ apiKey });
    }
  }

  async getCompletion({
    apiKey,
    text,
  }: AICompletionOptions): Promise<string | null> {
    try {
      this.initialize(apiKey);
      if (!this.genAI) throw new Error("AI not initialized");

      // Get the last few sentences for context
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const lastSentence = sentences[sentences.length - 1] || "";
      const context = sentences.slice(-3).join(". ");

      const prompt = `Complete the following text naturally, maintaining the same style and tone. Only provide the completion, not the original text:

Context: ${context}
Last sentence: ${lastSentence}

Completion:`;

      const response = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return response.text || null;
    } catch (error) {
      console.error("AI completion error:", error);
      return null;
    }
  }
}
