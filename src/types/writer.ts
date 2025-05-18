export interface WriterState {
  text: string;
  settings: WriterSettings;
}

export interface WriterSettings {
  cursorWidth: number;
  theme: {
    background: string;
    text: string;
    cursor: string;
  };
  fontSize: number;
  lineHeight: number;
  isMuted: boolean;
  isZenMode: boolean;
}

export interface WriterContextType {
  state: WriterState;
  updateText: (text: string) => void;
  updateSettings: (settings: Partial<WriterSettings>) => void;
  toggleZenMode: () => void;
}
