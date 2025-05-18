import { createContext, useContext, useState, ReactNode } from "react";

interface FooterContextType {
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  isZenMode: boolean;
  setIsZenMode: (value: boolean) => void;
  showFooter: boolean;
  setShowFooter: (value: boolean) => void;
  showCopySuccess: boolean;
  setShowCopySuccess: (value: boolean) => void;
}

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  return (
    <FooterContext.Provider
      value={{
        isMuted,
        setIsMuted,
        isZenMode,
        setIsZenMode,
        showFooter,
        setShowFooter,
        showCopySuccess,
        setShowCopySuccess,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error("useFooter must be used within a FooterProvider");
 