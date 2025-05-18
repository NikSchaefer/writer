"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { WriterState, WriterContextType, WriterSettings } from "@/types/writer";

const STORAGE_KEY = "writer-content";

const lightTheme = {
  background: "#fafafa",
  text: "#2d2d2d",
  cursor: "#2d2d2d",
};

const darkTheme = {
  background: "#1a1a1a",
  text: "#e5e5e5",
  cursor: "#e5e5e5",
};

// Load initial text from localStorage if available
const getInitialText = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY) || "";
  }
  return "";
};

const initialState: WriterState = {
  text: getInitialText(),
  cursorPosition: 0,
  settings: {
    cursorSpeed: 0.1, // Faster, more responsive cursor movement
    cursorWidth: 2, // Thicker cursor for better visibility
    theme: lightTheme,
    fontSize: 18, // Optimal reading size
    lineHeight: 1.8, // Comfortable line spacing for readability
  },
};

type WriterAction =
  | { type: "UPDATE_TEXT"; payload: string }
  | { type: "UPDATE_CURSOR"; payload: number }
  | { type: "UPDATE_SETTINGS"; payload: Partial<WriterSettings> };

function writerReducer(state: WriterState, action: WriterAction): WriterState {
  switch (action.type) {
    case "UPDATE_TEXT":
      return { ...state, text: action.payload };
    case "UPDATE_CURSOR":
      return { ...state, cursorPosition: action.payload };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
}

const WriterContext = createContext<WriterContextType | undefined>(undefined);

export function WriterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(writerReducer, initialState);

  // Save text to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, state.text);
    }
  }, [state.text]);

  useEffect(() => {
    // Check system theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial theme check
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      dispatch({
        type: "UPDATE_SETTINGS",
        payload: {
          theme: e.matches ? darkTheme : lightTheme,
        },
      });
    };

    // Set initial theme
    updateTheme(mediaQuery);

    // Listen for theme changes
    mediaQuery.addEventListener("change", updateTheme);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  const updateText = (text: string) => {
    dispatch({ type: "UPDATE_TEXT", payload: text });
  };

  const updateCursorPosition = (position: number) => {
    dispatch({ type: "UPDATE_CURSOR", payload: position });
  };

  const updateSettings = (settings: Partial<WriterSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  return (
    <WriterContext.Provider
      value={{
        state,
        updateText,
        updateCursorPosition,
        updateSettings,
      }}
    >
      {children}
    </WriterContext.Provider>
  );
}

export function useWriter() {
  const context = useContext(WriterContext);
  if (context === undefined) {
    throw new Error("useWriter must be used within a WriterProvider");
  }
  return context;
}
