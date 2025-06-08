"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Maximize2,
  Copy,
  Check,
  Trash2,
  Lightbulb,
  LightbulbOff,
  Sparkles,
} from "lucide-react";
import { Input } from "./ui/input";
import { useWriterStore } from "@/store/writerStore";

export function Footer() {
  const { text, settings, toggleZenMode, updateSettings, updateText } =
    useWriterStore();

  const [showFooter, setShowFooter] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const footerTimeoutRef = useRef<NodeJS.Timeout>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout>(null);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setShowCopySuccess(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setShowCopySuccess(false);
    }, 1000);
  };

  const toggleAIEnabled = () => {
    const newAIEnabled = !settings.isAIEnabled;
    updateSettings({
      isAIEnabled: newAIEnabled,
    });
    if (newAIEnabled) {
      setShowAISettings(true);
    }
  };

  const handleAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      aiAPIKey: e.target.value,
    });
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowFooter(true);

      if (footerTimeoutRef.current) {
        clearTimeout(footerTimeoutRef.current);
      }

      footerTimeoutRef.current = setTimeout(() => {
        setShowFooter(false);
      }, 2000);
    };

    const handleKeyDown = () => {
      setShowFooter(false);
      if (footerTimeoutRef.current) {
        clearTimeout(footerTimeoutRef.current);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (footerTimeoutRef.current) {
        clearTimeout(footerTimeoutRef.current);
      }
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-2 transition-opacity duration-300"
      style={{
        opacity: showFooter ? 0.5 : 0,
        color: "var(--writer-text)",
        pointerEvents: showFooter ? "auto" : "none",
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="h-6 w-6"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fullscreen</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleZenMode}
              className="h-6 w-6"
            >
              {settings.isZenMode ? (
                <Lightbulb className="h-3 w-3" />
              ) : (
                <LightbulbOff className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{settings.isZenMode ? "Exit Focus Mode" : "Focus Mode"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-6 w-6 relative"
            >
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                style={{
                  opacity: showCopySuccess ? 1 : 0,
                  transform: `scale(${showCopySuccess ? 1 : 0.8})`,
                }}
              >
                <Check className="h-3 w-3" />
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                style={{
                  opacity: showCopySuccess ? 0 : 1,
                  transform: `scale(${showCopySuccess ? 0.8 : 1})`,
                }}
              >
                <Copy className="h-3 w-3" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateText("")}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear</p>
          </TooltipContent>
        </Tooltip>

        <Popover open={showAISettings} onOpenChange={setShowAISettings}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={toggleAIEnabled}
                >
                  <div className="relative">
                    <Sparkles className="h-3 w-3" />
                    {!settings.isAIEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[2px] bg-current rotate-45" />
                      </div>
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="api-key"
                  value={settings.aiAPIKey}
                  onChange={handleAPIKeyChange}
                  placeholder="Enter your Gemini API key"
                  className="w-full"
                />
              </div>
              <div className="text-xs flex items-center text-muted-foreground">
                <p>Get your API key from: </p>{" "}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {" "}
                  aistudio.google.com
                </a>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  );
}
