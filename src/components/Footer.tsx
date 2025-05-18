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
  Info,
  Copy,
  Check,
  Trash2,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";
import { useWriter } from "@/contexts/WriterContext";

interface FooterProps {
  textColor: string;
  text: string;
  onClear: () => void;
}

export function Footer({ textColor, text, onClear }: FooterProps) {
  const [showFooter, setShowFooter] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const footerTimeoutRef = useRef<NodeJS.Timeout>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout>(null);
  const { state, toggleZenMode } = useWriter();

  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

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
        color: textColor,
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

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Info</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Words:</span>
                <span>{wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span>{text.replace(/\s/g, "").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Paragraphs:</span>
                <span>
                  {
                    text.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{readingTime}m</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleZenMode}
              className="h-6 w-6"
            >
              {state.settings.isZenMode ? (
                <Lightbulb className="h-3 w-3" />
              ) : (
                <LightbulbOff className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{state.settings.isZenMode ? "Exit Focus Mode" : "Focus Mode"}</p>
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
              onClick={onClear}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
