"use client";

import { Textarea } from "../ui/textarea";
import { useTextEditor } from "@/hooks/useTextEditor";
import { Cursor } from "../Cursor";
import { ZenModeMask } from "./ZenModeMask";
import { useWriterStore } from "@/store/writerStore";
import { CURSOR_WIDTH, FONT_SIZE, LINE_HEIGHT } from "@/config";
import { useCompletion } from "@/hooks/useAutoCompletion";

export function TextEditor() {
  const { text, settings, updateText } = useWriterStore();
  const { previewCompletion, setPreviewCompletion } = useCompletion({
    text: text,
    isAIEnabled: settings.isAIEnabled,
    aiAPIKey: settings.aiAPIKey,
  });

  const {
    inputRef,
    isFocused,
    setIsFocused,
    cursorLeft,
    cursorTop,
    handleInput,
    handleIndentation,
    handleArrowKeys,
    handleClick,
  } = useTextEditor();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    if (e.key === "Tab") {
      e.preventDefault();

      // If there's a preview completion, accept it
      if (previewCompletion) {
        const newText = text + previewCompletion;
        updateText(newText);
        setPreviewCompletion(null);
        return;
      }

      // Otherwise handle indentation
      handleIndentation(textarea);
      return;
    }

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      handleArrowKeys(textarea);
    }
  };

  return (
    <div className="relative">
      <div className="relative pb-[90vh]">
        <Textarea
          autoResize
          ref={inputRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full text-writer-text font-text bg-transparent resize-none outline-none border-none shadow-none p-0 m-0 ring-0"
          style={{
            fontSize: `${FONT_SIZE}px`,
            lineHeight: LINE_HEIGHT,
            caretColor: "transparent",
            whiteSpace: "pre-wrap",
            minHeight: "60vh",
            opacity: settings.isZenMode ? 0.1 : 1,
          }}
          placeholder="Write something interesting..."
        />
        {previewCompletion && (
          <div
            className="absolute text-writer-text top-0 left-0 w-full font-text pointer-events-none"
            style={{
              fontSize: `${FONT_SIZE}px`,
              lineHeight: LINE_HEIGHT,
              opacity: 0.5,
            }}
          >
            {text}
            <span className="text-primary"> {previewCompletion}</span>
          </div>
        )}
        {settings.isZenMode && (
          <ZenModeMask
            text={text}
            cursorTop={cursorTop}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
      </div>
      <Cursor
        left={cursorLeft}
        top={cursorTop}
        fontSize={FONT_SIZE}
        width={CURSOR_WIDTH}
        color="var(--writer-cursor)"
        isVisible={isFocused}
      />
    </div>
  );
}
