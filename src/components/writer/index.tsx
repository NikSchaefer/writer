import { Footer } from "../Footer";
import { TextEditor } from "./TextEditor";

export function Writer() {
  return (
    <div className="min-h-screen overflow-y-auto relative bg-writer-background">
      <div className="radial fixed inset-0 w-full h-full z-10 pointer-events-none" />
      <div className="max-w-3xl mx-auto p-8">
        <TextEditor />
      </div>
      <Footer />
    </div>
  );
}
