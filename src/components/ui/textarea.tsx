import * as React from "react";
import { ChangeEvent, useCallback, useEffect } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, autoResize = false, value, onChange, maxRows, ...props },
    ref
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    // Combine the refs
    const handleRefs = (element: HTMLTextAreaElement) => {
      textAreaRef.current = element;

      // Handle the forwarded ref
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }

      // Initial resize when element is mounted
      if (autoResize && element) {
        resizeTextarea(element);
      }
    };

    const resizeTextarea = useCallback(
      (textarea: HTMLTextAreaElement) => {
        if (!textarea) return;

        // Store the current selection
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;

        // Reset height to get the correct scrollHeight
        textarea.style.height = "0px";
        textarea.style.height = "auto";

        const style = window.getComputedStyle(textarea);
        const borderHeight =
          parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
        const paddingHeight =
          parseInt(style.paddingTop) + parseInt(style.paddingBottom);

        const lineHeight = parseInt(style.lineHeight) || 20; // Default line height if not set
        const maxHeight = maxRows
          ? lineHeight * maxRows + borderHeight + paddingHeight
          : Infinity;

        const newHeight = Math.min(
          textarea.scrollHeight + borderHeight,
          maxHeight
        );

        textarea.style.height = `${newHeight}px`;

        // Restore the selection
        textarea.setSelectionRange(selectionStart, selectionEnd);
      },
      [maxRows]
    );

    // Auto-resize when value changes
    useEffect(() => {
      if (autoResize && textAreaRef.current) {
        resizeTextarea(textAreaRef.current);
      }
    }, [value, autoResize, resizeTextarea]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        resizeTextarea(e.target);
      }

      // Forward the onChange event
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <textarea
        className={cn(
          "flex bg-transparent",
          autoResize && "resize-none overflow-y-hidden",
          className
        )}
        ref={handleRefs}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
