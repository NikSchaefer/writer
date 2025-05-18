export interface WriterState {
  text: string;
  cursorPosition: number;
  settings: WriterSettings;
}

export interface WriterSettings {
  cursorSpeed: number;
  cursorWidth: number;
  theme: {
    background: string;
    text: string;
    cursor: string;
  };
  fontSize: number;
  lineHeight: number;
}

export interface WriterContextType {
  state: WriterState;
  updateText: (text: string) => void;
  updateCursorPosition: (position: number) => void;
  updateSettings: (settings: Partial<WriterSettings>) => void;
}
