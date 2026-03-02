"use client";

import { usePromptStore } from "@/stores/promptStore";
import { cn } from "@/lib/utils";
import type { Modality } from "@prompit/types";

const modes: { value: Modality; label: string; emoji: string }[] = [
  { value: "text", label: "Text", emoji: "✦" },
  { value: "image", label: "Image", emoji: "🖼" },
  { value: "video", label: "Video", emoji: "🎬" },
  { value: "audio", label: "Audio", emoji: "🎵" },
  { value: "code", label: "Code", emoji: "⌨" },
  { value: "3d", label: "3D", emoji: "🧊" },
];

export function ModeSelector() {
  const { mode, setMode } = usePromptStore();

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5",
            mode === m.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{m.emoji}</span>
          {m.label}
        </button>
      ))}
    </div>
  );
}
