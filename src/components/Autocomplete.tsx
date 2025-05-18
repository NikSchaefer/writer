import { useWriter } from "@/contexts/WriterContext";

export function Autocomplete() {
  const { state, updateText, updateAutocomplete } = useWriter();
  const { suggestions, activeIndex, isVisible, triggerWord } =
    state.autocomplete;

  if (!isVisible || suggestions.length === 0) return null;

  const handleSelect = (suggestion: string) => {
    const text = state.text;
    const cursorPos = state.cursorPosition;
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    // Find the start of the current word
    const wordStart = beforeCursor.lastIndexOf(" ");
    const newText =
      beforeCursor.slice(0, wordStart + 1) + suggestion + afterCursor;

    updateText(newText);
    updateAutocomplete({ isVisible: false });
  };

  return (
    <div
      className="absolute z-50 bg-background border rounded-md shadow-lg"
      style={{
        top: `${state.settings.fontSize * 1.5}px`,
        left: "0",
        minWidth: "200px",
        maxWidth: "300px",
      }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion}
          className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-accent ${
            index === activeIndex ? "bg-accent" : ""
          }`}
          onClick={() => handleSelect(suggestion)}
          style={{
            color: state.settings.theme.text,
          }}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}
