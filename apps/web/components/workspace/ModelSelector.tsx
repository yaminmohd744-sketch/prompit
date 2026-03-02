"use client";

import { usePromptStore } from "@/stores/promptStore";
import { MODEL_REGISTRY } from "@prompit/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export function ModelSelector() {
  const { mode, selectedModels, setModels } = usePromptStore();
  const [open, setOpen] = useState(false);

  const available = MODEL_REGISTRY.filter((m) => m.modalities.includes(mode));

  function toggleModel(id: string) {
    if (selectedModels.includes(id)) {
      setModels(selectedModels.filter((m) => m !== id));
    } else {
      setModels([...selectedModels, id]);
    }
  }

  const selected = MODEL_REGISTRY.filter((m) => selectedModels.includes(m.id));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
      >
        <span className="text-muted-foreground">Models:</span>
        <span className="font-medium">
          {selected.length === 0
            ? "Select models"
            : selected.map((m) => m.name).join(", ")}
        </span>
        <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 w-80 bg-card border border-border rounded-lg shadow-lg p-2 space-y-1 max-h-80 overflow-y-auto">
          {available.map((model) => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left hover:bg-accent transition-colors",
                selectedModels.includes(model.id) && "bg-primary/10"
              )}
            >
              <div className="flex-1">
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground">
                  {model.provider} · {model.costCredits} credits
                </div>
              </div>
              {selectedModels.includes(model.id) && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
