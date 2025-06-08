import { FONT_SIZE, LINE_HEIGHT } from "@/config";
import { Textarea } from "../ui/textarea";

interface ZenModeMaskProps {
  text: string;
  cursorTop: number;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function ZenModeMask({
  text,
  cursorTop,
  onInput,
  onKeyDown,
  onClick,
  onFocus,
  onBlur,
}: ZenModeMaskProps) {
  const endOffset = LINE_HEIGHT * 8;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        maskImage: `linear-gradient(to bottom, 
          transparent 0%,
          transparent calc(${cursorTop}px - ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          black calc(${cursorTop}px - ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          black calc(${cursorTop}px + ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          transparent calc(${cursorTop}px + ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          transparent 100%
        )`,
        WebkitMaskImage: `linear-gradient(to bottom, 
          transparent 0%,
          transparent calc(${cursorTop}px - ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          black calc(${cursorTop}px - ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          black calc(${cursorTop}px + ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          transparent calc(${cursorTop}px + ${
          (FONT_SIZE * LINE_HEIGHT) / 2
        }px + ${endOffset}px),
          transparent 100%
        )`,
        transition:
          "mask-position 0.1s ease-out, -webkit-mask-position 0.1s ease-out",
      }}
    >
      <Textarea
        autoResize
        value={text}
        onChange={onInput}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full text-writer-text font-text bg-transparent resize-none outline-none border-none shadow-none p-0 m-0 ring-0 absolute inset-0"
        style={{
          color: "var(--writer-text)",
          fontSize: `${FONT_SIZE}px`,
          lineHeight: LINE_HEIGHT,
          caretColor: "transparent",
          whiteSpace: "pre-wrap",
          minHeight: "60vh",
        }}
        placeholder="Write something interesting..."
      />
    </div>
  );
}
