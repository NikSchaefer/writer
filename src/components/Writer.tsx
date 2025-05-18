"use client";

import { useRef, useState, useEffect } from "react";
import { useWriter } from "@/contexts/WriterContext";
import { Textarea } from "./ui/textarea";
import { Footer } from "./Footer";

export function Writer() {
  const { state, updateText } = useWriter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [cursorLeft, setCursorLeft] = useState(0);
  const [cursorTop, setCursorTop] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateText(newText);
    updateCursorPosition(e.target);
  };

  const updateCursorPosition = (textarea: HTMLTextAreaElement) => {
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;

    // Get the text up to the cursor position
    const textBeforeCursor = text.substring(0, cursorPos);

    // Split the text into lines
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Create a temporary div to measure text width with wrapping
    const div = document.createElement("div");
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.style.width = `${textarea.clientWidth}px`;
    div.style.fontSize = `${state.settings.fontSize}px`;
    div.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.textContent = currentLine;

    document.body.appendChild(div);

    // Get all line rectangles
    const range = document.createRange();
    range.selectNodeContents(div);
    const rects = range.getClientRects();
    const lastRect = rects[rects.length - 1];
    const width = lastRect ? lastRect.width : 0;

    document.body.removeChild(div);

    // Create a mirror div to measure total height
    const mirror = document.createElement("div");
    mirror.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${textarea.clientWidth}px;
      height: auto;
      font-size: ${state.settings.fontSize}px;
      font-family: ${window.getComputedStyle(textarea).fontFamily};
      line-height: ${state.settings.lineHeight};
      white-space: pre-wrap;
      word-wrap: break-word;
      visibility: hidden;
    `;
    mirror.textContent = textBeforeCursor;
    document.body.appendChild(mirror);

    // Get the total height of text before cursor
    const totalHeight = mirror.clientHeight;
    document.body.removeChild(mirror);

    // Calculate top position
    const lineHeight = state.settings.fontSize * state.settings.lineHeight;
    const top =
      totalHeight - (currentLine ? lineHeight : 0) + textarea.scrollTop;

    setCursorLeft(width);
    setCursorTop(top);
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
        const indentedText = lines.map((line) => "  " + line).join("\n");
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
        // If no selection, just insert two spaces at cursor position
        const newValue =
          value.substring(0, start) + "  " + value.substring(end);
        updateText(newValue);

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + 2;
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
            }}
            placeholder="Write..."
          />
          <div
            className="absolute w-0.5 animate-pulse"
            style={{
              backgroundColor: state.settings.theme.cursor,
              height: `${state.settings.fontSize * 1.5}px`,
              width: `${state.settings.cursorWidth}px`,
              left: `${cursorLeft}px`,
              top: `${cursorTop}px`,
              transition: `left 0.15s ease-out, top 0.15s ease-out, opacity 0.15s ease-out`,
              pointerEvents: "none",
              opacity: isFocused ? 1 : 0,
            }}
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
