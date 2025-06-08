interface CursorProps {
  left: number;
  top: number;
  fontSize: number;
  width: number;
  color: string;
  isVisible: boolean;
}

export function Cursor({
  left,
  top,
  fontSize,
  width,
  color,
  isVisible,
}: CursorProps) {
  return (
    <div
      className="absolute w-0.5"
      style={{
        backgroundColor: color,
        height: `${fontSize * 1.5}px`,
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
        transition: `left 0.2s ease-out, top 0.2s ease-out, opacity 0.2s ease-out`,
        pointerEvents: "none",
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
}
