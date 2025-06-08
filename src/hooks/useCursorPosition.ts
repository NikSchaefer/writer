import { useState, useCallback } from "react";
import { TAB_SIZE } from "@/config";

export function useCursorPosition() {
  const [cursorLeft, setCursorLeft] = useState(0);
  const [cursorTop, setCursorTop] = useState(0);

  const updateCursorPosition = useCallback((textarea: HTMLTextAreaElement) => {
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
    div.style.fontSize = `${window.getComputedStyle(textarea).fontSize}`;
    div.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.tabSize = TAB_SIZE.toString();
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
      font-size: ${window.getComputedStyle(textarea).fontSize};
      font-family: ${window.getComputedStyle(textarea).fontFamily};
      line-height: ${window.getComputedStyle(textarea).lineHeight};
      white-space: pre-wrap;
      word-wrap: break-word;
      tab-size: ${TAB_SIZE};
      visibility: hidden;
    `;
    mirror.textContent = textBeforeCursor;
    document.body.appendChild(mirror);

    // Get the total height of text before cursor
    const totalHeight = mirror.clientHeight;
    document.body.removeChild(mirror);

    // Calculate top position
    const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight);
    const top =
      totalHeight - (currentLine ? lineHeight : 0) + textarea.scrollTop;

    setCursorLeft(width);
    setCursorTop(top);
  }, []);

  return {
    cursorLeft,
    cursorTop,
    updateCursorPosition,
  };
}
