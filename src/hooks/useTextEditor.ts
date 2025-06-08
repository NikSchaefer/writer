import { useRef, useState } from "react";
import { useCursorPosition } from "@/hooks/useCursorPosition";
import { useWriterStore } from "@/store/writerStore";
import { TAB_SIZE } from "@/config";

export function useTextEditor() {
  const { updateText } = useWriterStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { cursorLeft, cursorTop, updateCursorPosition } = useCursorPosition();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updateText(newText);
    updateCursorPosition(e.target);
  };

  const handleIndentation = (textarea: HTMLTextAreaElement) => {
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
      return true;
    }

    // If no selection, just insert four spaces at cursor position
    const newValue = value.substring(0, start) + "    " + value.substring(end);
    updateText(newValue);

    // Set cursor position after the inserted spaces
    setTimeout(() => {
      textarea.selectionStart = start + TAB_SIZE + 1;
      textarea.selectionEnd = start + TAB_SIZE + 1;
      updateCursorPosition(textarea);
    }, 0);
    return true;
  };

  const handleArrowKeys = (textarea: HTMLTextAreaElement) => {
    setTimeout(() => {
      updateCursorPosition(textarea);
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    updateCursorPosition(textarea);
  };

  return {
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
  };
}
