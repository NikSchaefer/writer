"use client";

import { useRef, useState, useEffect } from "react";
import { TAB_SIZE, useWriter, WriterProvider } from "@/contexts/WriterContext";
import { Textarea } from "./ui/textarea";
import { Footer } from "./Footer";
import { ZenModeMask } from "./ZenModeMask";
import { Cursor } from "./Cursor";
import { useCursorPosition } from "@/hooks/useCursorPosition";

function WriterContent() {
  const { state, updateText } = useWriter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { cursorLeft, cursorTop, updateCursorPosition } = useCursorPosition();

  const { isZenMode } = state.settings;

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateText(newText);
    updateCursorPosition(e.target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // If there's a selection, indent all selected lines
      if (start !== end) {
        const selectedText = value.substring(start, end);
        const lines = selectedText.split("\n");
        const indentedText = lines.map((line) => "    " + line).join("\n");
        const newValue =
          value.substring(0, start) + indentedText + value.substring(end);
        updateText(newValue);

        // Set cursor position after the indented text
        setTimeout(() => {
          textarea.selectionStart = start + indentedText.length;
          textarea.selectionEnd = start + indentedText.length;
          updateCursorPosition(textarea);
        }, 0);
      } else {
        // If no selection, just insert four spaces at cursor position
        const newValue =
          value.substring(0, start) + "    " + value.substring(end);
        updateText(newValue);

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = start + TAB_SIZE + 1;
          textarea.selectionEnd = start + TAB_SIZE + 1;
          updateCursorPosition(textarea);
        }, 0);
      }
      return;
    }

    // Handle arrow keys
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      // Let the default behavior happen first to update the cursor position
      setTimeout(() => {
        updateCursorPosition(textarea);
      }, 0);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    updateCursorPosition(textarea);
  };

  // Focus textarea on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: state.settings.theme.background }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="relative">
            <Textarea
              autoResize
              ref={inputRef}
              value={state.text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onClick={handleClick}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full font-text bg-transparent resize-none outline-none border-none shadow-none p-0 m-0 ring-0"
              style={{
                color: state.settings.theme.text,
                fontSize: `${state.settings.fontSize}px`,
                lineHeight: state.settings.lineHeight,
                caretColor: "transparent",
                whiteSpace: "pre-wrap",
                minHeight: "60vh",
                opacity: isZenMode ? 0.1 : 1,
              }}
              placeholder="Write..."
            />
            {isZenMode && (
              <ZenModeMask
                text={state.text}
                cursorTop={cursorTop}
                fontSize={state.settings.fontSize}
                lineHeight={state.settings.lineHeight}
                textColor={state.settings.theme.text}
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
            fontSize={state.settings.fontSize}
            width={state.settings.cursorWidth}
            color={state.settings.theme.cursor}
            isVisible={isFocused}
          />
        </div>
      </div>
      <Footer
        textColor={state.settings.theme.text}
        text={state.text}
        onClear={() => updateText("")}
      />
    </div>
  );
}

export function Writer() {
  return (
    <WriterProvider>
      <WriterContent />
    </WriterProvider>
  );
}
