export interface WriterState {
  text: string;
  cursorPosition: number;
  settings: WriterSettings;
  autocomplete: {
    suggestions: string[];
    activeIndex: number;
    isVisible: boolean;
    triggerWord: string;
  };
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
}

export interface WriterContextType {
  state: WriterState;
  updateText: (text: string) => void;
  updateCursorPosition: (position: number) => void;
  updateSettings: (settings: Partial<WriterSettings>) => void;
  updateAutocomplete: (updates: Partial<WriterState["autocomplete"]>) => void;
}
