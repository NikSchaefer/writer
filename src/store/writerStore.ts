import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WriterSettings {
  isZenMode: boolean;
  isAIEnabled: boolean;
  aiAPIKey: string;
}

export interface WriterStore {
  text: string;
  settings: {
    isZenMode: boolean;
    isAIEnabled: boolean;
    aiAPIKey: string;
  };
  updateText: (text: string) => void;
  updateSettings: (settings: Partial<WriterSettings>) => void;
  toggleZenMode: () => void;
}

const defaultSettings: WriterSettings = {
  isZenMode: false,
  isAIEnabled: false,
  aiAPIKey: "",
};

export const useWriterStore = create<WriterStore>()(
  persist(
    (set) => ({
      text: "",
      settings: defaultSettings,
      updateText: (text) => set({ text }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      toggleZenMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            isZenMode: !state.settings.isZenMode,
          },
        })),
    }),
    {
      name: "writer-storage",
      partialize: (state) => ({
        text: state.text,
        settings: state.settings,
      }),
    }
  )
);
