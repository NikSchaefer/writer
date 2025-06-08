import { CURSOR_WIDTH, FONT_SIZE } from "@/config";

interface CursorProps {
  left: number;
  top: number;
  isVisible: boolean;
}

export function Cursor({ left, top, isVisible }: CursorProps) {
  return (
    <div
      className="absolute w-0.5 bg-writer-cursor"
      style={{
        height: `${FONT_SIZE * 1.5}px`,
        width: `${CURSOR_WIDTH}px`,
        left: `${left}px`,
        top: `${top}px`,
        transition: `left 0.2s ease-out, top 0.2s ease-out, opacity 0.2s ease-out`,
        pointerEvents: "none",
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
