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
const SETTINGS_KEY = "writer-settings";

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

export const TAB_SIZE = 4;

// Load initial text and settings from localStorage if available
const getInitialState = (): WriterState => {
  // Always start with the default state
  const defaultState: WriterState = {
    text: "",
    settings: {
      cursorWidth: 2,
      theme: lightTheme,
      fontSize: 18,
      lineHeight: 1.8,
      isMuted: false,
      isZenMode: false,
    },
  };

  // Only try to load from localStorage on the client side
  if (typeof window === "undefined") {
    return defaultState;
  }

  const savedText = localStorage.getItem(STORAGE_KEY) || "";
  const savedSettings = localStorage.getItem(SETTINGS_KEY);

  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      return {
        text: savedText,
        settings: {
          ...defaultState.settings,
          ...parsedSettings,
        },
      };
    } catch (e) {
      console.error("Failed to parse saved settings:", e);
    }
  }

  return {
    text: savedText,
    settings: defaultState.settings,
  };
};

type WriterAction =
  | { type: "UPDATE_TEXT"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<WriterSettings> }
  | { type: "TOGGLE_ZEN_MODE" }
  | { type: "LOAD_SAVED_STATE"; payload: WriterState };

function writerReducer(state: WriterState, action: WriterAction): WriterState {
  switch (action.type) {
    case "UPDATE_TEXT":
      return { ...state, text: action.payload };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case "TOGGLE_ZEN_MODE":
      return {
        ...state,
        settings: {
          ...state.settings,
          isZenMode: !state.settings.isZenMode,
        },
      };
    case "LOAD_SAVED_STATE":
      return action.payload;
    default:
      return state;
  }
}

const WriterContext = createContext<WriterContextType | undefined>(undefined);

export function WriterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(writerReducer, getInitialState());

  // Load saved state from localStorage after initial render
  useEffect(() => {
    const savedText = localStorage.getItem(STORAGE_KEY) || "";
    const savedSettings = localStorage.getItem(SETTINGS_KEY);

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({
          type: "LOAD_SAVED_STATE",
          payload: {
            text: savedText,
            settings: {
              ...state.settings,
              ...parsedSettings,
            },
          },
        });
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    } else if (savedText) {
      // If only text is saved, update just the text
      dispatch({ type: "UPDATE_TEXT", payload: savedText });
    }
  }, []);

  // Save text to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, state.text);
    }
  }, [state.text]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    }
  }, [state.settings]);

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

  const updateSettings = (settings: Partial<WriterSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  const toggleZenMode = () => {
    dispatch({ type: "TOGGLE_ZEN_MODE" });
  };

  return (
    <WriterContext.Provider
      value={{
        state,
        updateText,
        updateSettings,
        toggleZenMode,
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
