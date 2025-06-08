"use client";

import { Textarea } from "../ui/textarea";
import { useTextEditor } from "@/hooks/useTextEditor";
import { Cursor } from "../Cursor";
import { ZenModeMask } from "./ZenModeMask";
import { useWriterStore } from "@/store/writerStore";
import { FONT_SIZE, LINE_HEIGHT } from "@/config";
import { useCompletion } from "@/hooks/useAutoCompletion";

export function TextEditor() {
  const { text, settings, updateText } = useWriterStore();
  const { previewCompletion, setPreviewCompletion, acceptNextWord } =
    useCompletion({
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
    updateCursorPosition,
  } = useTextEditor();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    if (e.key === "Tab") {
      e.preventDefault();

      // If there's a preview completion, accept it
      if (previewCompletion) {
        e.preventDefault();
        // Trim any newlines from the completion text
        const newText = text + previewCompletion;
        updateText(newText);
        setPreviewCompletion(null);

        // Set cursor position immediately after the completion
        if (inputRef.current) {
          const cursorPos = newText.length;
          inputRef.current.selectionStart = cursorPos;
          inputRef.current.selectionEnd = cursorPos;
          setTimeout(() => {
            updateCursorPosition(inputRef.current!);
          }, 0);
        }
        return;
      }

      // Otherwise handle indentation
      handleIndentation(textarea);
      return;
    }

    if (e.key === "ArrowRight" && previewCompletion) {
      e.preventDefault();
      const nextWord = acceptNextWord();
      if (nextWord) {
        // Add a space only if the current text doesn't end with a space
        const needsSpace = text.length > 0 && !text.endsWith(" ");
        const newText = text + (needsSpace ? " " : "") + nextWord;
        updateText(newText);
      }
      return;
    }

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      // Clear completion on any cursor movement
      if (previewCompletion) {
        setPreviewCompletion(null);
      }
      handleArrowKeys(textarea);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Clear completion when typing
    if (previewCompletion) {
      setPreviewCompletion(null);
    }
    handleInput(e);
  };

  return (
    <div className="relative flex-1 flex flex-col">
      <Textarea
        autoResize
        ref={inputRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full caret-transparent flex-grow h-full min-h-full text-writer-text whitespace-pre-wrap font-text bg-transparent resize-none outline-none border-none shadow-none p-0 m-0 ring-0"
        style={{
          fontSize: `${FONT_SIZE}px`,
          lineHeight: LINE_HEIGHT,
          opacity: settings.isZenMode ? 0.1 : 1,
        }}
        placeholder="Write anything..."
      />
      {previewCompletion && (
        <div
          className="absolute text-writer-text top-0 left-0 w-full font-text pointer-events-none whitespace-pre-wrap"
          style={{
            fontSize: `${FONT_SIZE}px`,
            lineHeight: LINE_HEIGHT,
            opacity: 0.4,
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          {text}
          <span className="text-primary/60">{previewCompletion}</span>
        </div>
      )}
      {settings.isZenMode && (
        <ZenModeMask
          text={text}
          cursorTop={cursorTop}
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
      <Cursor left={cursorLeft} top={cursorTop} isVisible={isFocused} />
    </div>
  );
}
