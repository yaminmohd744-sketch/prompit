"use client";

import { usePromptStore } from "@/stores/promptStore";
import { Send, Trash2 } from "lucide-react";

interface Props {
  onGenerate: () => void;
}

export function PromptInput({ onGenerate }: Props) {
  const { prompt, setPrompt, clearOutputs } = usePromptStore();

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  }

  return (
    <div className="relative">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you want to generate... (⌘+Enter to send)"
        rows={4}
        className="w-full px-4 py-3 pr-24 rounded-lg border border-input bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
      />
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={clearOutputs}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors"
          title="Clear outputs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={onGenerate}
          disabled={!prompt.trim()}
          className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
          title="Generate (⌘+Enter)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
