"use client";

import { usePromptStore } from "@/stores/promptStore";

export function ParameterPanel() {
  const { mode, parameters, updateParams } = usePromptStore();

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold">Parameters</h3>

      {(mode === "text" || mode === "code") && (
        <>
          <div>
            <label className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Temperature</span>
              <span>{parameters.temperature}</span>
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={parameters.temperature}
              onChange={(e) => updateParams({ temperature: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Max tokens
            </label>
            <input
              type="number"
              value={parameters.maxTokens}
              onChange={(e) => updateParams({ maxTokens: parseInt(e.target.value) })}
              className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Top P</span>
              <span>{parameters.topP}</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={parameters.topP}
              onChange={(e) => updateParams({ topP: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </>
      )}

      {mode === "image" && (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Resolution
            </label>
            <select
              className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
              onChange={(e) => updateParams({ resolution: e.target.value })}
            >
              <option value="1024x1024">1024×1024</option>
              <option value="1792x1024">1792×1024</option>
              <option value="1024x1792">1024×1792</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Seed (optional)
            </label>
            <input
              type="number"
              placeholder="Random"
              onChange={(e) =>
                updateParams({ seed: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
            />
          </div>
        </>
      )}

      {mode === "video" && (
        <>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Duration (seconds)
            </label>
            <select
              className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
              onChange={(e) => updateParams({ duration: parseInt(e.target.value) })}
            >
              <option value="5">5s</option>
              <option value="10">10s</option>
              <option value="15">15s</option>
            </select>
          </div>
        </>
      )}

      {mode === "audio" && (
        <>
          <div>
            <label className="text-xs text-muted-foreground flex justify-between mb-1">
              <span>Speed</span>
              <span>{parameters.speed ?? 1}×</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={parameters.speed ?? 1}
              onChange={(e) => updateParams({ speed: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>
        </>
      )}
    </div>
  );
}
